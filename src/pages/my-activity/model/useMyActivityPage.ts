import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMyCommentsQuery, useMyPostsQuery } from '@/entities/activity/api'
import { useMyReviewsInfiniteQuery } from '@/entities/review/api'

export type MyActivityTab = 'review' | 'post' | 'comment'

const PARAM_TO_TAB: Record<string, MyActivityTab> = {
  review: 'review',
  post: 'post',
  comment: 'comment',
}

export const useMyActivityPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  // 탭을 URL(?tab=)로 관리해, 다른 화면 갔다가 뒤로가기해도 선택 탭이 유지되도록 한다.
  const activeTab = PARAM_TO_TAB[searchParams.get('tab') ?? ''] ?? 'review'
  const setActiveTab = (tab: MyActivityTab) => setSearchParams({ tab }, { replace: true })

  const reviewsQuery = useMyReviewsInfiniteQuery({ limit: 10 }, { enabled: activeTab === 'review' })
  const postsQuery = useMyPostsQuery({ enabled: activeTab === 'post' })
  const commentsQuery = useMyCommentsQuery({ enabled: activeTab === 'comment' })

  const reviews = useMemo(
    () => reviewsQuery.data?.pages.flatMap((page) => page.reviews) ?? [],
    [reviewsQuery.data],
  )

  return {
    activeTab,
    setActiveTab,
    reviews,
    isReviewsLoading: reviewsQuery.isLoading,
    posts: postsQuery.data ?? [],
    isPostsLoading: postsQuery.isLoading,
    comments: commentsQuery.data ?? [],
    isCommentsLoading: commentsQuery.isLoading,
    onBoardClick: (boardId: string) => navigate(`/community/${boardId}`),
    onBack: () => navigate(-1),
  }
}
