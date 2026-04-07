import { useNavigate } from "react-router-dom";
import { IconStar, IconArrowRight } from "@/shared/ui/icon";
import emptyReview from "@/assets/images/empty-review.png";
import { Line } from "@/shared/ui/line";
import { UserReview } from "@/entities/review/model";
import render from "@/shared/ui/render";
import { ReviewCard } from "@/widgets/review";

interface ReviewSectionProps {
  userInformation: { _id: string; nickname: string; email: string; profileImageUrl?: string } | undefined;
  isSignIn: boolean;
  selectedRating: number;
  onStarClick: (rating: number) => void;
  ramenyaReviewData:
    | {
        pages: {
          reviews: UserReview[];
        }[];
      }
    | undefined;
  onNavigateReviewCreatePage: (rating?: number) => void;
  ramenyaId: string;
}

export const ReviewSection = ({
  userInformation,
  isSignIn,
  selectedRating,
  onStarClick,
  ramenyaReviewData,
  onNavigateReviewCreatePage,
  ramenyaId,
}: ReviewSectionProps) => {
  const navigate = useNavigate();
  const reviews = ramenyaReviewData?.pages.flatMap((page) => page.reviews) ?? [];
  const topReviews = reviews
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const isReviewEmpty = reviews.length === 0;

  return (
    <ReviewWrapper>
      <ReviewHeader>
        <ReviewHeaderTitle>
          <ReviewerName>{userInformation?.nickname}</ReviewerName>
          {isSignIn ? "님 리뷰를 남겨주세요" : "로그인 후 리뷰를 남겨주세요"}
        </ReviewHeaderTitle>

        <LargeStarContainer>
          {[...Array(5)].map((_, i) => (
            <IconStar key={i} inactive={i >= selectedRating} onClick={() => onStarClick(i + 1)} size={36} />
          ))}
        </LargeStarContainer>

        {!isSignIn && (
          <LoginButton type="button" onClick={() => navigate("/login")}>
            로그인하기
          </LoginButton>
        )}
      </ReviewHeader>
      <ReviewDivider />

      <ReviewContent>
        <ReviewContentTitle>고객 리뷰</ReviewContentTitle>
        {isReviewEmpty ? (
          <EmptyReviewContainer>
            <EmptyReviewImage src={emptyReview} />
            <EmptyReviewTitle>등록된 리뷰가 없습니다.</EmptyReviewTitle>
            <EmptyReviewText>방문하셨나요? 평가를 남겨보세요!</EmptyReviewText>
            <CreateReviewButton type="button" onClick={() => onNavigateReviewCreatePage()}>
              리뷰 작성하기
            </CreateReviewButton>
          </EmptyReviewContainer>
        ) : (
          <>
            <ReviewCardContainer>
              {topReviews.map((review: UserReview, index) => (
                <ReviewListItem key={review._id}>
                  <ReviewCard review={review} editable={userInformation?._id === review.userId?._id} />
                  {index < topReviews.length - 1 && <Line />}
                </ReviewListItem>
              ))}
            </ReviewCardContainer>
            <AllReviewButtonWrapper>
              <AllReviewButton type="button" onClick={() => navigate(`/review/list/${ramenyaId}`)}>
                <ButtonText>모든 리뷰 보기</ButtonText>
                <IconArrowRight />
              </AllReviewButton>
            </AllReviewButtonWrapper>
          </>
        )}
      </ReviewContent>
    </ReviewWrapper>
  );
};

// 스타일 컴포넌트들
const ReviewWrapper = render.div("flex flex-col py-32");

const ReviewHeader = render.div("flex flex-col gap-10 items-center px-20 mb-32");

const ReviewHeaderTitle = render.div("font-18-r text-black flex items-center");

const ReviewerName = render.span("text-orange");

const LargeStarContainer = render.div("flex gap-2 items-center cursor-pointer");

const LoginButton = render.button(
  "mt-16 flex w-fit items-center justify-center gap-2 rounded-[100px] bg-bright-orange px-32 py-10 font-16-m text-orange cursor-pointer border-none shadow-none outline-none",
);

const ReviewDivider = render.div("w-full h-1 bg-divider");

const ReviewContent = render.div("flex flex-col");

const ReviewContentTitle = render.div("font-18-sb text-black pl-20 pt-20");

const EmptyReviewContainer = render.div("flex flex-col items-center justify-center");

const EmptyReviewImage = render.img("w-80 pb-8");

const EmptyReviewTitle = render.div("font-16-r text-black pb-4");

const EmptyReviewText = render.span("font-14-r text-gray-700");

const CreateReviewButton = render.button(
  "mt-16 flex w-fit items-center justify-center gap-2 rounded-[100px] bg-bright-orange px-32 py-10 font-16-m text-orange cursor-pointer border-none shadow-none outline-none",
);

const ReviewCardContainer = render.div("flex flex-col");

const ReviewListItem = render.div("flex flex-col");

const AllReviewButtonWrapper = render.div("px-20");

const AllReviewButton = render.button(
  "mt-10 flex w-full items-center justify-center gap-2 rounded-[8px] bg-border py-10 font-14-m text-black cursor-pointer border-none shadow-none outline-none",
);

const ButtonText = render.span("text-inherit");
