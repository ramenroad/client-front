import { useEffect, type ReactNode } from 'react'
import { authStore } from '@/entities/session/model'
import { authApi } from '@/features/auth'
import { initializeHttpAuth } from '@/shared/api'
import { ThemeProvider } from '@/shared/model'
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
    <ThemeProvider>
      <PopupProvider>
        <ToastProvider>
          <AppQueryProvider>{children}</AppQueryProvider>
        </ToastProvider>
      </PopupProvider>
    </ThemeProvider>
  )
}
