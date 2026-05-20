import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { DeleteMenuBoardRequest, UploadMenuBoardRequest } from '../model'
import { menuBoardMutationKeys } from './query-keys'
import { menuBoardApi } from './requests'

export function useUploadMenuBoardMutation(
  options?: ApiMutationOptions<void, UploadMenuBoardRequest>,
) {
  return useApiMutation<void, UploadMenuBoardRequest>(menuBoardApi.upload, {
    mutationKey: menuBoardMutationKeys.upload(),
    ...options,
  })
}

export function useDeleteMenuBoardMutation(
  options?: ApiMutationOptions<void, DeleteMenuBoardRequest>,
) {
  return useApiMutation<void, DeleteMenuBoardRequest>(menuBoardApi.delete, {
    mutationKey: menuBoardMutationKeys.delete(),
    ...options,
  })
}
