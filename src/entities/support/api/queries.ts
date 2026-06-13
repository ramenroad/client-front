import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { Notice, NoticeDetail, NoticeType } from '../model'
import { supportQueryKeys } from './query-keys'
import { supportApi } from './requests'

export function useNoticesQuery(type: NoticeType, options?: ApiQueryOptions<Notice[]>) {
  return useApiQuery<Notice[]>({
    queryKey: supportQueryKeys.notices(type),
    queryFn: () => supportApi.getNotices(type),
    ...options,
  })
}

export function useNoticeQuery(noticeId: string, options?: ApiQueryOptions<NoticeDetail>) {
  return useApiQuery<NoticeDetail>({
    queryKey: supportQueryKeys.notice(noticeId),
    queryFn: () => supportApi.getNotice(noticeId),
    enabled: Boolean(noticeId),
    ...options,
  })
}
