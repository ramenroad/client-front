import tw from "twin.macro";
import { RamenroadText } from "../../components/common/RamenroadText";
import TopBar from "../../components/common/TopBar";
import { useMyReviewQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import { Line } from "../../components/common/Line";
import { MyReviewCard } from "../../components/review/MyReviewCard";

const MyReviewPage = () => {
  const { myReviewQuery } = useMyReviewQuery();

  return (
    <>
      <TopBar title="작성한 리뷰" />
      <PageWrapper>
        <ReviewResultWrapper>
          <RamenroadText size={18} weight="m">
            총 작성 리뷰 {myReviewQuery.data?.length}개
          </RamenroadText>
        </ReviewResultWrapper>
        <Line />
        {myReviewQuery.data?.map((review) => <MyReviewCard key={review._id} review={review} />)}
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

export default MyReviewPage;
