import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useRamenyaReviewQuery } from "@/entities/review/model";
import { useUserInformationQuery } from "@/entities/viewer/model";
import { useIntersectionObserver } from "@/shared/lib/use-intersection-observer";
import { Line } from "@/shared/ui/line";
import TopBar from "@/shared/ui/top-bar";
import render from "@/shared/ui/render";
import { ReviewCard } from "@/widgets/review";

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
          {reviews.map((review) => (
            <Fragment key={review._id}>
              <ReviewCard review={review} editable={review.userId?._id === userInformationQuery.data?._id} />
              <Line />
            </Fragment>
          ))}
        </ReviewListContainer>
        <ObserverTarget ref={ref} />
      </Container>
    </Wrapper>
  );
};

const Wrapper = render.div("flex w-full flex-col pb-20");

const Container = render.div("flex flex-col");

const ReviewListTitle = render.div("mt-20 mb-[-4] px-20 font-18-sb text-black");

const ReviewListContainer = render.div("flex flex-col");

const ObserverTarget = render.div("");
