import type { ChangeEvent } from 'react'
import { Button } from '@/shared/ui/button'
import { IconClose } from '@/shared/ui/icon'
import { BottomPopupLayout, Popup } from '@/shared/ui/popup'
import render from '@/shared/ui/render'
import { useRamenCalendarAddEntry } from '../model/useRamenCalendarAddEntry'

type RamenCalendarAddEntryProps = {
  visitDate: string
  onClose: () => void
}

export const RamenCalendarAddEntry = ({ visitDate, onClose }: RamenCalendarAddEntryProps) => {
  const {
    ramenyaName,
    menuInput,
    suggestions,
    showSuggestions,
    errors,
    isSubmitting,
    handleNameChange,
    handleSelectResult,
    handleMenuChange,
    handleSubmit,
  } = useRamenCalendarAddEntry({ visitDate, onClose })

  return (
    <Popup isOpen direction="bottom" onClose={onClose}>
      <BottomPopupLayout>
        <Header>
          <Title>라멘 기록 추가</Title>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            <IconClose />
          </CloseButton>
        </Header>

        <DateText>{visitDate}</DateText>

        <Form onSubmit={handleSubmit}>
          <Field>
            <FieldLabel>가게</FieldLabel>
            <ShopInputWrapper>
              <TextInput
                value={ramenyaName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleNameChange(event.target.value)}
                placeholder="라멘집을 검색하거나 직접 입력하세요"
                data-error={errors.ramenyaName}
              />
              {showSuggestions && (
                <SuggestionList>
                  {suggestions.map((result) => (
                    <SuggestionRow key={result._id} type="button" onClick={() => handleSelectResult(result)}>
                      {result.name}
                    </SuggestionRow>
                  ))}
                </SuggestionList>
              )}
            </ShopInputWrapper>
            {errors.ramenyaName && <FieldError>가게를 입력해주세요</FieldError>}
          </Field>

          <Field>
            <FieldLabel>메뉴</FieldLabel>
            <TextInput
              value={menuInput}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleMenuChange(event.target.value)}
              placeholder="쉼표로 구분 (예: 돈코츠라멘, 츠케멘)"
            />
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            추가하기
          </Button>
        </Form>
      </BottomPopupLayout>
    </Popup>
  )
}

const Header = render.div('flex items-center justify-between')

const Title = render.h2('font-18-sb text-gray-900')

const CloseButton = render.button(
  'flex h-24 w-24 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none',
)

const DateText = render.span('mt-4 font-14-r text-gray-500')

const Form = render.form('mt-20 flex flex-col gap-16')

const Field = render.div('flex flex-col gap-8')

const FieldLabel = render.span('font-14-m text-gray-900')

const ShopInputWrapper = render.div('relative flex flex-col')

const TextInput = render.input(
  'font-16-r box-border h-44 w-full rounded-8 border border-solid border-transparent bg-border px-12 py-10 text-black outline-none focus:border-orange data-[error=true]:border-red',
)

const SuggestionList = render.div(
  'absolute left-0 right-0 top-48 z-10 max-h-200 overflow-y-auto rounded-8 border border-solid border-gray-100 bg-white shadow-lg',
)

const SuggestionRow = render.button(
  'flex w-full cursor-pointer items-center border-none bg-white px-12 py-12 text-left font-14-r text-gray-900 outline-none',
)

const FieldError = render.span('font-12-r text-red')
