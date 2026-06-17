import { useEffect, type ReactNode } from 'react'
import { authStore } from '@/entities/session/model'
import { authApi } from '@/features/auth'
import { initializeHttpAuth } from '@/shared/api'
import { ThemeProvider } from '@/shared/model'
import { PopupProvider } from '@/shared/ui/popup'
import { ToastProvider } from '@/shared/ui/toast'
import { queryClient } from './query-client'
import { AppQueryProvider } from './query-provider'
import { BridgeTopics, emit, installBridge, isInApp, on } from '@/shared/bridge'
import { applyAppEnvToDom, readAppEnv, resolveActiveTab, setSafeInsets } from '@/shared/app-env'
import { router } from '@/app/router'

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

  // #4: 새 화면(PUSH)은 스크롤 최상단에서 시작. 뒤로가기(POP)/치환(REPLACE)은 위치 유지.
  // 페이지는 window 스크롤을 쓰므로 window 기준(풀블리드 지도는 window 스크롤이 없어 무해). 웹/앱 공통.
  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      if (state.historyAction === 'PUSH') {
        window.scrollTo(0, 0)
      }
    })
    return unsubscribe
  }, [])

  // 네이티브 브리지 동기화 (W1/W4). 순수 웹에선 applyAppEnvToDom만 하고 즉시 종료.
  useEffect(() => {
    installBridge()
    applyAppEnvToDom(readAppEnv())
    if (!isInApp()) {
      return
    }

    const tabRoots: Record<string, string> = {
      home: '/',
      map: '/map',
      community: '/community',
      my: '/mypage',
    }

    const isAtTabRoot = () => {
      const path = router.state.location.pathname
      const activeTab = resolveActiveTab(path)
      return activeTab != null && tabRoots[activeTab] === path
    }

    const sendRouteChanged = () => {
      const path = router.state.location.pathname
      const activeTab = resolveActiveTab(path)
      const isRootOfTab = activeTab != null && tabRoots[activeTab] === path
      emit(BridgeTopics.routeChanged, { path, activeTab, isRootOfTab })
      // G5: 탭 루트가 아니면 웹이 뒤로가기(history pop) 처리 가능 → 네이티브가 백버튼/스와이프를 웹에 위임.
      emit(BridgeTopics.backState, { canHandle: !isRootOfTab })
    }

    // 네이티브 → 웹
    const offInsets = on(BridgeTopics.safeAreaInsets, (payload) => {
      const insets = (payload as { insets?: { top: number; bottom: number; left: number; right: number } })?.insets
      if (insets) {
        setSafeInsets(insets)
      }
    })
    const offNavigate = on(BridgeTopics.navigate, (payload) => {
      const p = payload as { tab?: string; path?: string }
      const path = typeof p?.path === 'string' ? p.path : '/'
      // 로그인 분기는 웹 소유(useAppBar 동일): 'my' 탭 + 비로그인 → /login
      const target = p?.tab === 'my' && !authStore.getSession().isSignIn ? '/login' : path
      if (target === window.location.pathname) {
        window.scrollTo(0, 0) // 재탭/동일 경로 → 스크롤 top(§2.9.2)
      } else {
        router.navigate(target).catch(() => undefined)
      }
    })
    // G5: 네이티브 안드로이드 백버튼 위임 → 탭 루트가 아니면 웹 history pop(루트면 네이티브가 무력화).
    const offAndroidBack = on(BridgeTopics.androidBackPress, () => {
      if (!isAtTabRoot()) {
        router.navigate(-1).catch(() => undefined)
      }
    })
    const offScrollTop = on(BridgeTopics.scrollTop, () => window.scrollTo(0, 0))
    const offKeyboard = on(BridgeTopics.keyboard, (payload) => {
      const height = (payload as { height?: number })?.height ?? 0
      // 변수만 노출(W6). 레이아웃 소비는 Android adjustResize 이중보정 회피 위해 보류(G3/T2).
      document.documentElement.style.setProperty('--keyboard-height', `${height}px`)
    })

    // 웹 → 네이티브: 모든 네비게이션에서 ROUTE_CHANGED (NAVIGATE 재발신 금지 → 무한루프 방지)
    sendRouteChanged() // 초기 1회
    const unsubscribeRouter = router.subscribe(() => sendRouteChanged())

    return () => {
      offInsets()
      offNavigate()
      offAndroidBack()
      offScrollTop()
      offKeyboard()
      unsubscribeRouter()
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
