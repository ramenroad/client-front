import { apiClient } from '@/shared/api'
import type { Notice, NoticeDetail, NoticeType } from '../model'

const MYPAGE_PATH = '/mypage'

export const supportApi = {
  getNotices(type: NoticeType) {
    return apiClient.get<Notice[]>(`${MYPAGE_PATH}/notices`, { params: { type } })
  },

  getNotice(noticeId: string) {
    return apiClient.get<NoticeDetail>(`${MYPAGE_PATH}/notice/${noticeId}`)
  },
}
