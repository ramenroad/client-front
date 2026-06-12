import type { Id, ISODateString } from '@/shared/model'

export type MyPost = {
  _id: Id
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

export type MyCommentBoard = {
  _id: Id
  category: string
  title: string
}

export type MyCommentParentUser = {
  _id: Id
  nickname: string
  profileImageUrl: string | null
}

export type MyCommentParent = {
  _id: Id
  body: string
  userId: MyCommentParentUser | null
}

export type MyComment = {
  _id: Id
  // 서버에서 populate되어 게시글(본문) 정보가 들어온다.
  boardId: MyCommentBoard
  body: string
  depth: number
  likeCount: number
  // 답글이면 부모(상위) 댓글이 populate되고, 일반 댓글이면 null.
  parentCommentId: MyCommentParent | null
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type RecentViewedRamenyaInfo = {
  _id: Id
  name: string
  genre: string[]
  thumbnailUrl?: string
  rating: number
  reviewCount: number
}

export type RecentViewedRamenya = {
  _id: Id
  ramenya: RecentViewedRamenyaInfo | Id
  user: Id
  createdAt: ISODateString
  lastViewedAt: ISODateString
}
