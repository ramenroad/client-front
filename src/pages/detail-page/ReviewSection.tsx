import { useNavigate } from "react-router-dom";
import { IconStar, IconArrowRight } from "../../components/Icon";
import tw from "twin.macro";
import emptyReview from "../../assets/images/empty-review.png";
import ReviewCard from "../../components/review/ReviewCard";
import { Line } from "../../components/common/Line";
import { UserReview } from "../../types/review";

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

        {!isSignIn && <LoginButton onClick={() => navigate("/login")}>로그인하기</LoginButton>}
      </ReviewHeader>
      <ReviewDivider />

      <ReviewContent>
        <ReviewContentTitle>고객 리뷰</ReviewContentTitle>
        {ramenyaReviewData?.pages.flatMap((page) => page.reviews)?.length === 0 ? (
          <EmptyReviewContainer>
            <EmptyReviewImage src={emptyReview} />
            <EmptyReviewTitle>등록된 리뷰가 없습니다.</EmptyReviewTitle>
            <EmptyReviewText>방문하셨나요? 평가를 남겨보세요!</EmptyReviewText>
            <CreateReviewButton onClick={() => onNavigateReviewCreatePage()}>리뷰 작성하기</CreateReviewButton>
          </EmptyReviewContainer>
        ) : (
          <>
            <ReviewCardContainer>
              {ramenyaReviewData?.pages
                .flatMap((page) => page.reviews)
                ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map((review: UserReview) => (
                  <>
                    <ReviewCard
                      key={review._id}
                      review={review}
                      editable={userInformation?._id === review.userId?._id}
                    />
                    <Line />
                  </>
                ))}
            </ReviewCardContainer>
            <AllReviewButtonWrapper>
              <AllReviewButton onClick={() => navigate(`/review/list/${ramenyaId}`)}>
                <span>모든 리뷰 보기</span>
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
const ReviewWrapper = tw.div`
  flex flex-col
  py-32
`;

const ReviewHeader = tw.div`
  flex flex-col gap-10 items-center
  px-20
  mb-32
`;

const ReviewHeaderTitle = tw.div`
  font-18-r text-black
  flex items-center
`;

const ReviewerName = tw.span`
  text-orange
`;

const LargeStarContainer = tw.div`
  flex gap-2 items-center
  cursor-pointer
`;

const LoginButton = tw.div`
  mt-16
  flex w-fit py-10 px-32
  box-border
  justify-center items-center
  font-16-m
  bg-brightOrange rounded-100 gap-2
  cursor-pointer
  text-orange
`;

const ReviewDivider = tw.div`
  w-full h-1 bg-divider
`;

const ReviewContent = tw.div`
  flex flex-col
`;

const ReviewContentTitle = tw.div`
  font-18-sb text-black pl-20 pt-20
`;

const EmptyReviewContainer = tw.div`
  flex flex-col items-center justify-center
`;

const EmptyReviewImage = tw.img`
  w-80
  pb-8
`;

const EmptyReviewTitle = tw.div`
  font-16-r text-black pb-4
`;

const EmptyReviewText = tw.span`
  font-14-r text-gray-700
`;

const CreateReviewButton = tw.div`
  mt-16
  flex w-fit py-10 px-32
  box-border
  justify-center items-center
  font-16-m
  bg-brightOrange rounded-100 gap-2
  cursor-pointer
  text-orange
`;

const ReviewCardContainer = tw.div`
  flex flex-col
`;

const AllReviewButtonWrapper = tw.div`
  px-20
`;

const AllReviewButton = tw.div`
  mt-10
  flex w-full py-10
  box-border
  justify-center items-center
  font-14-m text-black
  bg-border rounded-8 gap-2
  cursor-pointer
`;
