import type { Activity, Stack } from '@stackflow/core'
import type { StackflowReactPlugin } from '@stackflow/react'
import { resolveActiveTab } from '@/shared/app-env'
import { BridgeTopics, emit } from '@/shared/bridge'
import {
  buildActivityPath,
  setNavigationSnapshot,
  type ActivityName,
  type StackEntry,
} from '@/shared/navigation'

/** 각 탭 WebView의 루트 경로 (§2.9.2) — 여기서만 네이티브가 백버튼/스와이프를 소유한다. */
const TAB_ROOTS: Record<string, string> = {
  home: '/',
  map: '/map',
  community: '/community',
  my: '/mypage',
}

/** 빠져나가는 중인 액티비티는 이미 "없는 화면"이다 — 깊이/뒤로가기 판정에서 제외한다. */
const aliveActivities = (stack: Stack): Activity[] =>
  stack.activities.filter(
    (activity) => activity.transitionState === 'enter-active' || activity.transitionState === 'enter-done',
  )

const toStackEntry = (activity: Activity): StackEntry => ({
  id: activity.id,
  name: activity.name as ActivityName,
  params: activity.params,
})

const sync = (stack: Stack) => {
  const alive = aliveActivities(stack)
  const current = alive[alive.length - 1]

  if (!current) {
    return
  }

  const name = current.name as ActivityName
  const path = buildActivityPath(name, current.params)
  const pathname = path.split('?')[0]

  // 액티비티가 쌓였거나(2장 이상) 현재 화면에 step이 쌓였으면(지도 상세 시트 등) 웹이 뒤로가기를 처리한다.
  const canGoBack = alive.length > 1 || current.steps.length > 1

  setNavigationSnapshot({
    activityName: name,
    params: current.params,
    path,
    stack: alive.map(toStackEntry),
    canGoBack,
  })

  // 웹 → 네이티브. emit은 순수 웹에서 no-op이라 분기가 필요 없다.
  const activeTab = resolveActiveTab(pathname)
  emit(BridgeTopics.routeChanged, {
    path: pathname,
    activeTab,
    isRootOfTab: activeTab != null && TAB_ROOTS[activeTab] === pathname,
  })
  // G5: 웹이 뒤로가기를 처리할 수 있으면 네이티브가 백버튼/스와이프를 웹에 위임한다.
  emit(BridgeTopics.backState, { canHandle: canGoBack })
}

/**
 * 스택 상태 → (1) navigationStore (2) 네이티브 브리지.
 *
 * 구 app-provider의 router.subscribe 배선을 대체한다. 스택 밖에 있는 소비자(웹 AppBar, 브리지 리스너)는
 * Stackflow 컨텍스트에 접근할 수 없으므로, 부수효과를 이 플러그인 한 곳에 모아 스토어로 흘려보낸다.
 */
export const bridgePlugin = (): StackflowReactPlugin => () => ({
  key: 'raising-bridge',
  onInit({ actions }) {
    sync(actions.getStack())
  },
  onChanged({ actions }) {
    sync(actions.getStack())
  },
})
