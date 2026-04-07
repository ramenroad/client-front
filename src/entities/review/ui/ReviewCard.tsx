import { useState } from "react";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import defaultProfile from "@/assets/images/profile-default.png";
import { ReviewType, type User, type UserReview } from "@/entities/review/model";
import { ImagePopup } from "@/shared/ui/image-popup";
import { IconArrowRight, IconStar } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { RaisingText } from "@/shared/ui/text";
import { useModal } from "@/shared/lib/useModal";
import render from "@/shared/ui/render";

interface ReviewCardProps {
  review: UserReview<ReviewType.MYPAGE> | UserReview<ReviewType.USER>;
  mypage?: boolean;
  editable: boolean;
  onDeleteClick?: (reviewId: string) => void;
  onEditClick?: (reviewId: string) => void;
  onRamenyaClick?: (ramenyaId: string) => void;
  onUserClick?: (userId: string) => void;
}

const MAX_REVIEW_LENGTH = 94;

const ReviewCard = ({
  review,
  editable,
  mypage = false,
  onDeleteClick,
  onEditClick,
  onRamenyaClick,
  onUserClick,
}: ReviewCardProps) => {
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const isReviewLong = review.review.length > MAX_REVIEW_LENGTH;
  const displayReview =
    isReviewLong && !isReviewExpanded ? `${review.review.slice(0, MAX_REVIEW_LENGTH)}...` : review.review;

  const isDetailedRamenya = (ramenyaId: unknown): ramenyaId is { _id: string; name: string } => {
    return typeof ramenyaId === "object" && ramenyaId !== null && "_id" in ramenyaId;
  };

  const hasUserId = (
    currentReview: UserReview<ReviewType>,
  ): currentReview is UserReview<ReviewType> & { userId: User } => {
    return "userId" in currentReview && currentReview.userId !== undefined;
  };

  return (
    <ReviewCardWrapper>
      <ReviewCardHeader>
        <ReviewCardTitle>
          {mypage ? (
            <RamenyaButton
              type="button"
              onClick={() =>
                onRamenyaClick?.(isDetailedRamenya(review.ramenyaId) ? review.ramenyaId._id : review.ramenyaId)
              }
            >
              <RaisingText size={16} weight="sb">
                {isDetailedRamenya(review.ramenyaId) ? review.ramenyaId.name : review.ramenyaId}
              </RaisingText>
              <IconArrowRight />
            </RamenyaButton>
          ) : (
            hasUserId(review) && (
              <ReviewNameButton type="button" onClick={() => onUserClick?.(review.userId._id)}>
                <ReviewerProfileImage src={review.userId.profileImageUrl || defaultProfile} alt={review.userId.nickname} />
                <ReviewerInfoBox>
                  <RaisingText size={14} weight="sb">
                    {review.userId.nickname}
                  </RaisingText>
                  <ReviewerReviewInfo>
                    <ReviewerReviewMeta size={12} weight="r">
                      평균 별점 <ReviewerReviewValue size={12} weight="m">{review.userId.avgReviewRating?.toFixed(1)}</ReviewerReviewValue>
                    </ReviewerReviewMeta>
                    <ReviewerReviewCountDivider />
                    <ReviewerReviewMeta size={12} weight="r">
                      리뷰 <ReviewerReviewValue size={12} weight="m">{review.userId.reviewCount}</ReviewerReviewValue>
                    </ReviewerReviewMeta>
                  </ReviewerReviewInfo>
                </ReviewerInfoBox>
              </ReviewNameButton>
            )
          )}
        </ReviewCardTitle>

        {editable && (
          <ReviewActionWrapper>
            <ActionButton type="button" onClick={() => onEditClick?.(review._id)}>
              <ActionText size={12} weight="r">
                수정
              </ActionText>
            </ActionButton>
            <ActionButton type="button" onClick={() => onDeleteClick?.(review._id)}>
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
        <ReviewText size={14} weight="r">
          {displayReview}
        </ReviewText>
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

const ActionText = render.extend(RaisingText, "whitespace-nowrap");

const RamenyaButton = render.button("flex items-center gap-2 cursor-pointer border-none bg-transparent p-0 text-left");

const ReviewNameButton = render.button("flex items-center gap-10 border-none bg-transparent p-0 text-left cursor-pointer");

const ReviewerProfileImage = render.img("w-36 h-36 rounded-full");

const ReviewerInfoBox = render.div("flex flex-col");

const ReviewerReviewInfo = render.div("flex flex-row gap-6 items-center text-gray-70");

const ReviewerReviewMeta = render.extend(RaisingText, "flex items-center gap-2");

const ReviewerReviewValue = render.extend(RaisingText, "");

const ReviewerReviewCountDivider = render.span("w-1 h-10 bg-gray-100");

const ReviewCardWrapper = render.section("p-20 flex flex-col");

const ReviewCardHeader = render.section("flex flex-row justify-between");

const ReviewCardTitle = render.section("flex flex-row gap-2 items-center cursor-pointer");

const ReviewActionWrapper = render.section("flex flex-row gap-6");

const ActionButton = render.button(
  "w-41 h-25 bg-border rounded-[12px] shadow-none outline-none border-none cursor-pointer text-black",
);

const ReviewCardSubHeader = render.section("flex flex-row gap-2 items-center justify-between text-gray-500 mt-10");

const RatingWrapper = render.section("flex flex-row gap-2 items-center");

const ReviewCardSubHeaderLeftSection = render.section("flex flex-row gap-8 items-center flex-1");

const RamenyaMenuListWrapper = render.section("flex flex-row gap-4 items-center flex-1");

const RamenyaMenuWrapper = render.section("flex flex-row gap-4 items-center leading-18");

const MenuSeparator = render.section("w-1 h-10 bg-gray-100");

const ReviewCardSubHeaderRightSection = render.section("h-18 leading-18");

const ReviewCardContent = render.section("mt-12 leading-21");

const ReviewText = render.extend(RaisingText, "whitespace-pre-line");

const MoreButton = render.extend(RaisingText, "cursor-pointer text-gray-400 ml-4");

const ReviewImages = render.div("flex gap-1 items-center overflow-x-auto mt-12 scrollbar-hide relative -mr-20");

const ReviewImage = styled.img<{ index: number; totalImages: number }>(({ totalImages }) => [
  {
    objectFit: "cover",
    flexShrink: 0,
    cursor: "pointer",
    "&:first-of-type": {
      borderTopLeftRadius: "8px",
      borderBottomLeftRadius: "8px",
    },
    "&:last-of-type": {
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
    },
    "&:only-child": {
      borderRadius: "8px",
    },
  },
  totalImages <= 3 ? { width: "116px", height: "116px" } : { width: "96px", height: "96px" },
]);

export default ReviewCard;
