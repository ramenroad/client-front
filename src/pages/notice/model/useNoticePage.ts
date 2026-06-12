import { useNavigate } from 'react-router-dom'
import { useNoticeList } from '@/entities/support/model'

export const useNoticePage = () => {
  const navigate = useNavigate()
  const list = useNoticeList('공지사항')

  return {
    visibleNotices: list.visibleNotices,
    isLoading: list.isLoading,
    isError: list.isError,
    hasMore: list.hasMore,
    onItemClick: (noticeId: string) => navigate(`/notice/${noticeId}`),
    onLoadMore: list.loadMore,
  }
}
