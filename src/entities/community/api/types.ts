import type {
  CreateCommunityCommentPayload,
  GetCommunityBoardListParams,
  UpdateCommunityBoardPayload,
  UpdateCommunityCommentPayload,
} from '../model'

export type CommunityBoardsInfiniteParams = Omit<GetCommunityBoardListParams, 'page'>

export type UpdateCommunityBoardVariables = {
  boardId: string
  data: UpdateCommunityBoardPayload
}

export type CreateCommunityCommentVariables = {
  boardId: string
  data: CreateCommunityCommentPayload
}

export type CommunityCommentVariables = {
  boardId: string
  commentId: string
}

export type UpdateCommunityCommentVariables = CommunityCommentVariables & {
  data: UpdateCommunityCommentPayload
}
