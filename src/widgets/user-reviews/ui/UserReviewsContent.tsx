import type { RefObject } from "react";
import { Line } from "@/shared/ui/line";
import { IconEmptyReview, IconLock } from "@/shared/ui/icon";
import { RaisingText } from "@/shared/ui/text";
import { Toggle } from "@/shared/ui/toggle";
import render from "@/shared/ui/render";
import { ReviewCard } from "@/widgets/review";
import { UserReviewProfileCard } from "./UserReviewProfileCard";
import { ReviewType, type UserReview } from "@/entities/review/model";

type ReviewItem = UserReview<ReviewType.MYPAGE> | UserReview<ReviewType.USER>;

interface UserReviewsContentProps {
  userMyPage?: {
    nickname: string;
    profileImageUrl: string;
    currentMonthReviewCount: number;
    avgReviewRating: number;
    reviewCount: number;
    isPublic: boolean;
  };
  reviews: ReviewItem[];
  isMine: boolean;
  isPrivate: boolean;
  observerRef: RefObject<HTMLDivElement>;
  onReviewVisibilityChange: (isPublic: boolean) => void;
  onNavigateHome: () => void;
}

export const UserReviewsContent = ({
  userMyPage,
  reviews,
  isMine,
  isPrivate,
  observerRef,
  onReviewVisibilityChange,
  onNavigateHome,
}: UserReviewsContentProps) => {
  return (
    <PageWrapper>
      <UserReviewProfileCard
        userName={userMyPage?.nickname ?? ""}
        profileImageUrl={userMyPage?.profileImageUrl ?? ""}
        monthlyReviewCount={userMyPage?.currentMonthReviewCount ?? 0}
        avgReviewRating={userMyPage?.avgReviewRating.toFixed(1) ?? "0.0"}
        reviewCount={userMyPage?.reviewCount ?? 0}
      />
      <BoldLine />
      <ReviewSummary>
        <ReviewSummaryHeader>
          <RaisingText size={18} weight="m">
            총 작성 리뷰 {userMyPage?.reviewCount ?? 0}개
          </RaisingText>
          <ReviewToggleWrapper>
            <ReviewToggleText size={12} weight="m">
              리뷰 {userMyPage?.isPublic ? "공개" : "비공개"}
            </ReviewToggleText>
            {isMine && (
              <Toggle
                checked={userMyPage?.isPublic ?? false}
                onChange={onReviewVisibilityChange}
                onText="ON"
                offText="OFF"
              />
            )}
          </ReviewToggleWrapper>
        </ReviewSummaryHeader>
      </ReviewSummary>
      <Line />

      {isPrivate ? (
        <UnavailableReviewOverlay>
          <IconLock />
          <PrivateReviewTitle size={16} weight="r">
            비공개 리뷰입니다
          </PrivateReviewTitle>
          <PrivateReviewDescription size={14} weight="r">
            다른 리뷰 보러 가보실래요?
          </PrivateReviewDescription>
          <RedirectButton onClick={onNavigateHome}>
            <RaisingText size={16} weight="m">
              메인 화면으로 이동
            </RaisingText>
          </RedirectButton>
        </UnavailableReviewOverlay>
      ) : reviews.length === 0 ? (
        <UnavailableReviewOverlay>
          <IconEmptyReview />
          <PrivateReviewTitle size={16} weight="r">
            등록된 리뷰가 없습니다
          </PrivateReviewTitle>
          <PrivateReviewDescription size={14} weight="r">
            방문하셨나요? 평가를 남겨보세요!
          </PrivateReviewDescription>
        </UnavailableReviewOverlay>
      ) : (
        <>
          {reviews.map((review) => (
            <ReviewItemWrapper key={review._id}>
              <ReviewCard review={review} editable={isMine} mypage={isMine} />
              <Line />
            </ReviewItemWrapper>
          ))}
          <ObserverTarget ref={observerRef} />
        </>
      )}
    </PageWrapper>
  );
};

const PageWrapper = render.section("flex flex-col box-border w-full");

const ReviewSummary = render.section("px-20 pb-20 pt-24");

const ReviewSummaryHeader = render.section("flex flex-row justify-between items-center");

const ReviewToggleWrapper = render.section("flex flex-row gap-4 items-center");

const ReviewToggleText = render.extend(RaisingText, "text-filter-text");

const BoldLine = render.extend(Line, "h-8");

const PrivateReviewTitle = render.extend(RaisingText, "text-black mt-8");

const PrivateReviewDescription = render.extend(RaisingText, "text-gray-70 mt-4");

const UnavailableReviewOverlay = render.section("flex flex-col items-center justify-center h-450");

const RedirectButton = render.button(
  "w-176 h-44 bg-bright-orange rounded-[100px] text-orange border-none cursor-pointer mt-16",
);

const ReviewItemWrapper = render.section("");

const ObserverTarget = render.div("");
