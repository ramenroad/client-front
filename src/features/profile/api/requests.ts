import { apiClient, appendFiles } from '@/shared/api'
import type { UpdateIsPublicRequest, UpdateNicknameRequest } from '../model'

const MYPAGE_PATH = '/mypage'

export const profileApi = {
  updateNickname(data: UpdateNicknameRequest) {
    return apiClient.patch<void>(`${MYPAGE_PATH}/nickname`, data)
  },

  checkNickname(nickname: string) {
    return apiClient.get<boolean>(`${MYPAGE_PATH}/nickname/check`, {
      params: { nickname },
    })
  },

  updateProfileImage(profileImageFile: File) {
    const formData = new FormData()
    appendFiles(formData, 'profileImageFile', [profileImageFile])

    return apiClient.patch<void>(`${MYPAGE_PATH}/image`, formData)
  },

  updateIsPublic(data: UpdateIsPublicRequest) {
    return apiClient.patch<void>(`${MYPAGE_PATH}/isPublic`, data)
  },
}
