import { type ChangeEvent } from 'react'
import render from '@/shared/ui/render'

interface ReviewTextSectionProps {
  review: string
  minLength: number
  maxLength?: number
  hasError?: boolean
  onReviewChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export const ReviewTextSection = ({
  review,
  minLength,
  maxLength = 1000,
  hasError = false,
  onReviewChange,
}: ReviewTextSectionProps) => {
  return (
    <Section>
      <Title>어떤 점이 좋았나요?</Title>
      <TextAreaContainer>
        <ReviewTextArea
          value={review}
          placeholder={`최소 ${minLength}자 이상 입력해주세요`}
          maxLength={maxLength}
          onChange={onReviewChange}
        />
        <CharacterCount>
          <TypedCount>{review.length}</TypedCount>/{maxLength}
        </CharacterCount>
      </TextAreaContainer>
      {hasError && <ErrorMessage>최소 {minLength}자 이상 입력해주세요</ErrorMessage>}
    </Section>
  )
}

const Section = render.div('relative mt-36 flex flex-col gap-16')

const Title = render.div('font-16-m text-black')

const TextAreaContainer = render.div(
  'relative box-border flex flex-col gap-4 rounded-[8px] border border-solid border-transparent bg-border px-12 pb-36 pt-10 outline-none focus-within:border-orange',
)

const ReviewTextArea = render.textarea(
  'font-16-r h-214 w-full resize-none border-none bg-transparent font-pretendard text-black outline-none scrollbar-thin',
)

const CharacterCount = render.div('absolute bottom-14 right-12 font-14-r text-gray-400')

const TypedCount = render.span('font-14-r text-black')

const ErrorMessage = render.div('font-12-r text-red')
