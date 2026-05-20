import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRamenyaDetailQuery } from '@/entities/ramenya/api'
import {
  getTodayBusinessHour,
  sortBusinessHoursByCurrentDay,
  type RamenyaDetail,
  type RamenyaEmbeddedReview,
} from '@/entities/ramenya/model'
import { useRamenyaReviewImagesQuery } from '@/entities/review/api'
import { openUrl } from '@/shared/lib/browser'
import { isMobileDevice } from '@/shared/lib/image'

type MapButtonType = 'google' | 'kakao' | 'naver'

type MapButton = {
  type: MapButtonType
  url?: string
  label: string
}

const isEmbeddedReview = (review: unknown): review is RamenyaEmbeddedReview => {
  return typeof review === 'object' && review !== null && '_id' in review && 'review' in review
}

const getEmbeddedReviews = (detail?: RamenyaDetail) => {
  return detail?.reviews?.filter(isEmbeddedReview) ?? []
}

const getMapButtonUrl = (url?: string, deepLink?: string) => {
  if (isMobileDevice() && deepLink) {
    return deepLink
  }

  return url
}

export const useRamenyaDetailPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const detailQuery = useRamenyaDetailQuery(id)
  const reviewImagesQuery = useRamenyaReviewImagesQuery(id, {
    staleTime: 30_000,
  })
  const [isTimeExpanded, setIsTimeExpanded] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const detail = detailQuery.data
  const todayBusinessHour = useMemo(() => getTodayBusinessHour(detail?.businessHours ?? []), [detail?.businessHours])
  const sortedBusinessHours = useMemo(
    () => sortBusinessHoursByCurrentDay(detail?.businessHours ?? []),
    [detail?.businessHours],
  )
  const reviews = useMemo(() => getEmbeddedReviews(detail), [detail])
  const topReviews = useMemo(
    () =>
      [...reviews]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3),
    [reviews],
  )
  const reviewImages = reviewImagesQuery.data?.ramenyaReviewImagesUrls ?? []
  const mapButtons = useMemo<MapButton[]>(
    () => [
      {
        type: 'naver',
        url: getMapButtonUrl(detail?.naverMapUrl, detail?.naverMapDeepLink),
        label: '네이버 지도 바로가기',
      },
      {
        type: 'kakao',
        url: getMapButtonUrl(detail?.kakaoMapUrl, detail?.kakaoMapDeepLink),
        label: '카카오맵 바로가기',
      },
      {
        type: 'google',
        url: getMapButtonUrl(detail?.googleMapUrl, detail?.googleMapDeepLink),
        label: '구글맵 바로가기',
      },
    ],
    [
      detail?.googleMapDeepLink,
      detail?.googleMapUrl,
      detail?.kakaoMapDeepLink,
      detail?.kakaoMapUrl,
      detail?.naverMapDeepLink,
      detail?.naverMapUrl,
    ],
  )

  const handleOpenImagePopup = (index: number, images: string[]) => {
    setSelectedImageIndex(index)
    setSelectedImages(images)
  }

  const handleCloseImagePopup = () => {
    setSelectedImageIndex(null)
    setSelectedImages([])
  }

  const handleNavigateReviewCreatePage = (rating = 0) => {
    navigate(`/review/create/${id}?rating=${rating}`)
  }

  const handleNavigateAllReviewsPage = () => {
    navigate(`/review/list/${id}`)
  }

  const handleNavigateMenuBoardSubmitPage = () => {
    navigate(`/menu-board-submit/${id}`)
  }

  const handleNavigateMenuBoardImagesPage = () => {
    navigate(`/menu-board-images/${id}`)
  }

  const handleNavigateReviewImagesPage = () => {
    navigate(`/images/${id}`)
  }

  const handleOpenMapUrl = (url: string) => {
    openUrl(url)
  }

  return {
    id,
    detail,
    detailQuery,
    reviewImages,
    reviews: topReviews,
    isTimeExpanded,
    setIsTimeExpanded,
    selectedImageIndex,
    setSelectedImageIndex,
    selectedImages,
    todayBusinessHour,
    sortedBusinessHours,
    mapButtons,
    handleOpenImagePopup,
    handleCloseImagePopup,
    handleNavigateReviewCreatePage,
    handleNavigateAllReviewsPage,
    handleNavigateMenuBoardSubmitPage,
    handleNavigateMenuBoardImagesPage,
    handleNavigateReviewImagesPage,
    handleOpenMapUrl,
  }
}

export type { MapButton }
