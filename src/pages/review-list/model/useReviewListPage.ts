import { useMemo } from 'react'
import { useAppParams } from '@/shared/navigation'
import { useRamenyaReviewsInfiniteQuery } from '@/entities/review/api'
import { useMyInfoQuery } from '@/entities/viewer/api'
import { useAuthSession } from '@/entities/session/model'
import { useIntersectionObserver } from '@/shared/lib/useIntersectionObserver'

export const useReviewListPage = () => {
  const { id = '' } = useAppParams()
  const authSession = useAuthSession()
  const myInfoQuery = useMyInfoQuery({ enabled: authSession.isSignIn })
  const reviewsQuery = useRamenyaReviewsInfiniteQuery(
    { ramenyaId: id, limit: 10 },
    { enabled: Boolean(id) },
  )
  const reviews = useMemo(() => reviewsQuery.data?.pages.flatMap((page) => page.reviews) ?? [], [reviewsQuery.data])
  const observerRef = useIntersectionObserver({
    enabled: reviewsQuery.hasNextPage && !reviewsQuery.isFetchingNextPage,
    onIntersect: () => {
      if (reviewsQuery.hasNextPage && !reviewsQuery.isFetchingNextPage) {
        reviewsQuery.fetchNextPage()
      }
    },
  })

  return {
    reviews,
    myUserId: myInfoQuery.data?._id,
    observerRef,
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
  }
}
