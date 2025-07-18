import { ReviewType, UserReview } from "../../types/review";
import { instanceWithNoVersioning } from "../index";

export const postReview = async (data: FormData) => {
  const response = await instanceWithNoVersioning.post("/review", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editReview = async (reviewId: string, data: FormData) => {
  const response = await instanceWithNoVersioning.patch(`/review/${reviewId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getReviewImages = async (reviewId: string) => {
  const response = await instanceWithNoVersioning.get(`/review/${reviewId}/images`);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await instanceWithNoVersioning.delete(`/review/${reviewId}`);
  return response.data;
};

export interface UserReviewResponse {
  reviews: UserReview<ReviewType.MYPAGE>[];
  reviewCount: number;
  lastPage: number;
}

export interface UserReviewParams {
  userId: string;
  page: number;
  limit: number;
}

export const getUserReview = async (params: UserReviewParams) => {
  const response = await instanceWithNoVersioning.get<UserReviewResponse>(`/review/${params.userId}/reviews`, {
    params: { page: params.page, limit: params.limit },
  });
  return response.data;
};

export interface MyReviewParams {
  page: number;
  limit: number;
}

export const getMyReviews = async (params: MyReviewParams) => {
  const response = await instanceWithNoVersioning.get<UserReviewResponse>(`/review/my/reviews`, {
    params: { page: params.page, limit: params.limit },
  });
  return response.data;
};

export interface RamenyaReviewResponse {
  reviews: UserReview<ReviewType.USER>[];
  reviewCount: number;
  lastPage: number;
}

export const getRamenyaReview = async (ramenyaId: string, page: number = 1, limit: number = 10) => {
  const response = await instanceWithNoVersioning.get<RamenyaReviewResponse>(`/review`, {
    params: {
      ramenyaId,
      page,
      limit,
    },
  });
  return response.data;
};

export const getReviewDetail = async (reviewId: string) => {
  const response = await instanceWithNoVersioning.get<UserReview<ReviewType.MYPAGE>>(`/review/${reviewId}`);
  return response.data;
};
