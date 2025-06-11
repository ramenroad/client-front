import { deleteReview, getMyReview, getReviewImages, postReview } from "../../api/review";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useRamenyaReviewMutation = () => {
  return useMutation({
    mutationFn: postReview,
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
