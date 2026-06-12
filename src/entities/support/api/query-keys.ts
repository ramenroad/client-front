import type { NoticeType } from '../model'

export const supportQueryKeys = {
  all: ['support'] as const,
  notices: (type: NoticeType) => [...supportQueryKeys.all, 'notices', type] as const,
  notice: (noticeId: string) => [...supportQueryKeys.all, 'notice', noticeId] as const,
}
