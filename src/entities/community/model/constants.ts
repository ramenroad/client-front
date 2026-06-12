export const COMMUNITY_BOARD_CATEGORIES = ['전체', '이벤트', '신장개업', '질문'] as const

export type CommunityBoardCategory = (typeof COMMUNITY_BOARD_CATEGORIES)[number]
export type CommunityBoardFilterCategory = Exclude<CommunityBoardCategory, '전체'>
export type CommunityBoardListTabKey = 'all' | 'event' | 'opening' | 'question'

export interface CommunityBoardListTab {
  key: CommunityBoardListTabKey
  label: string
  category?: CommunityBoardFilterCategory
}

export const COMMUNITY_BOARD_LIST_TABS: readonly CommunityBoardListTab[] = [
  { key: 'all', label: '전체' },
  { key: 'event', label: '이벤트', category: '이벤트' },
  { key: 'opening', label: '신장개업', category: '신장개업' },
  { key: 'question', label: '질문', category: '질문' },
] as const

export const MAX_COMMUNITY_IMAGE_COUNT = 10
