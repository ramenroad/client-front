import type { PaginationParams } from '@/shared/model'
import type { RamenyaReviewsParams, UpdateReviewRequest } from '../model'

export type RamenyaReviewsInfiniteParams = Omit<RamenyaReviewsParams, 'page'>
export type ReviewsInfiniteParams = Omit<PaginationParams, 'page'>

export type UpdateReviewVariables = {
  reviewId: string
  data: UpdateReviewRequest
}
