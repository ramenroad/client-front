import type { RamenyaReviewsInfiniteParams, ReviewsInfiniteParams } from './types'

export const reviewQueryKeys = {
  all: ['review'] as const,
  ramenyaReviews: (params: RamenyaReviewsInfiniteParams) =>
    [...reviewQueryKeys.all, 'ramenya-reviews', params] as const,
  myReviews: (params?: ReviewsInfiniteParams) =>
    [...reviewQueryKeys.all, 'my-reviews', params] as const,
  userReviews: (userId: string, params?: ReviewsInfiniteParams) =>
    [...reviewQueryKeys.all, 'user-reviews', userId, params] as const,
  detail: (reviewId: string) => [...reviewQueryKeys.all, 'detail', reviewId] as const,
  images: (ramenyaId: string) => [...reviewQueryKeys.all, 'images', ramenyaId] as const,
}

export const reviewMutationKeys = {
  create: () => [...reviewQueryKeys.all, 'create'] as const,
  update: () => [...reviewQueryKeys.all, 'update'] as const,
  delete: () => [...reviewQueryKeys.all, 'delete'] as const,
}
