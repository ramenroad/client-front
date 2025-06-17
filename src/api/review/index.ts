import { MyReview } from "../../types/review";
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

export interface MyReviewResponse {
  reviews: MyReview[];
}

export const getMyReview = async () => {
  const response = await instanceWithNoVersioning.get<MyReviewResponse>("/review/my");
  return response.data;
};

export const getReview = async (ramenyaId: string, page: number = 1, limit: number = 10) => {
  const response = await instanceWithNoVersioning.get(`/review?ramenyaId=${ramenyaId}&page=${page}&limit=${limit}`);
  return response.data;
};
