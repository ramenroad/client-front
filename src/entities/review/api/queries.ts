import {
  useApiInfiniteQuery,
  useApiQuery,
  type ApiInfiniteQueryOptions,
  type ApiQueryOptions,
} from '@/shared/api'
import type { PaginationParams } from '@/shared/model'
import type {
  MyReviewsResponse,
  RamenyaReviewImagesResponse,
  RamenyaReviewsParams,
  RamenyaReviewsResponse,
  ReviewDetail,
  UserReviewsResponse,
} from '../model'
import { reviewQueryKeys } from './query-keys'
import { reviewApi } from './requests'
import type { RamenyaReviewsInfiniteParams, ReviewsInfiniteParams } from './types'

export function useRamenyaReviewsInfiniteQuery(
  params: RamenyaReviewsInfiniteParams,
  options?: ApiInfiniteQueryOptions<RamenyaReviewsResponse>,
) {
  return useApiInfiniteQuery<RamenyaReviewsResponse, RamenyaReviewsParams>({
    queryKey: reviewQueryKeys.ramenyaReviews(params),
    queryFn: reviewApi.getRamenyaReviews,
    params,
    options,
  })
}

export function useMyReviewsInfiniteQuery(
  params?: ReviewsInfiniteParams,
  options?: ApiInfiniteQueryOptions<MyReviewsResponse>,
) {
  return useApiInfiniteQuery<MyReviewsResponse, PaginationParams>({
    queryKey: reviewQueryKeys.myReviews(params),
    queryFn: reviewApi.getMyReviews,
    params,
    options,
  })
}

export function useUserReviewsInfiniteQuery(
  userId: string,
  params?: ReviewsInfiniteParams,
  options?: ApiInfiniteQueryOptions<UserReviewsResponse>,
) {
  return useApiInfiniteQuery<UserReviewsResponse, PaginationParams>({
    queryKey: reviewQueryKeys.userReviews(userId, params),
    queryFn: (nextParams) => reviewApi.getUserReviews(userId, nextParams),
    params,
    options,
  })
}

export function useRamenyaReviewImagesQuery(ramenyaId: string, options?: ApiQueryOptions<RamenyaReviewImagesResponse>) {
  return useApiQuery<RamenyaReviewImagesResponse>({
    queryKey: reviewQueryKeys.images(ramenyaId),
    queryFn: () => reviewApi.getRamenyaReviewImages(ramenyaId),
    enabled: Boolean(ramenyaId),
    ...options,
  })
}

export function useReviewDetailQuery(reviewId: string, options?: ApiQueryOptions<ReviewDetail>) {
  return useApiQuery<ReviewDetail>({
    queryKey: reviewQueryKeys.detail(reviewId),
    queryFn: () => reviewApi.getById(reviewId),
    enabled: Boolean(reviewId),
    ...options,
  })
}
