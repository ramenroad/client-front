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

export type MyComment = {
  _id: Id
  boardId: Id
  body: string
  depth: number
  likeCount: number
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
