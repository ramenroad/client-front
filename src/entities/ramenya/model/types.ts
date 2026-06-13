import type { Id, ISODateString } from '@/shared/model'

export type BusinessHour = {
  day: string
  operatingTime?: string
  breakTime?: string
  isOpen: boolean
}

export type RamenroadReview = {
  oneLineReview: string
  description: string
}

export type RamenyaSummary = {
  _id?: Id
  name: string
  thumbnailUrl: string
  genre: string[]
  region: string
  latitude: number
  longitude: number
  address: string
  ramenroadReview?: RamenroadReview
  businessHours: BusinessHour[]
  rating: number
  reviewCount: number
}

export type NearbyRamenya = RamenyaSummary & {
  _id: Id
}

export type NearbyRamenyasResponse = {
  ramenyas: NearbyRamenya[]
}

export type RamenyaListParams = {
  region?: string
  genre?: string
}

export type NearbyRamenyaParams = {
  latitude: number
  longitude: number
  radius: number
}

export type RecommendedMenu = {
  name: string
  price: number
}

export type RamenyaMenuBoard = {
  _id: Id
  userId: {
    _id: Id
    nickname: string
    profileImageUrl: string
  }
  imageUrl: string
  description: string
  isApproved: boolean
  createdAt: ISODateString
}

export type RamenyaEmbeddedReview = {
  _id: Id
  ramenyaId: Id
  userId: {
    _id: Id
    nickname: string
    profileImageUrl: string
  }
  rating: number
  menus: string[]
  review: string
  reviewImageUrls: string[]
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type RamenyaDetail = Omit<RamenyaSummary, 'ramenroadReview'> & {
  contactNumber?: string
  instagramProfile?: string
  recommendedMenu?: RecommendedMenu[]
  ramenroadReview: RamenroadReview
  isSelfmadeNoodle: boolean
  menus: string[]
  reviews?: RamenyaEmbeddedReview[] | Id[]
  kakaoMapUrl?: string
  kakaoMapDeepLink?: string
  naverMapUrl?: string
  naverMapDeepLink?: string
  googleMapUrl?: string
  googleMapDeepLink?: string
  menuBoard?: RamenyaMenuBoard[]
  isBookmarked?: boolean
}
