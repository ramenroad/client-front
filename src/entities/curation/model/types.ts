import type { Id, ISODateString } from '@/shared/model'

export type Banner = {
  _id: Id
  name: string
  description: string
  priority: number
  redirectUrl: string
  isShown: boolean
  bannerImageUrl: string
  createdAt?: ISODateString
  updatedAt?: ISODateString
}

export type CurationBusinessHour = {
  day: string
  operatingTime?: string
  breakTime?: string
  isOpen: boolean
}

export type CurationRamenroadReview = {
  oneLineReview: string
  description: string
}

export type RamenyaGroupItem = {
  _id: Id
  name: string
  genre: string[]
  region: string
  address: string
  latitude: number
  longitude: number
  businessHours: CurationBusinessHour[]
  thumbnailUrl: string
  ramenroadReview: CurationRamenroadReview
}

export type RamenyaGroup = {
  _id: Id
  name: string
  description: string
  type: number
  priority: number
  isShown: boolean
  ramenyas: RamenyaGroupItem[]
  descriptionImageUrl: string
}
