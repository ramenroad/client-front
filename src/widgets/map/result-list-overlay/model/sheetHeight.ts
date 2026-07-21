export const MAP_RESULT_SHEET_HEIGHTS = {
  COLLAPSED: '8dvh',
  HALF: '35dvh',
  EXPANDED: '80dvh',
} as const

export type MapResultSheetHeight = (typeof MAP_RESULT_SHEET_HEIGHTS)[keyof typeof MAP_RESULT_SHEET_HEIGHTS]

export const MAP_RESULT_SHEET_HEIGHT_VALUES = [
  MAP_RESULT_SHEET_HEIGHTS.COLLAPSED,
  MAP_RESULT_SHEET_HEIGHTS.HALF,
  MAP_RESULT_SHEET_HEIGHTS.EXPANDED,
] as const

// 자유 드래그 경계(dvh). 최소/최대는 기존 COLLAPSED/EXPANDED와 동일하게 유지한다.
export const MAP_RESULT_SHEET_MIN_DVH = 8
// 상한: 시트 최상단이 상단 고정 검색바 아래에 머물도록 잡는다 — 시트가 검색바(좌측 뒤로가기 포함)를 덮지 않게 하는 한계선.
export const MAP_RESULT_SHEET_MAX_DVH = 80

export const parseSheetDvh = (height: string) => {
  const parsed = parseFloat(height)
  return Number.isFinite(parsed) ? parsed : MAP_RESULT_SHEET_MIN_DVH
}

export const toSheetDvh = (value: number) => `${value}dvh`

export const clampSheetDvh = (value: number) =>
  Math.min(MAP_RESULT_SHEET_MAX_DVH, Math.max(MAP_RESULT_SHEET_MIN_DVH, value))

// 플릭(빠르게 튕기기)의 관성을 반영하는 투영 시간(ms). 클수록 약한 플릭도 다음 detent로 잘 넘어간다.
export const SHEET_FLICK_PROJECTION_MS = 160

// 상단 고정 검색바 관련 px 상수 — CSS(SearchOverlayInputBar의 h-48)와 동기화해야 한다.
export const SHEET_SEARCH_BAR_HEIGHT_PX = 48
// 펼침 시 검색바 하단과 시트 top 사이에 두는 최소 여유(px).
export const SHEET_TOP_GAP_PX = 16
// 최소 높이일 때 손잡이(h-32=32) + 필터 줄(py-11 + h-30 = 52) + 컨테이너 상·하 보더(2)가 딱 들어오는 높이(px).
// 이 높이에선 "필터 헤더까지만" 보이고 리스트는 렌더링하지 않는다(빈틈·스크롤 없이 정확히).
export const SHEET_HEADER_MIN_PX = 86
export const SHEET_MIN_HEIGHT_CSS = `${SHEET_HEADER_MIN_PX}px`

// 시트가 검색바를 침범하지 않는 최대 높이(CSS 식).
// 시트 컨테이너(MapScreen)는 100dvh - --app-bar-space(웹 하단 탭바) 높이이고, 검색바 하단은
// --map-search-top + 48px이다. 여기에 여유(16)를 더해 빼면 웹(탭바)·앱·세이프에어리어가 모두 반영된다.
// dvh 단위를 px로 재구성하지 않고 브라우저가 직접 계산하도록 CSS 식으로 둔다.
export const SHEET_MAX_HEIGHT_CSS = `calc(100dvh - var(--app-bar-space) - var(--map-search-top) - ${
  SHEET_SEARCH_BAR_HEIGHT_PX + SHEET_TOP_GAP_PX
}px)`

// [minDvh, maxDvh] 범위로 클램프한다.
export const clampSheetDvhTo = (value: number, minDvh: number, maxDvh: number): number =>
  Math.min(maxDvh, Math.max(minDvh, value))

// 동적 하한/상한을 반영한 detent 목록(오름차순). 중간(HALF)은 [min, max] 범위로 클램프한다.
export const getSheetDetentsDvh = (minDvh: number, maxDvh: number): number[] => {
  const halfDvh = Math.min(Math.max(parseSheetDvh(MAP_RESULT_SHEET_HEIGHTS.HALF), minDvh), maxDvh)
  return [minDvh, halfDvh, maxDvh]
}

// 주어진 높이(dvh)에서 detent 목록 중 가장 가까운 값을 고른다.
export const nearestSheetDetentDvh = (value: number, detents: readonly number[]): number =>
  detents.reduce((closest, detent) => (Math.abs(detent - value) < Math.abs(closest - value) ? detent : closest))

// 놓는 높이에 릴리스 속도를 반영(관성 투영)한 뒤, 주어진 detent 중 가장 가까운 값으로 스냅한다.
// velocityDvhPerMs: 양수면 확장(위) 방향.
export const projectSheetDetentDvh = (
  heightDvh: number,
  velocityDvhPerMs: number,
  detents: readonly number[],
): number => {
  const minDvh = detents[0]
  const maxDvh = detents[detents.length - 1]
  const projectedDvh = clampSheetDvhTo(heightDvh + velocityDvhPerMs * SHEET_FLICK_PROJECTION_MS, minDvh, maxDvh)
  return nearestSheetDetentDvh(projectedDvh, detents)
}
