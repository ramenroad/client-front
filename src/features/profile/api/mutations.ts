import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { UpdateIsPublicRequest, UpdateNicknameRequest } from '../model'
import { profileMutationKeys } from './query-keys'
import { profileApi } from './requests'

export function useUpdateNicknameMutation(
  options?: ApiMutationOptions<void, UpdateNicknameRequest>,
) {
  return useApiMutation<void, UpdateNicknameRequest>(profileApi.updateNickname, {
    mutationKey: profileMutationKeys.updateNickname(),
    ...options,
  })
}

export function useUpdateProfileImageMutation(options?: ApiMutationOptions<void, File>) {
  return useApiMutation<void, File>(profileApi.updateProfileImage, {
    mutationKey: profileMutationKeys.updateProfileImage(),
    ...options,
  })
}

export function useUpdateIsPublicMutation(
  options?: ApiMutationOptions<void, UpdateIsPublicRequest>,
) {
  return useApiMutation<void, UpdateIsPublicRequest>(profileApi.updateIsPublic, {
    mutationKey: profileMutationKeys.updateIsPublic(),
    ...options,
  })
}
