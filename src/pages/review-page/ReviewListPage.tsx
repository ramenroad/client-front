import TopBar from '../../components/common/TopBar'
import { ReviewCard } from '../detail-page/ReviewCard'
import tw from 'twin.macro'

import { useParams } from 'react-router-dom'
import { useRamenyaDetailQuery } from '../../hooks/queries/useRamenyaDetailQuery'

export const ReviewListPage = () => {
    const { id } = useParams();
    const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
    const reviews = ramenyaDetailQuery.data?.reviews;
    return (
        <Wrapper>
            <TopBar
                title="리뷰 목록"
            />
            <Container>
                <ReviewListTitle>고객 리뷰</ReviewListTitle>
                <ReviewListContainer>
                    {reviews?.map((review) => (
                        <>
                            <ReviewCard review={review} />
                            <ReviewDivider />
                        </>
                    ))}
                </ReviewListContainer>
            </Container>
        </Wrapper>
    )
}

const Wrapper = tw.div`
    flex flex-col pb-40 w-full

`;

const Container = tw.div`
    flex flex-col px-20
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


