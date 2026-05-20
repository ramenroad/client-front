import { useEffect, type ReactNode } from 'react'
import { authApi, authStore } from '@/features/auth'
import { initializeHttpAuth } from '@/shared/api'
import { PopupProvider } from '@/shared/ui/popup'
import { ToastProvider } from '@/shared/ui/toast'
import { queryClient } from './query-client'
import { AppQueryProvider } from './query-provider'

export const AppProviders = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    initializeHttpAuth({
      getAccessToken: authStore.getAccessToken,
      getRefreshToken: authStore.getRefreshToken,
      refreshTokens: authApi.refreshAccessToken,
      setTokens: authStore.setTokens,
      clearTokens: authStore.clearTokens,
      onUnauthorized: () => {
        queryClient.clear()
      },
    })

    const syncAuthStore = () => authStore.syncFromStorage()

    window.addEventListener('storage', syncAuthStore)
    window.addEventListener('focus', syncAuthStore)

    return () => {
      initializeHttpAuth(null)
      window.removeEventListener('storage', syncAuthStore)
      window.removeEventListener('focus', syncAuthStore)
    }
  }, [])

  return (
    <PopupProvider>
      <ToastProvider>
        <AppQueryProvider>{children}</AppQueryProvider>
      </ToastProvider>
    </PopupProvider>
  )
}
