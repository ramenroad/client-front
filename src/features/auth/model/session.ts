import { authStore, parseAuthStorageSnapshot, useAuthStore } from './auth-store'
import type { TokenPair } from './types'

export type AuthSessionSnapshot = ReturnType<typeof authStore.getSession>

export const parseSignInSnapshot = parseAuthStorageSnapshot

export const getStoredAuthSession = () => authStore.getSession()

export const getStoredAccessToken = () => authStore.getAccessToken()

export const setStoredAuthSession = (tokens: TokenPair) => authStore.setTokens(tokens)

export const clearStoredAuthSession = () => authStore.clearTokens()

export const useAuthSession = useAuthStore
