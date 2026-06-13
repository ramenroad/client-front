import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  reviewQueryKeys,
  useMyReviewsInfiniteQuery,
  useUserReviewsInfiniteQuery,
} from '@/entities/review/api'
import { useMyInfoQuery, useUserInfoQuery, viewerQueryKeys } from '@/entities/viewer/api'
import { useAuthSession } from '@/entities/session/model'
import { useUpdateIsPublicMutation } from '@/features/profile'
import { useIntersectionObserver } from '@/shared/lib/useIntersectionObserver'
import { useShare } from '@/shared/lib/useShare'
import { useQueryClient } from '@tanstack/react-query'

export const useUserReviewsPage = () => {
  const { id: userId = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const authSession = useAuthSession()
  const myInfoQuery = useMyInfoQuery({ enabled: authSession.isSignIn })
  const isAuthSettled = !authSession.isSignIn || myInfoQuery.isFetched || myInfoQuery.isError
  const isMine = Boolean(authSession.isSignIn && userId && myInfoQuery.data?._id === userId)
  const userInfoQuery = useUserInfoQuery(userId, { enabled: Boolean(userId), retry: false })
  const share = useShare({
    title: '라이징',
    description: userInfoQuery.data?.nickname ?? '',
    text: `${userInfoQuery.data?.nickname ?? ''}님의 페이지를 확인해보세요!`,
  })
  const myReviewQuery = useMyReviewsInfiniteQuery({ limit: 10 }, { enabled: isMine })
  const userReviewQuery = useUserReviewsInfiniteQuery(userId, { limit: 10 }, {
    enabled: Boolean(userId && isAuthSettled && !isMine),
    retry: false,
  })
  const updateIsPublicMutation = useUpdateIsPublicMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: viewerQueryKeys.userInfo(userId) })
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.myReviews({ limit: 10 }) })
    },
  })
  const reviews = useMemo(() => {
    const queryData = isMine ? myReviewQuery.data : userReviewQuery.data
    return queryData?.pages.flatMap((page) => page.reviews) ?? []
  }, [isMine, myReviewQuery.data, userReviewQuery.data])
  const isFetchingNextPage = isMine ? myReviewQuery.isFetchingNextPage : userReviewQuery.isFetchingNextPage
  const hasNextPage = isMine ? myReviewQuery.hasNextPage : userReviewQuery.hasNextPage
  const observerRef = useIntersectionObserver({
    enabled: Boolean(hasNextPage && !isFetchingNextPage),
    onIntersect: () => {
      if (!hasNextPage || isFetchingNextPage) {
        return
      }

      if (isMine) {
        myReviewQuery.fetchNextPage()
        return
      }

      userReviewQuery.fetchNextPage()
    },
  })

  const handleReviewVisibilityChange = (isPublic: boolean) => {
    updateIsPublicMutation.mutate({ isPublic })
  }

  return {
    userInfo: userInfoQuery.data,
    reviews,
    isMine,
    isPrivate: !isMine && userReviewQuery.isError,
    isLoading: userInfoQuery.isLoading || (isMine ? myReviewQuery.isLoading : userReviewQuery.isLoading),
    isSharePopupOpen: share.isShareOpen,
    observerRef,
    openSharePopup: share.openShare,
    closeSharePopup: share.closeShare,
    handleReviewVisibilityChange,
    handleShare: share.handleShare,
    navigateHome: () => navigate('/'),
  }
}
