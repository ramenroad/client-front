import { apiClient } from '@/shared/api'
import type { MyInfo, UserInfo } from '../model'

const MYPAGE_PATH = '/mypage'

export const viewerApi = {
  getMyInfo() {
    return apiClient.get<MyInfo>(MYPAGE_PATH)
  },

  getUserInfo(userId: string) {
    return apiClient.get<UserInfo>(`${MYPAGE_PATH}/user/${userId}`)
  },
}
