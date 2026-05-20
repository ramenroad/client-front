import type { ReviewDetail } from '@/entities/review/model'
import type { ReviewFormImage, ReviewFormValues } from './types'

export const EMPTY_REVIEW_FORM: ReviewFormValues = {
  ramenyaId: '',
  rating: 0,
  review: '',
  reviewImages: [],
  menus: '',
}

export const getReviewDetailRamenyaId = (reviewDetail?: ReviewDetail | null) => {
  if (!reviewDetail) {
    return ''
  }

  return typeof reviewDetail.ramenyaId === 'string' ? reviewDetail.ramenyaId : reviewDetail.ramenyaId._id
}

export const getCreateReviewFormValues = (ramenyaId: string, initialRating: number): ReviewFormValues => ({
  ...EMPTY_REVIEW_FORM,
  ramenyaId,
  rating: initialRating,
})

export const getCreateDirtyBaseline = (ramenyaId: string): ReviewFormValues => ({
  ...EMPTY_REVIEW_FORM,
  ramenyaId,
})

export const getEditReviewFormValues = (reviewDetail?: ReviewDetail | null): ReviewFormValues | null => {
  if (!reviewDetail) {
    return null
  }

  return {
    ramenyaId: getReviewDetailRamenyaId(reviewDetail),
    rating: reviewDetail.rating,
    review: reviewDetail.review,
    reviewImages: reviewDetail.reviewImageUrls ?? [],
    menus: reviewDetail.menus?.join(',') ?? '',
  }
}

export const areReviewImagesEqual = (initialImages: ReviewFormImage[] = [], currentImages: ReviewFormImage[] = []) => {
  if (initialImages.length !== currentImages.length) {
    return false
  }

  return initialImages.every((image, index) => {
    const currentImage = currentImages[index]

    if (typeof image === 'string' && typeof currentImage === 'string') {
      return image === currentImage
    }

    if (image instanceof File && currentImage instanceof File) {
      return image === currentImage
    }

    return false
  })
}

export const getSelectedMenus = (menus?: string) =>
  menus
    ? menus
        .split(',')
        .map((menu) => menu.trim())
        .filter(Boolean)
    : []

export const getMenuList = (sourceMenus: string[] = [], selectedMenus: string[] = []) => {
  return [...new Set([...sourceMenus, ...selectedMenus])]
}
