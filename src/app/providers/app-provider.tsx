import { useEffect, type ReactNode } from 'react'
import { authStore } from '@/entities/session/model'
import { authApi } from '@/features/auth'
import { initializeHttpAuth } from '@/shared/api'
import { ThemeProvider } from '@/shared/model'
import { PopupProvider } from '@/shared/ui/popup'
import { ToastProvider } from '@/shared/ui/toast'
import { queryClient } from './query-client'
import { AppQueryProvider } from './query-provider'
import { BridgeTopics, installBridge, isInApp, on } from '@/shared/bridge'
import { applyAppEnvToDom, readAppEnv, setSafeInsets } from '@/shared/app-env'
import { goBack, navigateToPath, navigationStore, scrollActiveScreenTo } from '@/shared/navigation'

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

  // 네이티브 브리지 동기화 (W1/W4). 웹 → 네이티브 발신(ROUTE_CHANGED/BACK_STATE)은 스택 플러그인이 맡고,
  // 여기서는 네이티브 → 웹 수신만 처리한다. 순수 웹에선 applyAppEnvToDom만 하고 즉시 종료.
  useEffect(() => {
    installBridge()
    applyAppEnvToDom(readAppEnv())
    if (!isInApp()) {
      return
    }

    const offInsets = on(BridgeTopics.safeAreaInsets, (payload) => {
      const insets = (payload as { insets?: { top: number; bottom: number; left: number; right: number } })?.insets
      if (insets) {
        setSafeInsets(insets)
      }
    })

    // 탭 터치. 탭 루트는 singleton이라 스택 아래에 살아 있으면 navigateToPath가 새로 쌓지 않고 되감는다
    // — 지도/홈이 두 장 뜨지 않는다.
    const offNavigate = on(BridgeTopics.navigate, (payload) => {
      const p = payload as { tab?: string; path?: string }
      const path = typeof p?.path === 'string' ? p.path : '/'
      // 로그인 분기는 웹 소유(useAppBar 동일): 'my' 탭 + 비로그인 → /login
      const target = p?.tab === 'my' && !authStore.getSession().isSignIn ? '/login' : path

      if (target === navigationStore.getSnapshot().path) {
        scrollActiveScreenTo(0) // 재탭/동일 경로 → 스크롤 top(§2.9.2)
        return
      }

      navigateToPath(target)
    })

    // G5: 네이티브 백버튼 위임 — 웹이 처리 가능할 때만(스택이 쌓였거나 step이 있을 때) 되감는다.
    // 탭 루트에선 canGoBack이 false라 네이티브가 그대로 소유한다.
    const offAndroidBack = on(BridgeTopics.androidBackPress, () => {
      if (navigationStore.getSnapshot().canGoBack) {
        goBack()
      }
    })

    // 화면마다 자기 스크롤 컨테이너를 가지므로 window가 아니라 활성 화면을 스크롤한다.
    const offScrollTop = on(BridgeTopics.scrollTop, () => scrollActiveScreenTo(0))

    const offKeyboard = on(BridgeTopics.keyboard, (payload) => {
      const height = (payload as { height?: number })?.height ?? 0
      // 변수만 노출(W6). 레이아웃 소비는 Android adjustResize 이중보정 회피 위해 보류(G3/T2).
      document.documentElement.style.setProperty('--keyboard-height', `${height}px`)
    })

    return () => {
      offInsets()
      offNavigate()
      offAndroidBack()
      offScrollTop()
      offKeyboard()
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
