export const SortType = {
  DEFAULT: '기본순',
  RATING: '평점 높은 순',
  DISTANCE: '거리 가까운 순',
} as const

export type SortType = (typeof SortType)[keyof typeof SortType]

export type FilterOptions = {
  isOpen: boolean
  sort: SortType
  genre: string[]
}
