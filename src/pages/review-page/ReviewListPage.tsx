import TopBar from '../../components/common/TopBar'
import { ReviewCard } from '../detail-page/ReviewCard'
import tw from 'twin.macro'

export const ReviewListPage = () => {
    return (
        <Wrapper>
            <TopBar
                title="리뷰 목록"
            />
            <ReviewListTitle>고객 리뷰</ReviewListTitle>
            <ReviewListContainer>
                <ReviewCard />
                <ReviewDivider />
                <ReviewCard />
                <ReviewDivider />
                <ReviewCard />
            </ReviewListContainer>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col px-20 pb-40
`;

const ReviewListTitle = tw.div`
    font-18-sb text-black
    mt-20 mb-12
`;

const ReviewListContainer = tw.div`
    flex flex-col gap-20
`;

const ReviewDivider = tw.div`
    w-full h-1 bg-divider
`;


