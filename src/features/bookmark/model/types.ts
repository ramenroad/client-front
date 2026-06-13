import type { Id, ISODateString } from '@/shared/model'

export type BookmarkedRamenya = {
  _id: Id
  name: string
  genre: string[]
  thumbnailUrl?: string
  rating: number
  reviewCount: number
}

export type MyBookmark = {
  _id: Id
  user: Id
  ramenya: BookmarkedRamenya
  createdAt: ISODateString
}
