import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ReviewCard as ReviewEntityCard } from "@/entities/review/ui";
import { ReviewType, type UserReview, useRamenyaReviewDeleteMutation } from "@/entities/review/model";
import { queryKeys } from "@/shared/model/query-keys";
import { usePopup } from "@/shared/lib/use-popup";
import { useToast } from "@/shared/ui/toast";
import render from "@/shared/ui/render";

interface ReviewCardProps {
  review: UserReview<ReviewType.MYPAGE> | UserReview<ReviewType.USER>;
  mypage?: boolean;
  editable: boolean;
}

const getRamenyaId = (review: ReviewCardProps["review"]) =>
  typeof review.ramenyaId === "object" ? review.ramenyaId._id : review.ramenyaId;

const getUserId = (review: ReviewCardProps["review"]) => ("userId" in review ? review.userId?._id : undefined);

export const ReviewCard = ({ review, editable, mypage = false }: ReviewCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { remove } = useRamenyaReviewDeleteMutation();
  const { openPopup, closePopup } = usePopup();
  const { openToast } = useToast();

  const handleDeleteClick = (reviewId: string) => {
    const ramenyaId = getRamenyaId(review);
    const userId = getUserId(review);

    openPopup("CONFIRM", {
      content: <DeletePromptText>작성한 리뷰를 삭제할까요?{"\n"}내 리뷰 목록에서도 삭제됩니다.</DeletePromptText>,
      onConfirm: () => {
        remove.mutate(reviewId, {
          onSuccess: () => {
            queryClient.invalidateQueries({ ...queryKeys.review.my });
            queryClient.invalidateQueries({ ...queryKeys.review.ramenyaReview(ramenyaId) });
            queryClient.invalidateQueries({ ...queryKeys.ramenya.detail(ramenyaId) });
            queryClient.invalidateQueries({ ...queryKeys.review.detail(reviewId) });

            if (userId) {
              queryClient.invalidateQueries({ ...queryKeys.review.userReview(userId) });
            }

            openToast("리뷰가 삭제되었습니다.");
            closePopup();
          },
        });
      },
    });
  };

  return (
    <ReviewEntityCard
      review={review}
      editable={editable}
      mypage={mypage}
      onDeleteClick={handleDeleteClick}
      onEditClick={(reviewId) => navigate(`/review/edit/${reviewId}`)}
      onRamenyaClick={(ramenyaId) => navigate(`/detail/${ramenyaId}`)}
      onUserClick={(userId) => navigate(`/user-review/${userId}`)}
    />
  );
};

const DeletePromptText = render.div("whitespace-pre-line");
