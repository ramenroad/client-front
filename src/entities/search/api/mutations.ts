import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { DeleteRecentSearchKeywordsRequest } from '../model'
import { searchMutationKeys } from './query-keys'
import { searchApi } from './requests'

export function useDeleteRecentSearchKeywordsMutation(
  options?: ApiMutationOptions<void, DeleteRecentSearchKeywordsRequest>,
) {
  return useApiMutation<void, DeleteRecentSearchKeywordsRequest>(
    searchApi.deleteRecentSearchKeywords,
    {
      mutationKey: searchMutationKeys.deleteRecentSearchKeywords(),
      ...options,
    },
  )
}
