import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { MyInfo, UserInfo } from '../model'
import { viewerQueryKeys } from './query-keys'
import { viewerApi } from './requests'

export function useMyInfoQuery(options?: ApiQueryOptions<MyInfo>) {
  return useApiQuery<MyInfo>({
    queryKey: viewerQueryKeys.myInfo(),
    queryFn: viewerApi.getMyInfo,
    ...options,
  })
}

export function useUserInfoQuery(userId: string, options?: ApiQueryOptions<UserInfo>) {
  return useApiQuery<UserInfo>({
    queryKey: viewerQueryKeys.userInfo(userId),
    queryFn: () => viewerApi.getUserInfo(userId),
    enabled: Boolean(userId),
    ...options,
  })
}
