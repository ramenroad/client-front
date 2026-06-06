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
export const MAP_RESULT_SHEET_MAX_DVH = 80

// 이 높이(dvh) 이하에서는 내부 콘텐츠를 숨기고 상단 핸들바만 노출한다(최소 높이 영역).
export const MAP_RESULT_SHEET_CONTENT_MIN_DVH = 20

export const parseSheetDvh = (height: string) => {
  const parsed = parseFloat(height)
  return Number.isFinite(parsed) ? parsed : MAP_RESULT_SHEET_MIN_DVH
}

export const toSheetDvh = (value: number) => `${value}dvh`

export const clampSheetDvh = (value: number) =>
  Math.min(MAP_RESULT_SHEET_MAX_DVH, Math.max(MAP_RESULT_SHEET_MIN_DVH, value))
