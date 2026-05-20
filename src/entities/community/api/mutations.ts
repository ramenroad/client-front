import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { CreateCommunityBoardPayload } from '../model'
import { communityMutationKeys } from './query-keys'
import { communityApi } from './requests'
import type {
  CommunityCommentVariables,
  CreateCommunityCommentVariables,
  UpdateCommunityBoardVariables,
  UpdateCommunityCommentVariables,
} from './types'

export function useCreateCommunityBoardMutation(
  options?: ApiMutationOptions<void, CreateCommunityBoardPayload>,
) {
  return useApiMutation<void, CreateCommunityBoardPayload>(communityApi.createBoard, {
    mutationKey: communityMutationKeys.createBoard(),
    ...options,
  })
}

export function useUpdateCommunityBoardMutation(
  options?: ApiMutationOptions<void, UpdateCommunityBoardVariables>,
) {
  return useApiMutation<void, UpdateCommunityBoardVariables>(
    ({ boardId, data }) => communityApi.updateBoard(boardId, data),
    {
      mutationKey: communityMutationKeys.updateBoard(),
      ...options,
    },
  )
}

export function useDeleteCommunityBoardMutation(options?: ApiMutationOptions<void, string>) {
  return useApiMutation<void, string>((boardId) => communityApi.deleteBoard(boardId), {
    mutationKey: communityMutationKeys.deleteBoard(),
    ...options,
  })
}

export function useAddCommunityBoardLikeMutation(options?: ApiMutationOptions<void, string>) {
  return useApiMutation<void, string>((boardId) => communityApi.addBoardLike(boardId), {
    mutationKey: communityMutationKeys.addBoardLike(),
    ...options,
  })
}

export function useDeleteCommunityBoardLikeMutation(options?: ApiMutationOptions<void, string>) {
  return useApiMutation<void, string>((boardId) => communityApi.deleteBoardLike(boardId), {
    mutationKey: communityMutationKeys.deleteBoardLike(),
    ...options,
  })
}

export function useCreateCommunityCommentMutation(
  options?: ApiMutationOptions<void, CreateCommunityCommentVariables>,
) {
  return useApiMutation<void, CreateCommunityCommentVariables>(
    ({ boardId, data }) => communityApi.createComment(boardId, data),
    {
      mutationKey: communityMutationKeys.createComment(),
      ...options,
    },
  )
}

export function useUpdateCommunityCommentMutation(
  options?: ApiMutationOptions<void, UpdateCommunityCommentVariables>,
) {
  return useApiMutation<void, UpdateCommunityCommentVariables>(
    ({ boardId, commentId, data }) => communityApi.updateComment(boardId, commentId, data),
    {
      mutationKey: communityMutationKeys.updateComment(),
      ...options,
    },
  )
}

export function useDeleteCommunityCommentMutation(
  options?: ApiMutationOptions<void, CommunityCommentVariables>,
) {
  return useApiMutation<void, CommunityCommentVariables>(
    ({ boardId, commentId }) => communityApi.deleteComment(boardId, commentId),
    {
      mutationKey: communityMutationKeys.deleteComment(),
      ...options,
    },
  )
}

export function useAddCommunityCommentLikeMutation(
  options?: ApiMutationOptions<void, CommunityCommentVariables>,
) {
  return useApiMutation<void, CommunityCommentVariables>(
    ({ boardId, commentId }) => communityApi.addCommentLike(boardId, commentId),
    {
      mutationKey: communityMutationKeys.addCommentLike(),
      ...options,
    },
  )
}

export function useDeleteCommunityCommentLikeMutation(
  options?: ApiMutationOptions<void, CommunityCommentVariables>,
) {
  return useApiMutation<void, CommunityCommentVariables>(
    ({ boardId, commentId }) => communityApi.deleteCommentLike(boardId, commentId),
    {
      mutationKey: communityMutationKeys.deleteCommentLike(),
      ...options,
    },
  )
}
