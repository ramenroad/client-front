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
    const isSignIn = state.isSignIn === true || Boolean(accessToken) || Boolean(refreshToken)

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
