import { postReview } from "../../api/review";
import { useMutation } from "@tanstack/react-query";

export const useRamenyaReviewMutation = () => {
  return useMutation({
    mutationFn: postReview,
  });
};
