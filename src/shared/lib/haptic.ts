import { BridgeMethods, has, invoke } from '@/shared/bridge'

/**
 * 네이티브 햅틱 트리거 — 앱에서만 동작하고 순수 웹/구버전 앱에선 no-op(has 가드).
 * 모두 fire-and-forget: 햅틱 실패가 UX 흐름(토스트/네비)을 막지 않게 에러를 삼킨다.
 */

type ImpactStyle = 'light' | 'medium' | 'heavy'
type NotificationType = 'success' | 'warning' | 'error'

export const hapticImpact = (style: ImpactStyle = 'light') => {
  if (!has(BridgeMethods.hapticImpact)) {
    return
  }
  invoke(BridgeMethods.hapticImpact, { style }).catch(() => {})
}

export const hapticSelection = () => {
  if (!has(BridgeMethods.hapticSelection)) {
    return
  }
  invoke(BridgeMethods.hapticSelection).catch(() => {})
}

export const hapticNotification = (type: NotificationType = 'success') => {
  if (!has(BridgeMethods.hapticNotification)) {
    return
  }
  invoke(BridgeMethods.hapticNotification, { type }).catch(() => {})
}
