import React from 'react'
import tw from 'twin.macro'
import defaultProfile from '../../assets/images/profile-default.png'
import { IconStarMedium } from '../../components/Icon'


export const ReviewCard = () => {
    const scoredMenudummy = ['라멘1', '라멘2']
    const dummyImages = [
        "https://placehold.co/960x960",
        "https://placehold.co/960x960",
        "https://placehold.co/960x960",
    ]
    const [isExpanded, setIsExpanded] = React.useState(false)

    // 더보기 표시 기준 글자 수
    const MAX_TEXT_LENGTH = 100

    const reviewText = "육수의 감칠맛과 염도가 좋은 라멘입니다. 고명도 풍부하고 차슈에서 불향이 나서 좋았어요! 사장님도 친절하시고 매장도 깔끔합니다. 조금 기다렸지만 만족합니다! 다음에는 다른 메뉴 먹어보 육수의 감칠맛과 염도가 좋은 라멘입니다. 고명도 풍부하고 차슈에서 불향이 나서 좋았어요! 사장님도 친절하시고 매장도 깔끔합니다. 조금 기다렸지만 만족합니다! 다음에는 다른 메뉴 먹어보"

    const isTextLong = reviewText.length > MAX_TEXT_LENGTH

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    // 더보기 버튼 표시 여부에 따라 표시할 텍스트 결정
    const displayText = isTextLong && !isExpanded
        ? `${reviewText.slice(0, MAX_TEXT_LENGTH)}...`
        : reviewText

    return (
        <Wrapper>
            <ReviewHeader>
                <ReviewerProfileImage src={defaultProfile} />
                <ReviewerName>
                    라멘로드
                </ReviewerName>
            </ReviewHeader>

            <ReviewScore>
                <ScoreBox>
                    <StarContainer>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <IconStarMedium key={star} color="#FFCC00" />
                        ))}
                    </StarContainer>
                    <ScoredMenuContainer>
                        {scoredMenudummy.map((menu, index) => (
                            <React.Fragment key={menu}>
                                <ScoredMenu>
                                    {menu}
                                </ScoredMenu>
                                {index < scoredMenudummy.length - 1 && <MenuDivider />}
                            </React.Fragment>
                        ))}
                    </ScoredMenuContainer>
                </ScoreBox>
                <ReviewDate>
                    2025.03.24
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
                {dummyImages.map((image) => (
                    <ReviewImage src={image} />
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