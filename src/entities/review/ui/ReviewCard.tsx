import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import tw from "twin.macro";
import defaultProfile from "@/assets/images/profile-default.png";
import { ReviewType, type User, type UserReview } from "@/entities/review/model";
import { useRamenyaReviewDeleteMutation } from "@/entities/review/model";
import { usePopup } from "@/shared/lib/use-popup";
import { queryKeys } from "@/shared/model/query-keys";
import { PopupType } from "@/shared/model/popup";
import { ImagePopup } from "@/shared/ui/image-popup";
import { IconArrowRight, IconStar } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { RaisingText } from "@/shared/ui/text";
import { useToast } from "@/shared/ui/toast";
import { useModal } from "@/shared/lib/use-modal";

interface MyReviewCardProps<T extends boolean = false> {
  review: UserReview<T extends true ? ReviewType.MYPAGE : ReviewType.USER>;
  mypage?: T;
  editable: boolean;
}

const MAX_REVIEW_LENGTH = 94;

const ReviewCard = <T extends boolean = false>({ review, ...props }: MyReviewCardProps<T>) => {
  const navigate = useNavigate();
  const { openToast } = useToast();
  const { openPopup, closePopup } = usePopup();
  const { remove } = useRamenyaReviewDeleteMutation();
  const { mutate: deleteReview } = remove;
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const queryClient = useQueryClient();
  const isReviewLong = review.review.length > MAX_REVIEW_LENGTH;
  const displayReview = isReviewLong && !isReviewExpanded ? `${review.review.slice(0, MAX_REVIEW_LENGTH)}...` : review.review;

  const isDetailedRamenya = (ramenyaId: unknown): ramenyaId is { _id: string; name: string } => {
    return typeof ramenyaId === "object" && ramenyaId !== null && "_id" in ramenyaId;
  };

  const hasUserId = (currentReview: UserReview<ReviewType>): currentReview is UserReview<ReviewType> & { userId: User } => {
    return "userId" in currentReview && currentReview.userId !== undefined;
  };

  return (
    <ReviewCardWrapper>
      <ReviewCardHeader>
        <ReviewCardTitle>
          {props.mypage ? (
            <div
              onClick={() =>
                navigate(`/detail/${isDetailedRamenya(review.ramenyaId) ? review.ramenyaId._id : review.ramenyaId}`)
              }
            >
              <RaisingText size={16} weight="sb">
                {isDetailedRamenya(review.ramenyaId) ? review.ramenyaId.name : review.ramenyaId}
              </RaisingText>
              <IconArrowRight />
            </div>
          ) : (
            hasUserId(review) && (
              <ReviewNameBox onClick={() => navigate(`/user-review/${review.userId._id}`)}>
                <ReviewerProfileImage src={review.userId.profileImageUrl || defaultProfile} />
                <ReviewerInfoBox>
                  <RaisingText size={14} weight="sb">
                    {review.userId.nickname}
                  </RaisingText>
                  <ReviewerReviewInfo>
                    <RaisingText size={12} weight="r">
                      <span>평균 별점 </span>
                      <RaisingText size={12} weight="m">
                        {review.userId.avgReviewRating?.toFixed(1)}
                      </RaisingText>
                    </RaisingText>
                    <ReviewerReviewCountDivider />
                    <RaisingText size={12} weight="r">
                      <span>리뷰</span>{" "}
                      <RaisingText size={12} weight="m">
                        {review.userId.reviewCount}
                      </RaisingText>
                    </RaisingText>
                  </ReviewerReviewInfo>
                </ReviewerInfoBox>
              </ReviewNameBox>
            )
          )}
        </ReviewCardTitle>

        {props.editable && (
          <ReviewActionWrapper>
            <ActionButton onClick={() => navigate(`/review/edit/${review._id}`)}>
              <ActionText size={12} weight="r">
                수정
              </ActionText>
            </ActionButton>
            <ActionButton
              onClick={() => {
                openPopup(PopupType.CONFIRM, {
                  content: (
                    <>
                      작성한 리뷰를 삭제할까요?
                      <br />내 리뷰 목록에서도 삭제됩니다.
                    </>
                  ),
                  onConfirm: () => {
                    deleteReview(review._id, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ ...queryKeys.review.userReview(review._id) });
                        queryClient.invalidateQueries({ ...queryKeys.review.my });
                        queryClient.invalidateQueries({
                          ...queryKeys.review.ramenyaReview(
                            isDetailedRamenya(review.ramenyaId) ? review.ramenyaId._id : review.ramenyaId,
                          ),
                        });
                        openToast("리뷰가 삭제되었습니다.");
                        closePopup();
                      },
                    });
                  },
                });
              }}
            >
              <ActionText size={12} weight="r">
                삭제
              </ActionText>
            </ActionButton>
          </ReviewActionWrapper>
        )}
      </ReviewCardHeader>
      <ReviewCardSubHeader>
        <ReviewCardSubHeaderLeftSection>
          <RatingWrapper>
            {[1, 2, 3, 4, 5].map((star) => {
              const isFullStar = star <= review.rating;
              const isHalfStar = star - 0.5 <= review.rating && review.rating < star;

              if (isHalfStar) {
                return <IconStar key={star} inactive={!isFullStar} isHalf={true} />;
              }
              return <IconStar key={star} inactive={star > review.rating} />;
            })}
          </RatingWrapper>
          <RamenyaMenuListWrapper>
            {review.menus?.map((menu, index) => (
              <RamenyaMenuWrapper key={`${menu}-${index}`}>
                <RaisingText size={12} weight="r">
                  {menu}
                </RaisingText>
                {index !== review.menus.length - 1 && <MenuSeparator />}
              </RamenyaMenuWrapper>
            ))}
          </RamenyaMenuListWrapper>
        </ReviewCardSubHeaderLeftSection>
        <ReviewCardSubHeaderRightSection>
          <RaisingText size={12} weight="r">
            {dayjs(review.createdAt).format("YY.M.DD")}
          </RaisingText>
        </ReviewCardSubHeaderRightSection>
      </ReviewCardSubHeader>
      <ReviewCardContent>
        <RaisingText size={14} weight="r">
          {displayReview.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              {index < displayReview.split("\n").length - 1 && <br />}
            </span>
          ))}
        </RaisingText>
        {isReviewLong && (
          <MoreButton size={14} weight="m" onClick={() => setIsReviewExpanded(!isReviewExpanded)}>
            {isReviewExpanded ? "접기" : "더보기"}
          </MoreButton>
        )}
        <ReviewImages>
          {review.reviewImageUrls?.map((image, index) => (
            <ReviewImage
              key={index}
              src={image}
              index={index}
              totalImages={review.reviewImageUrls?.length || 0}
              onClick={() => {
                setSelectedImageIndex(index);
                openImagePopup();
              }}
            />
          ))}
        </ReviewImages>
      </ReviewCardContent>
      <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
        {selectedImageIndex !== null && review.reviewImageUrls && (
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeImagePopup}
            images={review.reviewImageUrls}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
          />
        )}
      </Modal>
    </ReviewCardWrapper>
  );
};

