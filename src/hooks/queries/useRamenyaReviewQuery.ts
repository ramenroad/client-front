import { deleteReview, editReview, getMyReview, getReview, getReviewImages, postReview } from "../../api/review";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useRamenyaReviewMutation = () => {
  return useMutation({
    mutationFn: postReview,
  });
};

export const useRamenyaReviewEditMutation = (reviewId: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editReview(reviewId, data),
  });
};

export const useRamenyaReviewImagesQuery = (reviewId: string) => {
  return useQuery({
    queryKey: ["ramenyaReviewImages", reviewId],
    queryFn: () => getReviewImages(reviewId),
  });
};

export const useMyReviewQuery = () => {
  const myReviewQuery = useQuery({
    ...queryKeys.review.myReview,
    queryFn: getMyReview,
    select: (data) => data.reviews,
  });
  return { myReviewQuery };
};

export const useRamenyaReviewDeleteMutation = () => {
  return useMutation({
    mutationFn: deleteReview,
  });
};

export const useRamenyaReviewQuery = (ramenyaId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["ramenyaReview", ramenyaId, page, limit],
    queryFn: () => getReview(ramenyaId, page, limit),
  });
};
