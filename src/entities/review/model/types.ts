export enum ReviewType {
  MYPAGE = "MYPAGE",
  USER = "USER",
}

export interface User {
  _id: string;
  nickname: string;
  profileImageUrl: string;
  avgReviewRating: number;
  reviewCount: number;
}

export type UserReview<T extends ReviewType = ReviewType.USER> = {
  _id: string;
  ramenyaId: T extends ReviewType.MYPAGE ? { _id: string; name: string } : string;
  rating: number;
  review: string;
  menus: string[];
  reviewImageUrls: string[];
  createdAt: string;
  updatedAt: string;
} & (T extends ReviewType.MYPAGE ? { userId?: undefined } : { userId: User });
