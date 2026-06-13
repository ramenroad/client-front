import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import { bookmarkMutationKeys } from './query-keys'
import { bookmarkApi } from './requests'

export function useAddBookmarkMutation<TOnMutateResult = unknown>(
  options?: ApiMutationOptions<void, string, TOnMutateResult>,
) {
  return useApiMutation<void, string, TOnMutateResult>(bookmarkApi.add, {
    mutationKey: bookmarkMutationKeys.add(),
    ...options,
  })
}

export function useRemoveBookmarkMutation<TOnMutateResult = unknown>(
  options?: ApiMutationOptions<void, string, TOnMutateResult>,
) {
  return useApiMutation<void, string, TOnMutateResult>(bookmarkApi.remove, {
    mutationKey: bookmarkMutationKeys.remove(),
    ...options,
  })
}
