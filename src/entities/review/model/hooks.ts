import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteReview,
  getMyReviews,
  getRamenyaReview,
  getReviewDetail,
  getReviewImages,
  getUserReview,
} from "@/entities/review/api";
import { queryKeys } from "@/shared/model/query-keys";

export const useRamenyaReviewImagesQuery = (reviewId: string) => {
  const ramenyaReviewImagesQuery = useQuery({
    ...queryKeys.review.images(reviewId),
    queryFn: () => getReviewImages(reviewId),
  });

  return { ramenyaReviewImagesQuery };
};

export const useUserReviewQuery = (userId?: string) => {
  const userReviewQuery = useInfiniteQuery({
    ...queryKeys.review.userReview(userId!),
    queryFn: ({ pageParam = 1 }) => getUserReview({ userId: userId!, page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => (lastPage.reviews.length === 10 ? allPages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: !!userId,
    retry: false,
  });

  return { userReviewQuery };
};

export const useMyReviewQuery = (enabled: boolean) => {
  const myReviewQuery = useInfiniteQuery({
    ...queryKeys.review.my,
    queryFn: ({ pageParam = 1 }) => getMyReviews({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => (lastPage.reviews.length === 10 ? allPages.length + 1 : undefined),
    initialPageParam: 1,
    enabled,
  });

  return { myReviewQuery };
};

export const useRamenyaReviewDeleteMutation = () => {
  const remove = useMutation({
    mutationFn: deleteReview,
  });

  return { remove };
};

export const useRamenyaReviewQuery = (ramenyaId: string) => {
  const ramenyaReviewQuery = useInfiniteQuery({
    ...queryKeys.review.ramenyaReview(ramenyaId),
    queryFn: ({ pageParam = 1 }) => getRamenyaReview(ramenyaId, pageParam, 10),
    getNextPageParam: (lastPage, allPages) => (lastPage.reviews.length === 10 ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });

  return { ramenyaReviewQuery };
};

export const useRamenyaReviewDetailQuery = (reviewId: string) => {
  const reviewDetailQuery = useQuery({
    ...queryKeys.review.detail(reviewId),
    queryFn: () => getReviewDetail(reviewId),
    enabled: !!reviewId,
  });

  return { reviewDetailQuery };
};
