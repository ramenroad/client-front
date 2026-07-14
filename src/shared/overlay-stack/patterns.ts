import { matchPath } from 'react-router-dom'

/**
 * 오버레이 스택 대상 라우트 (G6 Phase 1 — 라우터의 OverlayLayout 3종과 동일 집합).
 * 앱(브리지 연결)에서는 이 경로들을 라우터 push 대신 인페이지 레이어로 얹어
 * WebView back-forward 목록을 늘리지 않는다 — back 항목이 없으면 iOS 뒤로가기 스와이프(스냅샷 제스처)가
 * 아예 발동하지 않는 성질을 이용해, 스와이프 백 흰 화면(스냅샷 백지화)을 원천 회피한다.
 */
export const OVERLAY_PATH_PATTERNS = [
  '/my-calendar',
  '/community/write',
  '/community/write/:id',
  '/community/:id',
] as const

// '/community/:id' 동적 패턴이 정적 형제 라우트를 삼키지 않도록 명시 제외(라우터의 정적 우선 랭킹과 동일하게).
const EXCLUDED_STATIC_PATHS = ['/community/notifications'] as const

/** path(쿼리 포함 가능)가 오버레이 스택 대상 라우트인지 판별. */
export const isOverlayPath = (path: string): boolean => {
  const pathname = path.split('?')[0] ?? ''
  if (EXCLUDED_STATIC_PATHS.some((excluded) => matchPath(excluded, pathname) != null)) {
    return false
  }
  return OVERLAY_PATH_PATTERNS.some((pattern) => matchPath(pattern, pathname) != null)
}
