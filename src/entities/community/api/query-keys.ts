import type { CommunityBoardsInfiniteParams } from './types'

export const communityQueryKeys = {
  all: ['community'] as const,
  boards: (params?: CommunityBoardsInfiniteParams) =>
    [...communityQueryKeys.all, 'boards', params] as const,
  boardDetail: (boardId: string) => [...communityQueryKeys.all, 'board', boardId] as const,
  comments: (boardId: string) => [...communityQueryKeys.boardDetail(boardId), 'comments'] as const,
}

export const communityMutationKeys = {
  createBoard: () => [...communityQueryKeys.all, 'create-board'] as const,
  updateBoard: () => [...communityQueryKeys.all, 'update-board'] as const,
  deleteBoard: () => [...communityQueryKeys.all, 'delete-board'] as const,
  addBoardLike: () => [...communityQueryKeys.all, 'add-board-like'] as const,
  deleteBoardLike: () => [...communityQueryKeys.all, 'delete-board-like'] as const,
  createComment: () => [...communityQueryKeys.all, 'create-comment'] as const,
  updateComment: () => [...communityQueryKeys.all, 'update-comment'] as const,
  deleteComment: () => [...communityQueryKeys.all, 'delete-comment'] as const,
  addCommentLike: () => [...communityQueryKeys.all, 'add-comment-like'] as const,
  deleteCommentLike: () => [...communityQueryKeys.all, 'delete-comment-like'] as const,
}
