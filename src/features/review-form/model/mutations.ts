import { useMutation } from "@tanstack/react-query";
import { editReview, postReview } from "@/entities/review/api";
import { queryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/model/query-keys";
import type { ReviewFormMode, ReviewFormValues } from "./types";
import { createReviewFormData } from "./utils";

interface UseReviewFormMutationOptions {
  mode: ReviewFormMode;
  reviewId?: string;
}

const invalidateReviewQueries = (ramenyaId: string, reviewId?: string) => {
  queryClient.invalidateQueries({ ...queryKeys.review.my });
  queryClient.invalidateQueries({ ...queryKeys.review.ramenyaReview(ramenyaId) });
  queryClient.invalidateQueries({ ...queryKeys.ramenya.detail(ramenyaId) });

  if (reviewId) {
    queryClient.invalidateQueries({ ...queryKeys.review.detail(reviewId) });
  }
};

export const useReviewFormMutation = ({ mode, reviewId }: UseReviewFormMutationOptions) => {
  const submitMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      const formData = createReviewFormData(values, mode);

      if (mode === "edit") {
        if (!reviewId) {
          throw new Error("Review id is required for edit mode.");
        }

        return editReview(reviewId, formData);
      }

      return postReview(formData);
    },
    onSuccess: (_data, values) => {
      invalidateReviewQueries(values.ramenyaId, mode === "edit" ? reviewId : undefined);
    },
  });

  return submitMutation;
};
