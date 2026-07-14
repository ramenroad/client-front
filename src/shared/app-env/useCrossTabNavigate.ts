import { useCallback } from 'react'
import { BridgeTopics, emit, getAppGlobal, isInApp } from '@/shared/bridge'
import { navigateToPath } from '@/shared/navigation'
import { resolveActiveTab } from './resolveActiveTab'

/**
 * 탭 인지 네비게이션 — 앱에서 "다른 탭이 소유한 라우트"(예: 홈에서 /map)로 갈 땐 in-place 이동 대신
 * SWITCH_TAB을 네이티브에 보내, 그 탭으로 전환 + 그 탭 WebView가 경로를 로드하게 한다.
 * 현재 탭 WebView가 다른 탭 영역을 침범(오염)하는 걸 막는다.
 *
 * 같은 탭 라우트, 탭 없는 라우트(/detail·/genre 등), 순수 웹/구버전 앱에선 일반 네비게이션으로 폴백한다.
 * 탭 전환을 모든 네비게이션에 걸면 안 된다 — 커뮤니티에서 /user-review로 가는 것처럼 탭 소유로 분류되지만
 * 제자리에서 열려야 하는 화면이 있다. 어떤 이동이 탭 전환인지는 호출부가 명시적으로 고른다.
 */
export function useCrossTabNavigate() {
  return useCallback((path: string) => {
    const targetTab = resolveActiveTab(path.split('?')[0])
    const myTab = getAppGlobal()?.tab

    // 앱이고, 대상이 탭 소유 라우트이며, 그 탭이 이 WebView의 소유 탭과 다를 때만 탭 전환으로 위임.
    if (isInApp() && targetTab && myTab && targetTab !== myTab) {
      emit(BridgeTopics.switchTab, { tab: targetTab, path })
      return
    }

    navigateToPath(path)
  }, [])
}
