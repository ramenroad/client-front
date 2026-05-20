import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ramenyaQueryKeys } from '@/entities/ramenya/api'
import { reviewQueryKeys, useDeleteReviewMutation } from '@/entities/review/api'
import type { MyReview, Review, ReviewRamenyaInfo, UserReview } from '@/entities/review/model'
import { formatShortDate } from '@/shared/lib/date'
import { IconArrowRight, IconStar, IconUnSignInUserProfile } from '@/shared/ui/icon'
import { ImagePopup } from '@/shared/ui/image-popup'
import { Modal } from '@/shared/ui/modal'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import { useToast } from '@/shared/ui/toast'

type ReviewItem = Review | MyReview | UserReview

interface ReviewCardProps {
  review: ReviewItem
  editable: boolean
  mypage?: boolean
}

const MAX_REVIEW_LENGTH = 94
const REVIEW_RATING_STARS = [1, 2, 3, 4, 5]

const isDetailedRamenya = (ramenyaId: ReviewItem['ramenyaId']): ramenyaId is ReviewRamenyaInfo => {
  return typeof ramenyaId === 'object' && ramenyaId !== null && '_id' in ramenyaId
}

const hasAuthor = (review: ReviewItem): review is Review => {
  return 'userId' in review && typeof review.userId === 'object' && review.userId !== null
}

const getRamenyaId = (review: ReviewItem) => {
  return isDetailedRamenya(review.ramenyaId) ? review.ramenyaId._id : review.ramenyaId
}

const getRamenyaName = (review: ReviewItem) => {
  return isDetailedRamenya(review.ramenyaId) ? review.ramenyaId.name : review.ramenyaId
}

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <RatingWrapper>
      {REVIEW_RATING_STARS.map((star) => {
        const isFullStar = star <= rating
        const isHalfStar = star - 0.5 <= rating && rating < star

        if (isHalfStar) {
          return <IconStar key={star} inactive={!isFullStar} isHalf />
        }

        return <IconStar key={star} inactive={star > rating} />
      })}
    </RatingWrapper>
  )
}

const ReviewHeader = ({ review, mypage, editable, onEdit, onDelete }: {
  review: ReviewItem
  mypage: boolean
  editable: boolean
  onEdit: () => void
  onDelete: () => void
}) => {
  const navigate = useNavigate()

  if (mypage) {
    return (
      <ReviewCardHeader>
        <ReviewCardTitle>
          <RamenyaButton type="button" onClick={() => navigate(`/detail/${getRamenyaId(review)}`)}>
            <RaisingText size={16} weight="sb">
              {getRamenyaName(review)}
            </RaisingText>
            <IconArrowRight />
          </RamenyaButton>
        </ReviewCardTitle>
        {editable && <ReviewActions onEdit={onEdit} onDelete={onDelete} />}
      </ReviewCardHeader>
    )
  }

  return (
    <ReviewCardHeader>
      <ReviewCardTitle>
        {hasAuthor(review) && (
          <ReviewNameButton type="button" onClick={() => navigate(`/user-review/${review.userId._id}`)}>
            {review.userId.profileImageUrl ? (
              <ReviewerProfileImage src={review.userId.profileImageUrl} alt={review.userId.nickname} />
            ) : (
              <IconUnSignInUserProfile />
            )}
            <ReviewerInfoBox>
              <RaisingText size={14} weight="sb">
                {review.userId.nickname}
              </RaisingText>
              <ReviewerReviewInfo>
                <ReviewerReviewMeta size={12} weight="r">
                  평균 별점{' '}
                  <ReviewerReviewValue size={12} weight="m">
                    {review.userId.avgReviewRating?.toFixed(1) ?? '0.0'}
                  </ReviewerReviewValue>
                </ReviewerReviewMeta>
                <ReviewerReviewCountDivider />
                <ReviewerReviewMeta size={12} weight="r">
                  리뷰 <ReviewerReviewValue size={12} weight="m">{review.userId.reviewCount}</ReviewerReviewValue>
                </ReviewerReviewMeta>
              </ReviewerReviewInfo>
            </ReviewerInfoBox>
          </ReviewNameButton>
        )}
      </ReviewCardTitle>
      {editable && <ReviewActions onEdit={onEdit} onDelete={onDelete} />}
    </ReviewCardHeader>
  )
}

const ReviewActions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => {
  return (
    <ReviewActionWrapper>
      <ActionButton type="button" onClick={onEdit}>
        <ActionText size={12} weight="r">
          수정
        </ActionText>
      </ActionButton>
      <ActionButton type="button" onClick={onDelete}>
        <ActionText size={12} weight="r">
          삭제
        </ActionText>
      </ActionButton>
    </ReviewActionWrapper>
  )
}

