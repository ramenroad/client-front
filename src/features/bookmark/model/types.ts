import type { BusinessHour } from '@/entities/ramenya/model'
import type { Id, ISODateString } from '@/shared/model'

export type BookmarkedRamenya = {
  _id: Id
  name: string
  genre: string[]
  thumbnailUrl?: string
  rating: number
  reviewCount: number
  address?: string
  latitude?: number
  longitude?: number
  businessHours?: BusinessHour[]
}

export type MyBookmark = {
  _id: Id
  user: Id
  ramenya: BookmarkedRamenya
  createdAt: ISODateString
}
