import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRamenyaDetailQuery } from '@/entities/ramenya/api'
import { useRamenyaReviewImagesQuery } from '@/entities/review/api'

export const useReviewImagesPage = () => {
  const { id = '' } = useParams()
  const detailQuery = useRamenyaDetailQuery(id)
  const imagesQuery = useRamenyaReviewImagesQuery(id)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const images = imagesQuery.data?.ramenyaReviewImagesUrls ?? []

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
