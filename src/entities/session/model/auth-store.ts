import { useSyncExternalStore } from 'react'
import type { TokenPair } from './types'

const SIGN_IN_STORAGE_KEY = 'sign-in-storage'
const AUTH_SESSION_CHANGE_EVENT = 'auth-session-change'

type AuthSessionState = {
  isSignIn: boolean
  accessToken: string | null
  refreshToken: string | null
}

type AuthStoreSnapshot = AuthSessionState & {
  setTokens: (tokens: TokenPair) => void
  clearTokens: () => void
  syncFromStorage: () => void
}

type AuthStoreListener = () => void

const emptySession: AuthSessionState = {
  isSignIn: false,
  accessToken: null,
  refreshToken: null,
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const normalizeToken = (token: unknown) => (typeof token === 'string' && token.length > 0 ? token : null)

// 시계 오차 30초는 만료로 보지 않는다(조기 로그아웃 방지).
const TOKEN_CLOCK_SKEW_MS = 30_000

// access 토큰(JWT)이 '명확히' 만료됐는지만 판정한다.
// JWT가 아니거나 exp가 없거나 파싱 실패 시 false(=만료로 단정하지 않음)로, 확실할 때만 로그아웃되게 한다.
const isAccessTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return false
  }

  const segments = token.split('.')

  if (segments.length !== 3) {
    return false
  }

  try {
    const payload: unknown = JSON.parse(atob(segments[1].replace(/-/g, '+').replace(/_/g, '/')))

    if (!isRecord(payload) || typeof payload.exp !== 'number') {
      return false
    }

    return payload.exp * 1000 + TOKEN_CLOCK_SKEW_MS < Date.now()
  } catch {
    return false
  }
}

export const parseAuthStorageSnapshot = (storageValue: string | null): AuthSessionState => {
  if (!storageValue) {
    return emptySession
  }

  try {
    const parsed: unknown = JSON.parse(storageValue)
    const state = isRecord(parsed) && isRecord(parsed.state) ? parsed.state : parsed

    if (!isRecord(state)) {
      return emptySession
    }

    const accessToken = normalizeToken(state.accessToken)
    const refreshToken = normalizeToken(state.refreshToken)
    // refresh 토큰이 있으면 access 만료 시 재발급으로 세션 유지가 가능하므로 로그인으로 본다.
    // refresh 토큰이 없고 access가 명확히 만료됐다면, 살릴 수 없는 세션이므로 비로그인으로 판정해
    // 죽은 토큰으로 인증 요청을 날리는 것(=401 유발)을 막는다.
    const hasUsableAccess = Boolean(accessToken) && !isAccessTokenExpired(accessToken)
    const isSignIn = hasUsableAccess || Boolean(refreshToken)

    return {
      isSignIn,
      accessToken,
      refreshToken,
    }
  } catch {
    return emptySession
  }
}

const getStorageValue = (storage: Storage | undefined) => {
  try {
    return storage?.getItem(SIGN_IN_STORAGE_KEY) ?? null
  } catch {
    return null
  }
}

const readStoredAuthSession = (): AuthSessionState => {
  if (typeof window === 'undefined') {
    return emptySession
  }

  const localSession = parseAuthStorageSnapshot(getStorageValue(window.localStorage))

  if (localSession.isSignIn) {
    return localSession
  }

  return parseAuthStorageSnapshot(getStorageValue(window.sessionStorage))
}

const writeStoredAuthSession = (tokens: TokenPair) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    SIGN_IN_STORAGE_KEY,
    JSON.stringify({
      state: {
        isSignIn: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      version: 0,
    }),
  )
  window.sessionStorage.removeItem(SIGN_IN_STORAGE_KEY)
}

const removeStoredAuthSession = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(SIGN_IN_STORAGE_KEY)
  window.sessionStorage.removeItem(SIGN_IN_STORAGE_KEY)
}

const dispatchAuthSessionChange = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT))
}

const createAuthStore = () => {
  let state = readStoredAuthSession()
  let snapshot: AuthStoreSnapshot
  const listeners = new Set<AuthStoreListener>()

  const notify = () => {
    listeners.forEach((listener) => listener())
    dispatchAuthSessionChange()
  }

  const setState = (nextState: AuthSessionState, shouldPersist = true) => {
    state = nextState
    snapshot = createSnapshot()

    if (shouldPersist) {
      if (nextState.accessToken && nextState.refreshToken) {
        writeStoredAuthSession({ accessToken: nextState.accessToken, refreshToken: nextState.refreshToken })
      } else {
        removeStoredAuthSession()
      }
    }

    notify()
  }

  const createSnapshot = (): AuthStoreSnapshot => ({
    ...state,
    setTokens: (tokens) => {
      setState({
        isSignIn: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
    },
    clearTokens: () => {
      setState(emptySession)
    },
    syncFromStorage: () => {
      const storedSession = readStoredAuthSession()
      const isSameSession =
        storedSession.isSignIn === state.isSignIn &&
        storedSession.accessToken === state.accessToken &&
        storedSession.refreshToken === state.refreshToken

      if (!isSameSession) {
        setState(storedSession, false)
      }
    },
  })

  snapshot = createSnapshot()

  return {
    subscribe(listener: AuthStoreListener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot() {
      return snapshot
    },
    getSession() {
      return state
    },
    getAccessToken() {
      return state.accessToken
    },
    getRefreshToken() {
      return state.refreshToken
    },
    setTokens(tokens: TokenPair) {
      snapshot.setTokens(tokens)
    },
    clearTokens() {
      snapshot.clearTokens()
    },
    syncFromStorage() {
      snapshot.syncFromStorage()
    },
    storageKey: SIGN_IN_STORAGE_KEY,
    changeEvent: AUTH_SESSION_CHANGE_EVENT,
  }
}

export const authStore = createAuthStore()

export const useAuthStore = () => {
  return useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, authStore.getSnapshot)
}

export type { AuthSessionState, AuthStoreSnapshot }
