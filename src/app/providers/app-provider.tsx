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
    // 세션 만료를 1회만 처리한다. queryClient.clear()는 마운트된 모든 쿼리를 즉시 재요청시키는데,
    // 그 재요청이 다시 401 → onUnauthorized → clear() → 재요청으로 무한 루프(화면 깜빡임)가 된다.
    // 가드를 둬 clear()는 한 번만 돌게 하고, 재로그인(setTokens) 시 해제한다.
    let isHandlingUnauthorized = false

    initializeHttpAuth({
      getAccessToken: authStore.getAccessToken,
      getRefreshToken: authStore.getRefreshToken,
      refreshTokens: authApi.refreshAccessToken,
      setTokens: (tokens) => {
        isHandlingUnauthorized = false
        authStore.setTokens(tokens)
      },
      clearTokens: authStore.clearTokens,
      onUnauthorized: () => {
        if (isHandlingUnauthorized) {
          return
        }

        isHandlingUnauthorized = true
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
