import {
  useApiInfiniteQuery,
  useApiQuery,
  type ApiInfiniteQueryOptions,
  type ApiQueryOptions,
} from '@/shared/api'
import type {
  CommunityBoardDetail,
  CommunityBoardListResponse,
  CommunityCommentNode,
  GetCommunityBoardListParams,
} from '../model'
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

export function useCommunityBoardDetailQuery(boardId: string, options?: ApiQueryOptions<CommunityBoardDetail>) {
  return useApiQuery<CommunityBoardDetail>({
    queryKey: communityQueryKeys.boardDetail(boardId),
    queryFn: () => communityApi.getBoardDetail(boardId),
    enabled: Boolean(boardId),
    ...options,
  })
}

export function useCommunityCommentsQuery(boardId: string, options?: ApiQueryOptions<CommunityCommentNode[]>) {
  return useApiQuery<CommunityCommentNode[]>({
    queryKey: communityQueryKeys.comments(boardId),
    queryFn: () => communityApi.getComments(boardId),
    enabled: Boolean(boardId),
    ...options,
  })
}
