import TopBar from "../../components/top-bar";
import tw from "twin.macro";
import { useParams } from "react-router-dom";
import { useRamenyaReviewQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import ReviewCard from "../../components/review/ReviewCard";
import { Line } from "../../components/common/Line";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { useIntersectionObserver } from "../../hooks/common/useIntersectionObserver";

export const ReviewListPage = () => {
  const { id } = useParams();
  const { ramenyaReviewQuery } = useRamenyaReviewQuery(id!);
  const { userInformationQuery } = useUserInformationQuery();

  const ref = useIntersectionObserver({
    onIntersect: ramenyaReviewQuery.fetchNextPage,
  });

  const reviews = ramenyaReviewQuery.data?.pages.flatMap((page) => page.reviews) || [];

  return (
    <Wrapper>
      <TopBar title="리뷰 목록" />
      <Container>
        <ReviewListTitle>고객 리뷰</ReviewListTitle>
        <ReviewListContainer>
          {reviews?.map((review) => (
            <>
              <ReviewCard
                review={review}
                editable={review.userId?._id === userInformationQuery.data?._id}
                mypage={false}
              />
              <Line />
            </>
          ))}
        </ReviewListContainer>
        <div ref={ref} />
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col w-full pb-20
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
