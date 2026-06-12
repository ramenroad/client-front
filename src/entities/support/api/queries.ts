import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api'
import type { Notice, NoticeDetail, NoticeType } from '../model'
import { supportQueryKeys } from './query-keys'
import { supportApi } from './requests'

export function useNoticesQuery(
  type: NoticeType,
  options?: Omit<UseQueryOptions<Notice[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Notice[], ApiError>({
    queryKey: supportQueryKeys.notices(type),
    queryFn: () => supportApi.getNotices(type),
    ...options,
  })
}

export function useNoticeQuery(
  noticeId: string,
  options?: Omit<UseQueryOptions<NoticeDetail, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<NoticeDetail, ApiError>({
    queryKey: supportQueryKeys.notice(noticeId),
    queryFn: () => supportApi.getNotice(noticeId),
    enabled: Boolean(noticeId),
    ...options,
  })
}
