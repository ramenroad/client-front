import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api'
import type { MyComment, MyPost, RecentViewedRamenya } from '../model'
import { activityQueryKeys } from './query-keys'
import { activityApi } from './requests'

export function useMyPostsQuery(
  options?: Omit<UseQueryOptions<MyPost[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<MyPost[], ApiError>({
    queryKey: activityQueryKeys.myPosts(),
    queryFn: activityApi.getMyPosts,
    ...options,
  })
}

export function useMyCommentsQuery(
  options?: Omit<UseQueryOptions<MyComment[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<MyComment[], ApiError>({
    queryKey: activityQueryKeys.myComments(),
    queryFn: activityApi.getMyComments,
    ...options,
  })
}

export function useRecentViewedRamenyaQuery(
  options?: Omit<UseQueryOptions<RecentViewedRamenya[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<RecentViewedRamenya[], ApiError>({
    queryKey: activityQueryKeys.recentViewedRamenya(),
    queryFn: activityApi.getRecentViewedRamenya,
    ...options,
  })
}
