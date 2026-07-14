import { useSyncExternalStore } from 'react'
import type { ActivityBaseParams } from '@stackflow/config'
import { buildActivityPath, matchActivityPath } from './path'
import type { ActivityName } from './routes'

export interface StackEntry {
  id: string
  name: ActivityName
  params: ActivityBaseParams
}

export interface NavigationSnapshot {
  activityName: ActivityName
  params: ActivityBaseParams
  /** 후행 슬래시 없는 정규 경로(+쿼리). 브리지 계약·탭 판별·로그인 복귀 경로의 기준. */
  path: string
  /** 살아있는 액티비티(바닥 → top). singleton 재진입 시 되감을 지점을 찾는 데 쓴다. */
  stack: readonly StackEntry[]
  /** 웹이 뒤로가기를 처리할 수 있는가 — 액티비티가 2장 이상이거나 step이 쌓여 있음. */
  canGoBack: boolean
}

/**
 * 스택 상태의 읽기 전용 미러.
 *
 * Stackflow의 useStack/useActivity는 <Stack /> 컨텍스트 안에서만 쓸 수 있는데, 웹 AppBar와 브리지
 * 리스너(app-provider)는 스택 **밖**에 있다. 그래서 스택 플러그인이 변화를 여기에 밀어넣고,
 * 바깥 소비자는 이 스토어만 본다. 스토어 컨벤션은 auth-store/app-env와 동일(useSyncExternalStore, R-A).
 */
const readInitialSnapshot = (): NavigationSnapshot => {
  const matched =
    typeof window === 'undefined'
      ? null
      : matchActivityPath(`${window.location.pathname}${window.location.search}`)

  const name = matched?.name ?? 'Home'
  const params = matched?.params ?? {}

  return {
    activityName: name,
    params,
    path: buildActivityPath(name, params),
    stack: [{ id: 'initial', name, params }],
    canGoBack: false,
  }
}

let snapshot: NavigationSnapshot = readInitialSnapshot()
const listeners = new Set<() => void>()

export const setNavigationSnapshot = (next: NavigationSnapshot) => {
  snapshot = next
  listeners.forEach((listener) => listener())
}

export const navigationStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot() {
    return snapshot
  },
}

export const useNavigationSnapshot = (): NavigationSnapshot =>
  useSyncExternalStore(navigationStore.subscribe, navigationStore.getSnapshot, navigationStore.getSnapshot)
