import { apiClient, appendFiles, appendIfDefined } from '@/shared/api'
import type {
  CommunityBoardDetail,
  CommunityBoardListResponse,
  CommunityCommentNode,
  CreateCommunityBoardPayload,
  CreateCommunityCommentPayload,
  GetCommunityBoardListParams,
  UpdateCommunityBoardPayload,
  UpdateCommunityCommentPayload,
} from '../model'

const COMMUNITY_PATH = '/community'

function createBoardFormData(data: CreateCommunityBoardPayload | UpdateCommunityBoardPayload) {
  const formData = new FormData()
  appendIfDefined(formData, 'category', data.category)
  appendIfDefined(formData, 'title', data.title)
  appendIfDefined(formData, 'body', data.body)

  if ('imageUrls' in data) {
    appendIfDefined(formData, 'ImageUrls', data.imageUrls?.join(','))
  }

  appendFiles(formData, 'Images', data.images)
  return formData
}

export const communityApi = {
  createBoard(data: CreateCommunityBoardPayload) {
    return apiClient.post<void>(`${COMMUNITY_PATH}/board`, createBoardFormData(data))
  },

  getBoards(params?: GetCommunityBoardListParams) {
    return apiClient.get<CommunityBoardListResponse>(`${COMMUNITY_PATH}/boards`, { params })
  },

  getBoardDetail(boardId: string) {
    return apiClient.get<CommunityBoardDetail>(`${COMMUNITY_PATH}/board/${boardId}`)
  },

  updateBoard(boardId: string, data: UpdateCommunityBoardPayload) {
    return apiClient.patch<void>(`${COMMUNITY_PATH}/board/${boardId}`, createBoardFormData(data))
  },

  deleteBoard(boardId: string) {
    return apiClient.delete<void>(`${COMMUNITY_PATH}/board/${boardId}`)
  },

  addBoardLike(boardId: string) {
    return apiClient.post<void>(`${COMMUNITY_PATH}/board/${boardId}/like`)
  },

  deleteBoardLike(boardId: string) {
    return apiClient.delete<void>(`${COMMUNITY_PATH}/board/${boardId}/like`)
  },

  createComment(boardId: string, data: CreateCommunityCommentPayload) {
    return apiClient.post<void>(`${COMMUNITY_PATH}/board/${boardId}/comment`, data)
  },

  getComments(boardId: string) {
    return apiClient.get<CommunityCommentNode[]>(`${COMMUNITY_PATH}/board/${boardId}/comment`)
  },

  deleteComment(boardId: string, commentId: string) {
    return apiClient.delete<void>(`${COMMUNITY_PATH}/board/${boardId}/comment/${commentId}`)
  },

  updateComment(boardId: string, commentId: string, data: UpdateCommunityCommentPayload) {
    return apiClient.patch<void>(`${COMMUNITY_PATH}/board/${boardId}/comment/${commentId}`, data)
  },

  addCommentLike(boardId: string, commentId: string) {
    return apiClient.post<void>(`${COMMUNITY_PATH}/board/${boardId}/comment/${commentId}/like`)
  },

  deleteCommentLike(boardId: string, commentId: string) {
    return apiClient.delete<void>(`${COMMUNITY_PATH}/board/${boardId}/comment/${commentId}/like`)
  },
}
