import { useSyncExternalStore } from 'react'

/**
 * 오버레이 레이어 스택 스토어 (G6) — appEnv/auth-store와 동일한 useSyncExternalStore 컨벤션(zustand 미도입).
 * 데이터만 보유하고 부수효과는 두지 않는다: URL replaceState 동기화·ROUTE_CHANGED/backState 재발신은
 * app 레이어(app-provider)가 subscribe로 수행하고, 레이어 렌더링은 OverlayStackHost(app)가 담당한다.
 */
export interface OverlayLayer {
  key: number
  /** 레이어가 표현하는 경로(쿼리 포함). 레이어 내부 라우팅이 바뀌면 updatePath로 따라온다. */
  path: string
  /** 닫힘 애니메이션 진행 중 — 호스트가 transitionend 후 finalizePop으로 실제 제거한다. */
  closing: boolean
}

let layers: readonly OverlayLayer[] = []
let seq = 0
const listeners = new Set<() => void>()

const setLayers = (next: readonly OverlayLayer[]) => {
  layers = next
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => layers

/** 닫히는 중이 아닌 최상단 레이어 경로 — URL/ROUTE_CHANGED가 바라보는 "현재 화면". 없으면 null. */
const getEffectivePath = (): string | null => {
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const layer = layers[i]
    if (layer && !layer.closing) {
      return layer.path
    }
  }
  return null
}

const hasOpenLayer = () => layers.some((layer) => !layer.closing)

const push = (path: string) => {
  setLayers([...layers, { key: (seq += 1), path, closing: false }])
}

/** 최상단 교체(글 등록 → 상세 같은 replace 의도 네비). 진입 애니메이션 없이 즉시 스왑된다. */
const replaceTop = (path: string) => {
  if (layers.length === 0) {
    push(path)
    return
  }
  setLayers([...layers.slice(0, -1), { key: (seq += 1), path, closing: false }])
}

/** 레이어 내부 라우팅(쿼리 갱신 등)을 스택 경로에 반영 — URL 동기화·새로고침 복원 정확도 유지용. */
const updatePath = (key: number, path: string) => {
  const target = layers.find((layer) => layer.key === key)
  if (!target || target.path === path) {
    return
  }
  setLayers(layers.map((layer) => (layer.key === key ? { ...layer, path } : layer)))
}

/**
 * 최상단 레이어 닫힘 시작(뒤로가기 위임/TopBar). 이미 닫히는 중이면 무시(멱등 — StrictMode·연타 안전).
 * @returns 닫힘을 시작했으면 true — androidBackPress 소비 여부 판단에 쓴다.
 */
const requestPop = (): boolean => {
  const top = layers[layers.length - 1]
  if (!top || top.closing) {
    return false
  }
  setLayers([...layers.slice(0, -1), { ...top, closing: true }])
  return true
}

/** 닫힘 애니메이션/스와이프 완료 후 실제 제거. 이미 제거된 key는 무시(중복 transitionend 안전). */
const finalizePop = (key: number) => {
  if (!layers.some((layer) => layer.key === key)) {
    return
  }
  setLayers(layers.filter((layer) => layer.key !== key))
}

/** 외부 라우터 네비게이션·이스케이프 시 전체 제거(애니메이션 없음). 비어 있으면 no-op. */
const clear = () => {
  if (layers.length === 0) {
    return
  }
  setLayers([])
}

export const overlayStackStore = {
  subscribe,
  getSnapshot,
  getEffectivePath,
  hasOpenLayer,
  push,
  replaceTop,
  updatePath,
  requestPop,
  finalizePop,
  clear,
}

export const useOverlayLayers = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
