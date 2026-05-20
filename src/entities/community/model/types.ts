import type { Id, ISODateString, PaginationParams } from '@/shared/model'

export type CommunityUserInfo = {
  _id: Id
  nickname: string
  profileImageUrl: string | null
}

export type CommunityBoardSummary = {
  _id: Id
  userId: CommunityUserInfo | null
  category: string
  title: string
  body: string
  commentCount: number
  likeCount: number
  viewCount: number
  ImageUrls: string[]
  createdAt?: ISODateString
  updatedAt?: ISODateString
}

export type CommunityBoardListResponse = {
  lastPage: number
  boards: CommunityBoardSummary[]
}

export type CommunityBoardDetail = CommunityBoardSummary & {
  likeUserIds: Id[]
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type GetCommunityBoardListParams = PaginationParams & {
  category?: string
}

export type CreateCommunityBoardPayload = {
  category: string
  title: string
  body: string
  images?: File[]
}

export type UpdateCommunityBoardPayload = CreateCommunityBoardPayload & {
  imageUrls?: string[]
}

export type CreateCommunityCommentPayload = {
  body: string
  parentCommentId?: Id
}

export type UpdateCommunityCommentPayload = {
  body: string
}

export type CommunityCommentNode = {
  _id: Id
  userId: CommunityUserInfo | null
  body: string
  likeCount: number
  likeUserIds: Id[]
  parentCommentId: Id | null
  depth: number
  isDeleted: boolean
  deletedAt: ISODateString | null
  createdAt: ISODateString
  updatedAt: ISODateString
  replies: CommunityCommentNode[]
}
