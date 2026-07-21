import type { ActiveTab } from '@/shared/bridge'

/**
 * pathname → 활성 탭 매핑 (§2.9.3). **단일 소스** — useAppBar의 selected와 ROUTE_CHANGED 발신부가 공유.
 * detail/genre/login 등 탭 비귀속 화면은 null(하이라이트 없음).
 *
 * 여기서 탭을 반환하면 앱에선 네이티브가 그 탭으로 **강제 전환**한다(ROUTE_CHANGED → App.tsx setIndex).
 * 그러니 "그 탭 안에서만 열리는 화면"만 탭을 반환해야 한다 — 탭 루트가 아닌 마이 탭 하위 화면
 * (/my-activity·/my-search·/information·/review/list)이 전부 null인 것도 같은 이유다.
 * /user-review도 마찬가지다: 진입점이 커뮤니티 상세·커뮤니티 목록·리뷰 카드(홈 탭)라, 'my'로 분류하면
 * 프로필을 누른 순간 네이티브가 마이 탭으로 갈아타 상주 중인 /mypage가 뜬다(남의 리뷰 대신 내 마이페이지).
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
  if (seg === 'mypage') {
    return 'my'
  }
  return null
}
