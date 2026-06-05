import { useEffect, useMemo, useState } from 'react'
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
import { useToast } from '@/shared/ui/toast'
import { useQueryClient } from '@tanstack/react-query'

type KakaoShareApi = {
  isInitialized: () => boolean
  init: (appKey: string) => void
  Share: {
    sendDefault: (payload: {
      objectType: string
      content: {
        title: string
        description: string
        link: {
          mobileWebUrl: string
          webUrl: string
        }
      }
    }) => void
  }
}

const getKakaoApi = () => (window as Window & { Kakao?: KakaoShareApi }).Kakao

export const useUserReviewsPage = () => {
  const { id: userId = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const authSession = useAuthSession()
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false)
  const myInfoQuery = useMyInfoQuery({ enabled: authSession.isSignIn })
  const isAuthSettled = !authSession.isSignIn || myInfoQuery.isFetched || myInfoQuery.isError
  const isMine = Boolean(authSession.isSignIn && userId && myInfoQuery.data?._id === userId)
  const userInfoQuery = useUserInfoQuery(userId, { enabled: Boolean(userId), retry: false })
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

  useEffect(() => {
    const kakao = getKakaoApi()
    const appKey = import.meta.env.VITE_KAKAO_APP_KEY

    if (kakao && appKey && !kakao.isInitialized()) {
      kakao.init(appKey)
    }
  }, [])

  const handleReviewVisibilityChange = (isPublic: boolean) => {
    updateIsPublicMutation.mutate({ isPublic })
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      openToast('주소가 복사되었습니다')
    } catch {
      openToast('주소 복사에 실패했습니다.')
    }
  }

  const handleShareMore = async () => {
    if (!navigator.share) {
      openToast('공유 기능을 지원하지 않는 브라우저입니다')
      return
    }

    await navigator.share({
      title: '라이징',
      text: `${userInfoQuery.data?.nickname ?? ''}님의 페이지를 확인해보세요!`,
      url: window.location.href,
    })
  }

  const handleShareKakao = () => {
    const kakao = getKakaoApi()

    if (!kakao?.isInitialized()) {
      openToast('카카오 공유를 사용할 수 없습니다.')
      return
    }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '라이징',
        description: userInfoQuery.data?.nickname ?? '',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    })
  }

  const handleShare = async (type: 'kakao' | 'url' | 'more') => {
    if (type === 'kakao') {
      handleShareKakao()
      return
    }

    if (type === 'url') {
      await handleCopyLink()
      return
    }

    try {
      await handleShareMore()
    } catch {
      openToast('공유를 완료하지 못했습니다.')
    }
  }

  return {
    userInfo: userInfoQuery.data,
    reviews,
    isMine,
    isPrivate: !isMine && userReviewQuery.isError,
    isLoading: userInfoQuery.isLoading || (isMine ? myReviewQuery.isLoading : userReviewQuery.isLoading),
    isSharePopupOpen,
    observerRef,
    openSharePopup: () => setIsSharePopupOpen(true),
    closeSharePopup: () => setIsSharePopupOpen(false),
    handleReviewVisibilityChange,
    handleShare,
    navigateHome: () => navigate('/'),
  }
}
