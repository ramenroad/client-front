import { useApiInfiniteQuery, type ApiInfiniteQueryOptions } from '@/shared/api'
import type { CommunityBoardListResponse, GetCommunityBoardListParams } from '../model'
import { communityQueryKeys } from './query-keys'
import { communityApi } from './requests'
import type { CommunityBoardsInfiniteParams } from './types'

export function useCommunityBoardsInfiniteQuery(
  params?: CommunityBoardsInfiniteParams,
  options?: ApiInfiniteQueryOptions<CommunityBoardListResponse>,
) {
  return useApiInfiniteQuery<CommunityBoardListResponse, GetCommunityBoardListParams>({
    queryKey: communityQueryKeys.boards(params),
    queryFn: communityApi.getBoards,
    params,
    options,
  })
}
