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

// 시트를 최하단(최소 높이)까지 내렸을 때만 내부 콘텐츠를 숨기고 상단 핸들바만 노출한다.
// 클램프가 정확히 MIN 값을 만들지만 부동소수 여유를 위해 1dvh 톨러런스를 둔다.
export const MAP_RESULT_SHEET_COLLAPSE_DVH = MAP_RESULT_SHEET_MIN_DVH + 1

export const parseSheetDvh = (height: string) => {
  const parsed = parseFloat(height)
  return Number.isFinite(parsed) ? parsed : MAP_RESULT_SHEET_MIN_DVH
}

export const toSheetDvh = (value: number) => `${value}dvh`

export const clampSheetDvh = (value: number) =>
  Math.min(MAP_RESULT_SHEET_MAX_DVH, Math.max(MAP_RESULT_SHEET_MIN_DVH, value))
