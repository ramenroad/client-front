import tw from "twin.macro";
import { MyReview } from "../../types/review";
import { RamenroadText } from "../common/RamenroadText";
import { IconArrowRight, IconStarMedium } from "../Icon";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "@emotion/styled";
import { useModal } from "../../hooks/common/useModal";
import { Modal } from "../common/Modal";
import { ImagePopup } from "../common/ImagePopup";
import { useRamenyaReviewDeleteMutation } from "../../hooks/queries/useRamenyaReviewQuery";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../hooks/queries/queryKeys";
import { useToast } from "../ToastProvider";
import { useNavigate } from "react-router-dom";

interface MyReviewCardProps {
  review: MyReview;
}

const MAX_REVIEW_LENGTH = 94;

export const MyReviewCard = (props: MyReviewCardProps) => {
  const { review } = props;
  const navigate = useNavigate();
  const { openToast } = useToast();

  const { mutate: deleteReview } = useRamenyaReviewDeleteMutation();

  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal();
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();

  const queryClient = useQueryClient();

  const isReviewLong = review.review.length > MAX_REVIEW_LENGTH;
  const displayReview =
    isReviewLong && !isReviewExpanded ? review.review.slice(0, MAX_REVIEW_LENGTH) + "..." : review.review;

  const handleDeleteReview = () => {
    deleteReview(review._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ ...queryKeys.review.myReview });
        openToast("리뷰가 삭제되었습니다.");
      },
    });
  };

  return (
    <ReviewCardWrapper>
      <ReviewCardHeader>
        <ReviewCardTitle>
          <RamenroadText size={16} weight="sb" onClick={() => navigate(`/detail/${review.ramenyaId._id}`)}>
            {review.ramenyaId.name}
          </RamenroadText>
          <IconArrowRight />
        </ReviewCardTitle>
        <ReviewActionWrapper>
          {/* 작업이 겹칠 것 같아 작업 하신 이후 로직 그대로 적용하겠습니다. */}
          {/* <ActionButton>
            <RamenroadText size={12} weight="r" onClick={handleEditReview}>
              수정
            </RamenroadText>
          </ActionButton> */}
          <ActionButton
            onClick={() => {
              openDeleteModal();
            }}
          >
            <RamenroadText size={12} weight="r">
              삭제
            </RamenroadText>
          </ActionButton>
        </ReviewActionWrapper>
      </ReviewCardHeader>
      <ReviewCardSubHeader>
        <ReviewCardSubHeaderLeftSection>
          <RatingWrapper>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconStarMedium key={star} color={star <= review.rating ? "#FFCC00" : "#E1E1E1"} />
            ))}
          </RatingWrapper>
          <RamenyaMenuListWrapper>
            <RamenroadText size={12} weight="r">
              {review.menus.map((menu, index) => {
                return (
                  <RamenyaMenuWrapper>
                    <RamenroadText size={12} weight="r">
                      {menu}
                    </RamenroadText>
                    {index !== review.menus.length - 1 && <MenuSeparator />}
                  </RamenyaMenuWrapper>
                );
              })}
            </RamenroadText>
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
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <ModalContent>
            <ModalTitle>
              작성한 리뷰를 삭제할까요?
              <br />내 리뷰 목록에서도 삭제됩니다.
            </ModalTitle>
            <ModalButtonBox>
              <ModalCancelButton onClick={closeDeleteModal}>취소</ModalCancelButton>
              <ModalConfirmButton onClick={handleDeleteReview}>삭제</ModalConfirmButton>
            </ModalButtonBox>
          </ModalContent>
        </Modal>
      )}
    </ReviewCardWrapper>
  );
};

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
  mt-13
`;

const RatingWrapper = tw.section`
  flex flex-row gap-2 items-center
`;

const ReviewCardSubHeaderLeftSection = tw.section`
  flex flex-row gap-8 items-center
`;

const RamenyaMenuListWrapper = tw.section`
  flex flex-row gap-4 items-center
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

const ModalContent = tw.div`
    flex flex-col gap-16 w-290 pt-32
    items-center
    justify-center
    bg-white
    rounded-12
`;

const ModalTitle = tw.div`
    font-16-r text-gray-900
    text-center
`;

const ModalButtonBox = tw.div`
    flex h-60 w-full
`;

const ModalCancelButton = tw.button`
    w-full
    font-16-r text-black
    cursor-pointer
    border-none
    bg-transparent
`;

const ModalConfirmButton = tw.button`
    w-full
    font-16-r text-orange
    cursor-pointer
    border-none
    bg-transparent`;
