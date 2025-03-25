import React from 'react'
import tw from 'twin.macro'
import defaultProfile from '../../assets/images/profile-default.png'
import { IconStarMedium } from '../../components/Icon'
import { UserReview } from '../../types'

export const ReviewCard = ({ review }: { review: UserReview }) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    console.log(review)
    // 더보기 표시 기준 글자 수
    const MAX_TEXT_LENGTH = 100
    const isTextLong = review.review.length > MAX_TEXT_LENGTH

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    // 더보기 버튼 표시 여부에 따라 표시할 텍스트 결정
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
                <ReviewerProfileImage src={defaultProfile} />
                <ReviewerName>
                    {review.userId}
                </ReviewerName>
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
                    <ReviewImage key={index} src={image} />
                ))}
            </ReviewImages>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col
`

const ReviewHeader = tw.div`
    flex gap-8 items-center
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
    rounded-8
`

const ReviewImage = tw.img`
    w-96 h-96
`