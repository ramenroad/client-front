import { Fragment } from 'react'
import { Line } from '@/shared/ui/line'
import { LoadingLottie } from '@/shared/ui/lottie'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { ReviewCard } from '@/widgets/review'
import { useReviewListPage } from '../model/useReviewListPage'

const ReviewListPage = () => {
  const { reviews, myUserId, observerRef, isLoading, isError } = useReviewListPage()

  return (
    <Wrapper variant="appBar">
      <TopBar title="리뷰 목록" />
      <Container>
        <ReviewListTitle>고객 리뷰</ReviewListTitle>
        {isLoading && (
          <StateWrapper>
            <LoadingLottie />
            <StateText size={16} weight="m">
              리뷰를 불러오는 중이에요
            </StateText>
          </StateWrapper>
        )}
        {isError && (
          <StateWrapper>
            <StateText size={16} weight="m">
              리뷰를 불러오지 못했어요.
            </StateText>
          </StateWrapper>
        )}
        {!isLoading && !isError && reviews.length === 0 && (
          <StateWrapper>
            <StateText size={16} weight="m">
              등록된 리뷰가 없습니다.
            </StateText>
          </StateWrapper>
        )}
        {!isLoading && !isError && reviews.length > 0 && (
          <ReviewListContainer>
            {reviews.map((review) => (
              <Fragment key={review._id}>
                <ReviewCard review={review} editable={review.userId?._id === myUserId} />
                <Line />
              </Fragment>
            ))}
          </ReviewListContainer>
        )}
        <ObserverTarget ref={observerRef} />
      </Container>
    </Wrapper>
  )
}

const Wrapper = render.extend(PageLayout, 'pb-20')

const Container = render.div('flex flex-col')

const ReviewListTitle = render.div('mb-[-4px] mt-20 px-20 font-18-sb text-black')

const ReviewListContainer = render.div('flex flex-col')

const ObserverTarget = render.div('h-1')

const StateWrapper = render.section('flex min-h-260 flex-col items-center justify-center gap-12 px-20 text-center')

const StateText = render.extend(RaisingText, 'text-gray-500')

export default ReviewListPage
