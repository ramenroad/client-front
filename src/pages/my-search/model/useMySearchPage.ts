import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRecentViewedRamenyaQuery } from '@/entities/activity/api'
import type { RecentViewedRamenyaInfo } from '@/entities/activity/model'
import { useMyBookmarksQuery } from '@/features/bookmark'
import type { Id } from '@/shared/model'

export type MySearchTab = 'saved' | 'recent'

export type MySearchStore = {
  _id: Id
  name: string
  genre: string[]
  thumbnailUrl?: string
  rating: number
  reviewCount: number
}

const PARAM_TO_TAB: Record<string, MySearchTab> = {
  saved: 'saved',
  recent: 'recent',
}

const isPopulatedRamenya = (value: unknown): value is RecentViewedRamenyaInfo =>
  typeof value === 'object' && value !== null && 'name' in value

export const useMySearchPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  // 탭을 URL(?tab=)로 관리해, 다른 화면 갔다가 뒤로가기해도 선택 탭이 유지되도록 한다.
  const activeTab = PARAM_TO_TAB[searchParams.get('tab') ?? ''] ?? 'saved'
  const setActiveTab = (tab: MySearchTab) => setSearchParams({ tab }, { replace: true })

  const bookmarksQuery = useMyBookmarksQuery({ enabled: activeTab === 'saved' })
  const recentQuery = useRecentViewedRamenyaQuery({ enabled: activeTab === 'recent' })

  // ramenya 필드는 populate된 객체이거나 단순 Id 문자열일 수 있어, 렌더 가능한 객체만 추린다.
  const saved = useMemo<MySearchStore[]>(
    () => (bookmarksQuery.data ?? []).map((item) => item.ramenya).filter(isPopulatedRamenya),
    [bookmarksQuery.data],
  )
  const recents = useMemo<MySearchStore[]>(
    () => (recentQuery.data ?? []).map((item) => item.ramenya).filter(isPopulatedRamenya),
    [recentQuery.data],
  )

  return {
    activeTab,
    setActiveTab,
    saved,
    isSavedLoading: bookmarksQuery.isLoading,
    recents,
    isRecentLoading: recentQuery.isLoading,
    onStoreClick: (ramenyaId: string) => navigate(`/detail/${ramenyaId}`),
    onBack: () => navigate(-1),
  }
}
