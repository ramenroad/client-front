import type { Id, ISODateString, PaginationParams } from '@/shared/model'

export type CreateReviewRequest = {
  ramenyaId: string
  rating: number
  review: string
  menus: string
  reviewImages?: File[]
}

export type UpdateReviewRequest = {
  rating: number
  review: string
  menus: string
  reviewImageUrls?: string[]
  reviewImages?: File[]
}

export type ReviewAuthor = {
  _id: Id
  nickname: string
  profileImageUrl: string
  avgReviewRating: number
  reviewCount: number
}

export type Review = {
  _id: Id
  ramenyaId: Id
  userId: ReviewAuthor
  rating: number
  menus?: string[]
  review: string
  reviewImageUrls: string[]
  createdAt?: ISODateString
  updatedAt?: ISODateString
}

export type RamenyaReviewsParams = PaginationParams & {
  ramenyaId: string
}

export type RamenyaReviewsResponse = {
  lastPage: number
  reviews: Review[]
}

export type RamenyaReviewImagesResponse = {
  ramenyaReviewImagesUrls: string[]
}

export type ReviewRamenyaInfo = {
  _id: Id
  name: string
}

export type MyReview = {
  _id: Id
  ramenyaId: ReviewRamenyaInfo | Id
  rating: number
  review: string
  reviewImageUrls: string[]
  createdAt?: ISODateString
  updatedAt?: ISODateString
  menus: string[]
}

export type MyReviewsResponse = {
  reviewCount: number
  lastPage: number
  reviews: MyReview[]
}

export type UserReview = MyReview

export type UserReviewsResponse = {
  reviewCount: number
  lastPage: number
  reviews: UserReview[]
}

export type ReviewDetail = MyReview
