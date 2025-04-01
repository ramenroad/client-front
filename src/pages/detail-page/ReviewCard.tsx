import React from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import defaultProfile from '../../assets/images/profile-default.png'
import { IconStarMedium } from '../../components/Icon'
import { UserReview } from '../../types'

export const ReviewCard = ({ review }: { review: UserReview }) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    // const dummyImages = [
    //     'https://placehold.co/600x400',
    //     'https://placehold.co/600x400',
    //     'https://placehold.co/600x400',
    //     'https://placehold.co/600x400',
    //     'https://placehold.co/600x400',
    // ]
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

    return (
        <Wrapper>
            <ReviewHeader>
                <ReviewNameBox>
                    <ReviewerProfileImage src={defaultProfile} />
                    <ReviewerName>
                        {review.userId.nickname}
                    </ReviewerName>
                </ReviewNameBox>

                <ReviewDeleteButton>
                    삭제
                </ReviewDeleteButton>
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
                        {review.menus?.map((menu, index) => (
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
                {/* {dummyImages.map((image, index) => (
                    <ReviewImage
                        key={index}
                        src={image}
                        index={index}
                        totalImages={dummyImages.length}
                    />
                ))} */}
            </ReviewImages>
        </Wrapper>
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