import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRamenyaDetailQuery } from '@/entities/ramenya/api'
import {
  getTodayBusinessHour,
  sortBusinessHoursByCurrentDay,
} from '@/entities/ramenya/model'
import { useRamenyaReviewImagesQuery, useRamenyaReviewsInfiniteQuery } from '@/entities/review/api'
import { useMyInfoQuery } from '@/entities/viewer/api'
import { useAuthSession } from '@/features/auth'
import { openUrl } from '@/shared/lib/browser'
import { isMobileDevice } from '@/shared/lib/image'

type MapButtonType = 'google' | 'kakao' | 'naver'

type MapButton = {
  type: MapButtonType
  url?: string
  label: string
}

const RAISING_MAP_ZOOM = 16
const RAISING_MAP_RADIUS = 3_000

const getMapButtonUrl = (url?: string, deepLink?: string) => {
  if (isMobileDevice() && deepLink) {
    return deepLink
  }

  return url
}

const createRaisingMapUrl = ({
  id,
  latitude,
  longitude,
}: {
  id: string
  latitude?: number
  longitude?: number
}) => {
  if (latitude === undefined || longitude === undefined) {
    return '/map'
  }

  const searchParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    radius: RAISING_MAP_RADIUS.toString(),
    level: RAISING_MAP_ZOOM.toString(),
    nearBy: 'true',
    selectedId: id,
  })

  return `/map?${searchParams.toString()}`
}

const getReviewCreatedTime = (createdAt?: string) => {
  return createdAt ? new Date(createdAt).getTime() : 0
}

export const useRamenyaDetailPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const authSession = useAuthSession()
  const detailQuery = useRamenyaDetailQuery(id)
  const myInfoQuery = useMyInfoQuery({ enabled: authSession.isSignIn })
  const reviewsQuery = useRamenyaReviewsInfiniteQuery(
    { ramenyaId: id, limit: 10 },
    {
      enabled: Boolean(id),
      staleTime: 30_000,
    },
  )
  const reviewImagesQuery = useRamenyaReviewImagesQuery(id, {
    staleTime: 30_000,
  })
  const [isTimeExpanded, setIsTimeExpanded] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const detail = detailQuery.data
  const isSignIn = authSession.isSignIn && myInfoQuery.error?.status !== 401
  const todayBusinessHour = useMemo(() => getTodayBusinessHour(detail?.businessHours ?? []), [detail?.businessHours])
  const sortedBusinessHours = useMemo(
    () => sortBusinessHoursByCurrentDay(detail?.businessHours ?? []),
    [detail?.businessHours],
  )
  const reviews = useMemo(() => reviewsQuery.data?.pages.flatMap((page) => page.reviews) ?? [], [reviewsQuery.data])
  const topReviews = useMemo(
    () =>
      [...reviews]
        .sort((a, b) => getReviewCreatedTime(b.createdAt) - getReviewCreatedTime(a.createdAt))
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
    if (!isSignIn) {
      setIsLoginModalOpen(true)
      return
    }

    navigate(`/review/create/${id}?rating=${rating}`)
  }

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating)
    handleNavigateReviewCreatePage(rating)
  }

  const handleNavigateAllReviewsPage = () => {
    navigate(`/review/list/${id}`)
  }

  const handleNavigateLoginPage = () => {
    setIsLoginModalOpen(false)
    navigate('/login')
  }

  const handleNavigateMenuBoardSubmitPage = () => {
    if (!isSignIn) {
      setIsLoginModalOpen(true)
      return
    }

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

  const handleNavigateRaisingMap = () => {
    navigate(
      createRaisingMapUrl({
        id,
        latitude: detail?.latitude,
        longitude: detail?.longitude,
      }),
    )
  }

  return {
    id,
    detail,
    detailQuery,
    isSignIn,
    myInfo: myInfoQuery.data,
    reviewImages,
    reviews: topReviews,
    isTimeExpanded,
    setIsTimeExpanded,
    selectedRating,
    selectedImageIndex,
    setSelectedImageIndex,
    selectedImages,
    isLoginModalOpen,
    todayBusinessHour,
    sortedBusinessHours,
    mapButtons,
    handleStarClick,
    handleOpenImagePopup,
    handleCloseImagePopup,
    handleNavigateReviewCreatePage,
    handleNavigateAllReviewsPage,
    handleNavigateLoginPage,
    handleCloseLoginModal: () => setIsLoginModalOpen(false),
    handleNavigateMenuBoardSubmitPage,
    handleNavigateMenuBoardImagesPage,
    handleNavigateReviewImagesPage,
    handleOpenMapUrl,
    handleNavigateRaisingMap,
  }
}

export type { MapButton }