export const ReviewCard = ({ review, editable, mypage = false }: ReviewCardProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const [isReviewExpanded, setIsReviewExpanded] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteReviewMutation = useDeleteReviewMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ramenyaQueryKeys.detail(getRamenyaId(review)) })
      openToast('리뷰가 삭제되었습니다.')
      setIsDeleteModalOpen(false)
    },
    onError: () => {
      openToast('리뷰 삭제에 실패했습니다.')
    },
  })
  const isReviewLong = review.review.length > MAX_REVIEW_LENGTH
  const displayReview = useMemo(() => {
    if (!isReviewLong || isReviewExpanded) {
      return review.review
    }

    return `${review.review.slice(0, MAX_REVIEW_LENGTH)}...`
  }, [isReviewExpanded, isReviewLong, review.review])
  const images = review.reviewImageUrls ?? []
  const menus = review.menus ?? []

  const handleEdit = () => {
    navigate(`/review/edit/${review._id}`)
  }

  const handleDeleteConfirm = () => {
    deleteReviewMutation.mutate(review._id)
  }

  return (
    <ReviewCardWrapper>
      <ReviewHeader
        review={review}
        editable={editable}
        mypage={mypage}
        onEdit={handleEdit}
        onDelete={() => setIsDeleteModalOpen(true)}
      />
      <ReviewCardSubHeader>
        <ReviewCardSubHeaderLeftSection>
          <RatingStars rating={review.rating} />
          <RamenyaMenuListWrapper>
            {menus.map((menu, index) => (
              <RamenyaMenuWrapper key={`${menu}-${index}`}>
                <RaisingText size={12} weight="r">
                  {menu}
                </RaisingText>
                {index !== menus.length - 1 && <MenuSeparator />}
              </RamenyaMenuWrapper>
            ))}
          </RamenyaMenuListWrapper>
        </ReviewCardSubHeaderLeftSection>
        <ReviewCardSubHeaderRightSection>
          <RaisingText size={12} weight="r">
            {formatShortDate(review.createdAt)}
          </RaisingText>
        </ReviewCardSubHeaderRightSection>
      </ReviewCardSubHeader>
      <ReviewCardContent>
        <ReviewText size={14} weight="r">
          {displayReview}
        </ReviewText>
        {isReviewLong && (
          <MoreButton type="button" onClick={() => setIsReviewExpanded((prev) => !prev)}>
            {isReviewExpanded ? '접기' : '더보기'}
          </MoreButton>
        )}
        <ReviewImages>
          {images.map((image, index) => (
            <ReviewImageButton key={`${image}-${index}`} type="button" onClick={() => setSelectedImageIndex(index)}>
              <ReviewImage src={image} alt={`리뷰 이미지 ${index + 1}`} />
            </ReviewImageButton>
          ))}
        </ReviewImages>
      </ReviewCardContent>

      <Modal isOpen={selectedImageIndex !== null} onClose={() => setSelectedImageIndex(null)}>
        {selectedImageIndex !== null && (
          <ImagePopup
            isOpen
            images={images}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
          />
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DeleteModalContent>
          <DeleteModalText>작성한 리뷰를 삭제할까요?{`\n`}내 리뷰 목록에서도 삭제됩니다.</DeleteModalText>
          <DeleteModalButtonBox>
            <DeleteModalCancelButton type="button" onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </DeleteModalCancelButton>
            <DeleteModalConfirmButton type="button" onClick={handleDeleteConfirm} disabled={deleteReviewMutation.isPending}>
              확인
            </DeleteModalConfirmButton>
          </DeleteModalButtonBox>
        </DeleteModalContent>
      </Modal>
    </ReviewCardWrapper>
  )
}

const ReviewCardWrapper = render.article('box-border flex w-full flex-col px-20 py-20')

const ReviewCardHeader = render.div('flex min-h-40 items-start justify-between gap-12')

const ReviewCardTitle = render.div('min-w-0 flex-1')

const RamenyaButton = render.button('flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-left')

const ReviewNameButton = render.button('flex cursor-pointer items-center gap-8 border-none bg-transparent p-0 text-left')

const ReviewerProfileImage = render.img('h-40 w-40 rounded-full object-cover')

const ReviewerInfoBox = render.div('flex min-w-0 flex-col')

const ReviewerReviewInfo = render.div('flex items-center gap-6')

const ReviewerReviewMeta = render.extend(RaisingText, 'text-gray-500')

const ReviewerReviewValue = render.extend(RaisingText, 'text-gray-800')

const ReviewerReviewCountDivider = render.div('h-10 w-1 bg-gray-100')

const ReviewActionWrapper = render.div('flex shrink-0 items-center gap-10')

const ActionButton = render.button('cursor-pointer border-none bg-transparent p-0')

const ActionText = render.extend(RaisingText, 'text-gray-500')

const ReviewCardSubHeader = render.div('mt-12 flex items-center justify-between gap-12')

const ReviewCardSubHeaderLeftSection = render.div('flex min-w-0 items-center gap-8')

const RatingWrapper = render.div('flex shrink-0 items-center gap-2')

const RamenyaMenuListWrapper = render.div('flex min-w-0 items-center gap-4 overflow-hidden text-gray-500')

const RamenyaMenuWrapper = render.div('flex shrink-0 items-center gap-4 text-gray-500')

const MenuSeparator = render.div('h-10 w-1 bg-gray-100')

const ReviewCardSubHeaderRightSection = render.div('shrink-0 text-gray-500')

const ReviewCardContent = render.div('mt-12 flex flex-col')

const ReviewText = render.extend(RaisingText, 'whitespace-pre-line text-gray-800')

const MoreButton = render.button('mt-4 w-fit cursor-pointer border-none bg-transparent p-0 font-14-m text-gray-500')

const ReviewImages = render.div('mt-12 flex gap-8 overflow-x-auto pb-2')

const ReviewImageButton = render.button('h-80 w-80 shrink-0 cursor-pointer overflow-hidden rounded-[6px] border-none bg-transparent p-0')

const ReviewImage = render.img('h-full w-full object-cover')

const DeleteModalContent = render.div('flex w-290 flex-col items-center justify-center gap-16 rounded-[12px] bg-white pt-32')

const DeleteModalText = render.div('whitespace-pre-line text-center font-16-r text-gray-900')

const DeleteModalButtonBox = render.div('flex h-60 w-full')

const DeleteModalCancelButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-black')

const DeleteModalConfirmButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-orange disabled:text-gray-200')
