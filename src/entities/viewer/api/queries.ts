import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api'
import type { MyInfo, UserInfo } from '../model'
import { viewerQueryKeys } from './query-keys'
import { viewerApi } from './requests'

export function useMyInfoQuery(options?: Omit<UseQueryOptions<MyInfo, ApiError>, 'queryKey' | 'queryFn'>) {
  return useQuery<MyInfo, ApiError>({
    queryKey: viewerQueryKeys.myInfo(),
    queryFn: viewerApi.getMyInfo,
    ...options,
  })
}

export function useUserInfoQuery(
  userId: string,
  options?: Omit<UseQueryOptions<UserInfo, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<UserInfo, ApiError>({
    queryKey: viewerQueryKeys.userInfo(userId),
    queryFn: () => viewerApi.getUserInfo(userId),
    enabled: Boolean(userId),
    ...options,
  })
}
