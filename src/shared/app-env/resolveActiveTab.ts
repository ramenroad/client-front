import type { ActiveTab } from '@/shared/bridge'

/**
 * pathname → 활성 탭 매핑 (§2.9.3). **단일 소스** — useAppBar의 selected와 ROUTE_CHANGED 발신부가 공유.
 * detail/genre/login 등 탭 비귀속 화면은 null(하이라이트 없음).
 */
export function resolveActiveTab(pathname: string): ActiveTab | null {
  const seg = pathname.split('/')[1] ?? '' // useAppBar.ts:10 동일 규칙
  if (seg === '') {
    return 'home'
  }
  if (seg === 'map') {
    return 'map'
  }
  if (seg === 'community') {
    return 'community'
  }
  if (seg === 'mypage' || seg === 'user-review') {
    return 'my'
  }
  return null
}
