import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecentViewedRamenyaQuery } from '@/entities/activity/api'
import type { RecentViewedRamenyaInfo } from '@/entities/activity/model'

const isPopulatedRamenya = (value: unknown): value is RecentViewedRamenyaInfo =>
  typeof value === 'object' && value !== null && 'name' in value

export const useMySearchPage = () => {
  const navigate = useNavigate()
  const recentQuery = useRecentViewedRamenyaQuery()

  // ramenya 필드는 populate된 객체이거나 단순 Id 문자열일 수 있어, 렌더 가능한 객체만 추린다.
  const recents = useMemo(
    () => (recentQuery.data ?? []).map((item) => item.ramenya).filter(isPopulatedRamenya),
    [recentQuery.data],
  )

  return {
    recents,
    isLoading: recentQuery.isLoading,
    onStoreClick: (ramenyaId: string) => navigate(`/detail/${ramenyaId}`),
    onBack: () => navigate(-1),
  }
}
