import { useAppNavigate } from '@/shared/navigation'
import { useNoticeList } from '@/entities/support/model'

export const usePatchNotePage = () => {
  const navigate = useAppNavigate()
  const list = useNoticeList('패치노트')

  return {
    visibleNotices: list.visibleNotices,
    isLoading: list.isLoading,
    isError: list.isError,
    hasMore: list.hasMore,
    onItemClick: (noticeId: string) => navigate(`/patch-note/${noticeId}`),
    onLoadMore: list.loadMore,
  }
}
