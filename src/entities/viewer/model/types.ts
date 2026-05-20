import type { Id } from '@/shared/model'

export type UserSummary = {
  _id: Id
  nickname: string
  profileImageUrl: string
}

export type ReviewUserSummary = UserSummary & {
  avgReviewRating: number
  reviewCount: number
}

export type MyInfo = UserSummary & {
  email: string
}

export type UserInfo = {
  nickname: string
  profileImageUrl: string
  avgReviewRating: number
  reviewCount: number
  isPublic: boolean
  currentMonthReviewCount: number
}
