import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { MyComment, MyPost, RecentViewedRamenya } from '../model'
import { activityQueryKeys } from './query-keys'
import { activityApi } from './requests'

export function useMyPostsQuery(options?: ApiQueryOptions<MyPost[]>) {
  return useApiQuery<MyPost[]>({
    queryKey: activityQueryKeys.myPosts(),
    queryFn: activityApi.getMyPosts,
    ...options,
  })
}

export function useMyCommentsQuery(options?: ApiQueryOptions<MyComment[]>) {
  return useApiQuery<MyComment[]>({
    queryKey: activityQueryKeys.myComments(),
    queryFn: activityApi.getMyComments,
    ...options,
  })
}

export function useRecentViewedRamenyaQuery(options?: ApiQueryOptions<RecentViewedRamenya[]>) {
  return useApiQuery<RecentViewedRamenya[]>({
    queryKey: activityQueryKeys.recentViewedRamenya(),
    queryFn: activityApi.getRecentViewedRamenya,
    ...options,
  })
}
