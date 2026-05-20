import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { CreateReviewRequest } from '../model'
import { reviewMutationKeys } from './query-keys'
import { reviewApi } from './requests'
import type { UpdateReviewVariables } from './types'

export function useCreateReviewMutation(options?: ApiMutationOptions<void, CreateReviewRequest>) {
  return useApiMutation<void, CreateReviewRequest>(reviewApi.create, {
    mutationKey: reviewMutationKeys.create(),
    ...options,
  })
}

export function useUpdateReviewMutation(options?: ApiMutationOptions<void, UpdateReviewVariables>) {
  return useApiMutation<void, UpdateReviewVariables>(
    ({ reviewId, data }) => reviewApi.update(reviewId, data),
    {
      mutationKey: reviewMutationKeys.update(),
      ...options,
    },
  )
}

export function useDeleteReviewMutation(options?: ApiMutationOptions<void, string>) {
  return useApiMutation<void, string>((reviewId) => reviewApi.delete(reviewId), {
    mutationKey: reviewMutationKeys.delete(),
    ...options,
  })
}
