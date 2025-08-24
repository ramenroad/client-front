import tw from "twin.macro";
import { UserReview, User, ReviewType } from "../../types/review";
import { RamenroadText } from "../common/RamenroadText";
import { IconArrowRight, IconStar } from "../Icon";
import defaultProfile from "../../assets/images/profile-default.png";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "@emotion/styled";
import { useModal } from "../../hooks/common/useModal";
import { Modal } from "../common/Modal";
import { useRamenyaReviewDeleteMutation } from "../../hooks/queries/useRamenyaReviewQuery";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../hooks/queries/queryKeys";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../hooks/common/usePopup";
import { PopupType } from "../../types";
import { useToast } from "../toast/ToastProvider";
import { ImagePopup } from "../popup/ImagePopup";

interface MyReviewCardProps<T extends boolean = false> {
  review: UserReview<T extends true ? ReviewType.MYPAGE : ReviewType.USER>;
  mypage?: T;
  editable: boolean;
}

const MAX_REVIEW_LENGTH = 94;

const ReviewCard = <T extends boolean = false>(props: MyReviewCardProps<T>) => {
  const { review } = props;

  const navigate = useNavigate();
  const { openToast } = useToast();
  const { openPopup, closePopup } = usePopup();

  const { mutate: deleteReview } = useRamenyaReviewDeleteMutation();

  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();

  const queryClient = useQueryClient();

  const isReviewLong = review.review.length > MAX_REVIEW_LENGTH;
  const displayReview =
    isReviewLong && !isReviewExpanded ? review.review.slice(0, MAX_REVIEW_LENGTH) + "..." : review.review;

  const handleEditReview = () => {
    navigate(`/review/edit/${review._id}`);
  };

  // 타입 가드 함수들
  const isDetailedRamenya = (ramenyaId: unknown): ramenyaId is { _id: string; name: string } => {
    return typeof ramenyaId === "object" && ramenyaId !== null && "_id" in ramenyaId;
  };

  const hasUserId = (review: UserReview<ReviewType>): review is UserReview<ReviewType> & { userId: User } => {
    return review.userId !== undefined;
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
              <RamenroadText size={16} weight="sb">
                {isDetailedRamenya(review.ramenyaId) ? review.ramenyaId.name : review.ramenyaId}
              </RamenroadText>
              <IconArrowRight />
            </div>
          ) : (
            hasUserId(review) && (
              <ReviewNameBox onClick={() => navigate(`/user-review/${review.userId._id}`)}>
                <ReviewerProfileImage src={review.userId.profileImageUrl || defaultProfile} />
                <ReviewerInfoBox>
                  <RamenroadText size={14} weight="sb">
                    {review.userId.nickname}
                  </RamenroadText>

                  <ReviewerReviewInfo>
                    <RamenroadText size={12} weight="r">
                      <span>평균 별점 </span>
                      <RamenroadText size={12} weight="m">
                        {review.userId.avgReviewRating?.toFixed(1)}
                      </RamenroadText>
                    </RamenroadText>
                    <ReviewerReviewCountDivider />
                    <RamenroadText size={12} weight="r">
                      <span>리뷰</span>{" "}
                      <RamenroadText size={12} weight="m">
                        {review.userId.reviewCount}
                      </RamenroadText>
                    </RamenroadText>
                  </ReviewerReviewInfo>
                </ReviewerInfoBox>
              </ReviewNameBox>
            )
          )}
        </ReviewCardTitle>

        {/* 작성자 본인한테만 보이는 영역: 수정, 삭제 */}
        {props.editable && (
          <ReviewActionWrapper>
            <ActionButton onClick={handleEditReview}>
              <RamenroadText size={12} weight="r">
                수정
              </RamenroadText>
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
              <RamenroadText size={12} weight="r">
                삭제
              </RamenroadText>
            </ActionButton>
          </ReviewActionWrapper>
        )}
      </ReviewCardHeader>
      <ReviewCardSubHeader>
        <ReviewCardSubHeaderLeftSection>
          <RatingWrapper>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconStar key={star} inactive={star > review.rating} />
            ))}
          </RatingWrapper>
          <RamenyaMenuListWrapper>
            {review.menus?.map((menu, index) => {
              return (
                <RamenyaMenuWrapper>
                  <RamenroadText size={12} weight="r">
                    {menu}
                  </RamenroadText>
                  {index !== review.menus.length - 1 && <MenuSeparator />}
                </RamenyaMenuWrapper>
              );
            })}
          </RamenyaMenuListWrapper>
        </ReviewCardSubHeaderLeftSection>
        <ReviewCardSubHeaderRightSection>
          <RamenroadText size={12} weight="r">
            {dayjs(review.createdAt).format("YY.M.DD")}
          </RamenroadText>
        </ReviewCardSubHeaderRightSection>
      </ReviewCardSubHeader>
      <ReviewCardContent>
        <RamenroadText size={14} weight="r">
          {displayReview}
        </RamenroadText>
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

export default ReviewCard;

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
  cursor-pointer
  text-black
`;

const ReviewCardSubHeader = tw.section`
  flex flex-row gap-2 items-center justify-between
  text-gray-500
  mt-10
`;

const RatingWrapper = tw.section`
  flex flex-row gap-2 items-center
`;

const ReviewCardSubHeaderLeftSection = tw.section`
  flex flex-row gap-8 items-center
  flex-1
`;

const RamenyaMenuListWrapper = tw.section`
  flex flex-row gap-4 items-center
  flex-1
`;

const RamenyaMenuWrapper = tw.section`
  flex flex-row gap-4 items-center
  leading-18
`;

const MenuSeparator = tw.section`
  w-1 h-10 bg-gray-100
`;

const ReviewCardSubHeaderRightSection = tw.section``;

const ReviewCardContent = tw.section`
  mt-8 leading-21
`;

const MoreButton = tw(RamenroadText)`
  cursor-pointer
  text-gray-400
  ml-4
`;

const ReviewImages = tw.div`
    flex gap-1 items-center
    overflow-x-auto
    mt-12
    scrollbar-hide
    relative
    -mr-20
`;

const ReviewImage = styled.img<{ index: number; totalImages: number }>(({ totalImages }) => [
  tw`    
    first:rounded-l-8
    last:rounded-r-8
    [&:only-child]:rounded-8 
    object-cover flex-shrink-0
    cursor-pointer
    `,
  totalImages <= 3 ? tw`w-116 h-116` : tw`w-96 h-96`,
]);