const ActionText = tw(RaisingText)`
  whitespace-nowrap
`;

const ReviewNameBox = tw.div`
  flex gap-10 items-center
`;

const ReviewerProfileImage = tw.img`
  w-36 h-36 rounded-full
`;

const ReviewerInfoBox = tw.div`
  flex flex-col
`;

const ReviewerReviewInfo = tw.div`
  flex flex-row gap-6 items-center
  text-gray-70
`;

const ReviewerReviewCountDivider = tw.span`
  w-1 h-10 bg-gray-100
`;

const ReviewCardWrapper = tw.section`
  p-20 flex flex-col
`;

const ReviewCardHeader = tw.section`
  flex flex-row justify-between
`;

const ReviewCardTitle = tw.section`
  flex flex-row gap-2 items-center
  cursor-pointer
`;

const ReviewActionWrapper = tw.section`
  flex flex-row gap-6
`;

const ActionButton = tw.button`
  w-41 h-25 bg-border rounded-12
  shadow-none outline-none border-none
  cursor-pointer text-black
`;

const ReviewCardSubHeader = tw.section`
  flex flex-row gap-2 items-center justify-between
  text-gray-500 mt-10
`;

const RatingWrapper = tw.section`
  flex flex-row gap-2 items-center
`;

const ReviewCardSubHeaderLeftSection = tw.section`
  flex flex-row gap-8 items-center flex-1
`;

const RamenyaMenuListWrapper = tw.section`
  flex flex-row gap-4 items-center flex-1
`;

const RamenyaMenuWrapper = tw.section`
  flex flex-row gap-4 items-center leading-18
`;

const MenuSeparator = tw.section`
  w-1 h-10 bg-gray-100
`;

const ReviewCardSubHeaderRightSection = tw.section`
  h-18 leading-18
`;

const ReviewCardContent = tw.section`
  mt-12 leading-21
`;

const MoreButton = tw(RaisingText)`
  cursor-pointer text-gray-400 ml-4
`;

const ReviewImages = tw.div`
  flex gap-1 items-center overflow-x-auto
  mt-12 scrollbar-hide relative -mr-20
`;

const ReviewImage = styled.img<{ index: number; totalImages: number }>(({ totalImages }) => [
  tw`
    first:rounded-l-8
    last:rounded-r-8
    [&:only-child]:rounded-8
    object-cover flex-shrink-0 cursor-pointer
  `,
  totalImages <= 3 ? tw`w-116 h-116` : tw`w-96 h-96`,
]);

export default ReviewCard;
