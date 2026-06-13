import { apiClient } from '@/shared/api'
import type { MyBookmark } from '../model/types'

const RAMENYA_PATH = '/v1/ramenya'
const MYPAGE_PATH = '/mypage'

export const bookmarkApi = {
  add(ramenyaId: string) {
    return apiClient.post<void>(`${RAMENYA_PATH}/${ramenyaId}/bookmark`)
  },

  remove(ramenyaId: string) {
    return apiClient.delete<void>(`${RAMENYA_PATH}/${ramenyaId}/bookmark`)
  },

  getMyBookmarks() {
    return apiClient.get<MyBookmark[]>(`${MYPAGE_PATH}/bookmarks`)
  },
}
