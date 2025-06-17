import tw from "twin.macro";
import { RamenroadText } from "../../components/common/RamenroadText";
import TopBar from "../../components/common/TopBar";
import { useMyReviewQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import { Line } from "../../components/common/Line";
import { MyReviewCard } from "../../components/review/MyReviewCard";
import { useParams } from "react-router-dom";
import { useIntersectionObserver } from "../../hooks/common/useIntersectionObserver";

const UserReviewPage = () => {
  const { id: userId } = useParams();
  const { userReviewQuery } = useMyReviewQuery(userId);
  const ref = useIntersectionObserver({
    onIntersect: userReviewQuery.fetchNextPage,
  });

  return (
    <>
      <TopBar title="작성한 리뷰" />
      <PageWrapper>
        <ReviewResultWrapper>
          <RamenroadText size={18} weight="m">
            총 작성 리뷰 {userReviewQuery.data?.pages[0].reviewCount}개
          </RamenroadText>
        </ReviewResultWrapper>
        <Line />
        {userReviewQuery.data?.pages.map((page) =>
          page.reviews.map((review) => <MyReviewCard key={review._id} review={review} />),
        )}
        <div ref={ref} />
      </PageWrapper>
    </>
  );
};

const PageWrapper = tw.section`
  flex flex-col
  box-border w-full
`;

const ReviewResultWrapper = tw.section`
  p-20
`;

export default UserReviewPage;
