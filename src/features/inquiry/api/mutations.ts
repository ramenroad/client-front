import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { CreateInquiryRequest } from '../model'
import { inquiryMutationKeys } from './query-keys'
import { inquiryApi } from './requests'

export function useCreateInquiryMutation(options?: ApiMutationOptions<void, CreateInquiryRequest>) {
  return useApiMutation<void, CreateInquiryRequest>(inquiryApi.create, {
    mutationKey: inquiryMutationKeys.create(),
    ...options,
  })
}
