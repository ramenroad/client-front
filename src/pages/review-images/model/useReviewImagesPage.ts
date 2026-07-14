import { useEffect, useState } from 'react'
import { useAppParams, useScreenScroll } from '@/shared/navigation'
import { useRamenyaDetailQuery } from '@/entities/ramenya/api'
import { useRamenyaReviewImagesQuery } from '@/entities/review/api'

export const useReviewImagesPage = () => {
  const scrollScreen = useScreenScroll()
  const { id = '' } = useAppParams()
  const detailQuery = useRamenyaDetailQuery(id)
  const imagesQuery = useRamenyaReviewImagesQuery(id)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const images = imagesQuery.data?.ramenyaReviewImagesUrls ?? []

  useEffect(() => {
    scrollScreen()
  }, [scrollScreen])

  return {
    title: detailQuery.data?.name ?? '이미지',
    images,
    selectedImageIndex,
    setSelectedImageIndex,
    closeImagePopup: () => setSelectedImageIndex(null),
    isLoading: detailQuery.isLoading || imagesQuery.isLoading,
    isError: detailQuery.isError || imagesQuery.isError,
  }
}
