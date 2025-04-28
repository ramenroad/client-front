import React from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import defaultProfile from '../../assets/images/profile-default.png'
import { IconStarMedium } from '../../components/Icon'
import { UserReview } from '../../types'
import { useModal } from '../../hooks/common/useModal'
import { Modal } from '../../components/common/Modal'
import { useUserInformationQuery } from '../../hooks/queries/useUserInformationQuery'
import { useRamenyaReviewDeleteMutation } from '../../hooks/queries/useRamenyaReviewQuery'
import { useRamenyaDetailQuery } from '../../hooks/queries/useRamenyaDetailQuery'

export const ReviewCard = ({ review }: { review: UserReview }) => {
    const userInformationQuery = useUserInformationQuery();
    const { mutate: deleteReview } = useRamenyaReviewDeleteMutation();
    const { refetch: refetchRamenyaDetail } = useRamenyaDetailQuery(review.ramenyaId);
    const { isOpen, open, close } = useModal()
    const [isExpanded, setIsExpanded] = React.useState(false)
    const MAX_TEXT_LENGTH = 97
    const isTextLong = review.review.length > MAX_TEXT_LENGTH

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const displayText = isTextLong && !isExpanded
        ? `${review.review.slice(0, MAX_TEXT_LENGTH)}...`
        : review.review


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(2);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}.${month}.${day}`;
    }

    const handleOpenDeleteModal = () => {
        open()
    }

    const handleDeleteReview = () => {
        deleteReview(review._id, {
            onSuccess: () => {
                refetchRamenyaDetail();
                close();
            }
        });
    }

    return (
        <>
            <Wrapper>
                <ReviewHeader>
                    <ReviewNameBox>
                        <ReviewerProfileImage src={defaultProfile} />
                        <ReviewerName>
                            {review.userId.nickname}
                        </ReviewerName>
                    </ReviewNameBox>

                    {review.userId._id === userInformationQuery.data?._id && <ReviewDeleteButton onClick={handleOpenDeleteModal}>
                        삭제
                    </ReviewDeleteButton>}
                </ReviewHeader>

                <ReviewScore>
                    <ScoreBox>
                        <StarContainer>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <IconStarMedium
                                    key={star}
                                    color={star <= review.rating ? "#FFCC00" : "#E1E1E1"}
                                />
                            ))}
                        </StarContainer>
                        <ScoredMenuContainer>
                            {Array.isArray(review.menus) && review.menus.map((menu: string, index: number) => (
                                <React.Fragment key={menu}>
                                    <ScoredMenu>
                                        {menu}
                                    </ScoredMenu>
                                    {index < review.menus.length - 1 && <MenuDivider />}
                                </React.Fragment>
                            ))}
                        </ScoredMenuContainer>
                    </ScoreBox>
                    <ReviewDate>
                        {formatDate(review.createdAt.toString())}
                    </ReviewDate>
                </ReviewScore>

                <ReviewDetail>
                    <ReviewTextContainer>
                        <span>{displayText}</span>
                        {isTextLong && (
                            <MoreButton onClick={toggleExpand}>
                                {isExpanded ? '접기' : '더보기'}
                            </MoreButton>
                        )}
                    </ReviewTextContainer>
                </ReviewDetail>

                <ReviewImages>
                    {review.reviewImageUrls?.map((image, index) => (
                        <ReviewImage
                            key={index}
                            src={image}
                            index={index}
                            totalImages={review.reviewImageUrls?.length || 0}
                        />
                    ))}
                </ReviewImages>
            </Wrapper>
            {isOpen &&
                <Modal isOpen={isOpen} onClose={close} >
                    <ModalContent>
                        <ModalTitle>
                            작성한 리뷰를 삭제할까요?
                            <br />
                            내 리뷰 목록에서도 삭제됩니다.
                        </ModalTitle>
                        <ModalButtonBox>
                            <ModalCancelButton onClick={close}>취소</ModalCancelButton>
                            <ModalConfirmButton onClick={handleDeleteReview}>삭제</ModalConfirmButton>
                        </ModalButtonBox>
                    </ModalContent>
                </Modal>
            }
        </>
    )
}

const Wrapper = tw.div`
    flex flex-col
`

const ReviewHeader = tw.div`
    flex gap-8 items-center justify-between
`

const ReviewNameBox = tw.div`
    flex gap-8 items-center
`

const ReviewDeleteButton = tw.button`
    font-12-r text-black
    cursor-pointer
    border-none
    bg-border
    rounded-12
    px-10 py-4
    box-border
`
const ReviewerProfileImage = tw.img`
    w-24 h-24 rounded-full
`

const ReviewerName = tw.div`
    font-14-m text-black
`

const ReviewScore = tw.div`
    flex gap-8 items-center justify-between
    mt-12
`

const ScoreBox = tw.div`
    flex gap-8 items-center
`

const StarContainer = tw.div`
`

const ScoredMenuContainer = tw.div`
    flex gap-4 items-center
`

const MenuDivider = tw.div`
    w-1 h-10 bg-gray-100
`

const ScoredMenu = tw.div`
    font-12-r text-gray-500
`
const ReviewDate = tw.div`
    font-12-r text-gray-500
`

const ReviewDetail = tw.div`
    mt-8
`

const ReviewTextContainer = tw.div`
    font-14-r text-black
    inline-block
`

const MoreButton = tw.button`
    font-14-m text-gray-400
    cursor-pointer
    border-none
    bg-transparent
    inline-block
    p-0
    m-0
`

const ReviewImages = tw.div`
    flex gap-1 items-center
    overflow-x-auto
    mt-12
    scrollbar-hide
    relative
    -mr-20
`

const ReviewImage = styled.img<{ index: number; totalImages: number }>(({ totalImages }) => [
    tw`    
    first:rounded-l-8
    last:rounded-r-8
    [&:only-child]:rounded-8 
    object-cover flex-shrink-0`,
    totalImages <= 3
        ? tw`w-116 h-116`
        : tw`w-96 h-96`
])

const ModalContent = tw.div`
    flex flex-col gap-16 w-290 pt-32
    items-center
    justify-center
    bg-white
    rounded-12
`

const ModalTitle = tw.div`
    font-16-r text-gray-900
    text-center
`

const ModalButtonBox = tw.div`
    flex h-60 w-full
`

const ModalCancelButton = tw.button`
    w-full
    font-16-r text-black
    cursor-pointer
    border-none
    bg-transparent
`

const ModalConfirmButton = tw.button`
    w-full
    font-16-r text-orange
    cursor-pointer
    border-none
    bg-transparent`