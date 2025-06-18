import {
  deleteReview,
  editReview,
  getMyReviews,
  getReview,
  getReviewDetail,
  getReviewImages,
  getUserReview,
  postReview,
} from "../../api/review";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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

export const useUserReviewQuery = (userId?: string) => {
  const userReviewQuery = useInfiniteQuery({
    ...queryKeys.review.userReview(userId!),
    queryFn: ({ pageParam = 1 }) => getUserReview({ userId: userId!, page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => (lastPage.reviews.length === 10 ? allPages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: !!userId,
  });
  return { userReviewQuery };
};

export const useMyReviewQuery = (enabled: boolean) => {
  const myReviewQuery = useInfiniteQuery({
    ...queryKeys.review.my,
    queryFn: ({ pageParam = 1 }) => getMyReviews({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => (lastPage.reviews.length === 10 ? allPages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: !!enabled,
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

export const useRamenyaReviewDetailQuery = (reviewId: string) => {
  const reviewDetailQuery = useQuery({
    queryKey: ["ramenyaReviewDetail", reviewId],
    queryFn: () => getReviewDetail(reviewId),
    enabled: !!reviewId,
  });

  return { reviewDetailQuery };
};
