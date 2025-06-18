// 타입이 기존에 받아오던 리뷰와 다른 형식인 것 같아 분리하였습니다.

export interface UserReview {
  _id: string;
  ramenyaId: {
    _id: string;
    name: string;
  };
  rating: number;
  review: string;
  menus: string[];
  reviewImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}
