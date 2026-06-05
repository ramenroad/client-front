import type { RefObject } from 'react'
import type { MyReview, UserReview } from '@/entities/review/model'
import { IconEmptyReview, IconLock } from '@/shared/ui/icon'
import { Line } from '@/shared/ui/line'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import { Toggle } from '@/shared/ui/toggle'
import { ReviewCard } from '@/widgets/review'
import { UserReviewProfileCard } from './UserReviewProfileCard'

type ReviewItem = MyReview | UserReview

interface UserReviewsContentProps {
  userInfo?: {
    nickname: string
    profileImageUrl: string
    currentMonthReviewCount: number
    avgReviewRating: number
    reviewCount: number
    isPublic: boolean
  }
  reviews: ReviewItem[]
  isMine: boolean
  isPrivate: boolean
  isLoading: boolean
  observerRef: RefObject<HTMLDivElement | null>
  onReviewVisibilityChange: (isPublic: boolean) => void
  onNavigateHome: () => void
}

export const UserReviewsContent = ({
  userInfo,
  reviews,
  isMine,
  isPrivate,
  isLoading,
  observerRef,
  onReviewVisibilityChange,
  onNavigateHome,
}: UserReviewsContentProps) => {
  return (
    <PageWrapper>
      <UserReviewProfileCard
        userName={userInfo?.nickname ?? ''}
        profileImageUrl={userInfo?.profileImageUrl ?? ''}
        monthlyReviewCount={userInfo?.currentMonthReviewCount ?? 0}
        avgReviewRating={userInfo?.avgReviewRating.toFixed(1) ?? '0.0'}
        reviewCount={userInfo?.reviewCount ?? 0}
      />
      <BoldLine />
      <ReviewSummary>
        <ReviewSummaryHeader>
          <RaisingText size={18} weight="m">
            총 작성 리뷰 {userInfo?.reviewCount ?? 0}개
          </RaisingText>
          <ReviewToggleWrapper>
            <ReviewToggleText size={12} weight="m">
              리뷰 {userInfo?.isPublic ? '공개' : '비공개'}
            </ReviewToggleText>
            {isMine && (
              <Toggle
                checked={userInfo?.isPublic ?? false}
                onChange={onReviewVisibilityChange}
                onText="ON"
                offText="OFF"
              />
            )}
          </ReviewToggleWrapper>
        </ReviewSummaryHeader>
      </ReviewSummary>
      <Line />

      {isLoading ? (
        <UnavailableReviewOverlay>
          <PrivateReviewTitle size={16} weight="r">
            리뷰를 불러오는 중이에요
          </PrivateReviewTitle>
        </UnavailableReviewOverlay>
      ) : isPrivate ? (
        <UnavailableReviewOverlay>
          <IconLock />
          <PrivateReviewTitle size={16} weight="r">
            비공개 리뷰입니다
          </PrivateReviewTitle>
          <PrivateReviewDescription size={14} weight="r">
            다른 리뷰 보러 가보실래요?
          </PrivateReviewDescription>
          <RedirectButton type="button" onClick={onNavigateHome}>
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
        <ReviewListWrapper>
          {reviews.map((review) => (
            <ReviewItemWrapper key={review._id}>
              <ReviewCard review={review} editable={isMine} mypage />
              <Line />
            </ReviewItemWrapper>
          ))}
          <ObserverTarget ref={observerRef} />
        </ReviewListWrapper>
      )}
    </PageWrapper>
  )
}

const PageWrapper = render.section('box-border flex w-full flex-col')

const ReviewSummary = render.section('px-20 pb-20 pt-24')

const ReviewSummaryHeader = render.section('flex flex-row items-center justify-between')

const ReviewToggleWrapper = render.section('flex flex-row items-center gap-4')

const ReviewToggleText = render.extend(RaisingText, 'text-filter-text')

const BoldLine = render.extend(Line, 'h-8')

const PrivateReviewTitle = render.extend(RaisingText, 'mt-8 text-black')

const PrivateReviewDescription = render.extend(RaisingText, 'mt-4 text-gray-70')

const UnavailableReviewOverlay = render.section('flex h-450 flex-col items-center justify-center')

const RedirectButton = render.button('mt-16 h-44 w-176 cursor-pointer rounded-full border-none bg-bright-orange text-orange')

const ReviewListWrapper = render.div('flex flex-col')

const ReviewItemWrapper = render.section('')

const ObserverTarget = render.div('h-1')
