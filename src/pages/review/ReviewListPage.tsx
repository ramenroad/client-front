import TopBar from "@/shared/ui/top-bar";
import { useParams } from "react-router-dom";
import { useRamenyaReviewQuery } from "@/entities/review/model";
import ReviewCard from "@/entities/review/ui";
import { Line } from "@/shared/ui/line";
import { useUserInformationQuery } from "@/entities/viewer/model";
import { useIntersectionObserver } from "@/shared/lib/use-intersection-observer";
import render from "@/shared/ui/render";

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

const Wrapper = render.div("flex flex-col w-full pb-20");

const Container = render.div("flex flex-col");

const ReviewListTitle = render.div("font-18-sb text-black px-20 mt-20 mb-[-4]");

const ReviewListContainer = render.div("flex flex-col");
