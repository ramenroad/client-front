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

export interface UserReview<T extends ReviewType = ReviewType.USER> {
  _id: string;
  ramenyaId: T extends ReviewType.MYPAGE ? { _id: string; name: string } : string;
  userId?: T extends ReviewType.MYPAGE ? undefined : User;
  rating: number;
  review: string;
  menus: string[];
  reviewImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}
