import { apiClient } from '@/shared/api'
import type { MyComment, MyPost, RecentViewedRamenya } from '../model'

const MYPAGE_PATH = '/mypage'

export const activityApi = {
  getMyPosts() {
    return apiClient.get<MyPost[]>(`${MYPAGE_PATH}/posts`)
  },

  getMyComments() {
    return apiClient.get<MyComment[]>(`${MYPAGE_PATH}/comments`)
  },

  getRecentViewedRamenya() {
    return apiClient.get<RecentViewedRamenya[]>(`${MYPAGE_PATH}/recent-viewed-ramenya`)
  },
}
