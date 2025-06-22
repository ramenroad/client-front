import TopBar from "../../components/common/TopBar";
import tw from "twin.macro";
import { useParams } from "react-router-dom";
import { useRamenyaReviewQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import { UserReviewCard } from "../../components/review/UserReviewCard";
import { Line } from "../../components/common/Line";

export const ReviewListPage = () => {
  const { id } = useParams();
  const ramenyaReviewQuery = useRamenyaReviewQuery(id!);
  const reviews = ramenyaReviewQuery.data?.reviews;

  return (
    <Wrapper>
      <TopBar title="리뷰 목록" />
      <Container>
        <ReviewListTitle>고객 리뷰</ReviewListTitle>
        <ReviewListContainer>
          {reviews?.map((review) => (
            <>
              <UserReviewCard review={review} editable={false} />
              <Line />
            </>
          ))}
        </ReviewListContainer>
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col pb-40 w-full
`;

const Container = tw.div`
  flex flex-col
`;

const ReviewListTitle = tw.div`
    font-18-sb text-black
    px-20 mt-20 mb-[-4]
`;

const ReviewListContainer = tw.div`
  flex flex-col
`;
