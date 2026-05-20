import { apiClient, appendFiles, appendIfDefined } from '@/shared/api'
import type { PaginationParams } from '@/shared/model'
import type {
  CreateReviewRequest,
  MyReviewsResponse,
  RamenyaReviewImagesResponse,
  RamenyaReviewsParams,
  RamenyaReviewsResponse,
  ReviewDetail,
  UpdateReviewRequest,
  UserReviewsResponse,
} from '../model'

const REVIEW_PATH = '/review'

export const reviewApi = {
  create(data: CreateReviewRequest) {
    const formData = new FormData()
    appendIfDefined(formData, 'ramenyaId', data.ramenyaId)
    appendIfDefined(formData, 'rating', data.rating)
    appendIfDefined(formData, 'review', data.review)
    appendIfDefined(formData, 'menus', data.menus)
    appendFiles(formData, 'reviewImages', data.reviewImages)

    return apiClient.post<void>(REVIEW_PATH, formData)
  },

  delete(reviewId: string) {
    return apiClient.delete<void>(`${REVIEW_PATH}/${reviewId}`)
  },

  getRamenyaReviews(params: RamenyaReviewsParams) {
    return apiClient.get<RamenyaReviewsResponse>(REVIEW_PATH, { params })
  },

  getRamenyaReviewImages(ramenyaId: string) {
    return apiClient.get<RamenyaReviewImagesResponse>(`${REVIEW_PATH}/${ramenyaId}/images`)
  },

  update(reviewId: string, data: UpdateReviewRequest) {
    const formData = new FormData()
    appendIfDefined(formData, 'rating', data.rating)
    appendIfDefined(formData, 'review', data.review)
    appendIfDefined(formData, 'menus', data.menus)
    appendIfDefined(formData, 'reviewImageUrls', data.reviewImageUrls?.join(','))
    appendFiles(formData, 'reviewImages', data.reviewImages)

    return apiClient.patch<void>(`${REVIEW_PATH}/${reviewId}`, formData)
  },

  getMyReviews(params?: PaginationParams) {
    return apiClient.get<MyReviewsResponse>(`${REVIEW_PATH}/my/reviews`, { params })
  },

  getUserReviews(userId: string, params?: PaginationParams) {
    return apiClient.get<UserReviewsResponse>(`${REVIEW_PATH}/${userId}/reviews`, { params })
  },

  getById(reviewId: string) {
    return apiClient.get<ReviewDetail>(`${REVIEW_PATH}/${reviewId}`)
  },
}
