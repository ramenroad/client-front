import type { ChangeEvent, MouseEvent, ReactNode } from 'react'
import type { RamenCalendarEntry } from '@/entities/ramen-calendar/model'
import { getTextMatchParts } from '@/shared/lib/text'
import { Button } from '@/shared/ui/button'
import { IconClose } from '@/shared/ui/icon'
import { BottomPopupLayout, Popup } from '@/shared/ui/popup'
import render from '@/shared/ui/render'
import { Toggle } from '@/shared/ui/toggle'
import { useRamenCalendarAddEntry, type RamenCalendarAddEntryInitialRamenya } from '../model/useRamenCalendarAddEntry'

type RamenCalendarAddEntryProps = {
  visitDate: string
  entry?: RamenCalendarEntry | null
  initialRamenya?: RamenCalendarAddEntryInitialRamenya
  createSuccessToastAction?: (visitDate: string) => ReactNode
  onClose: () => void
}

export const RamenCalendarAddEntry = ({
  visitDate,
  entry,
  initialRamenya,
  createSuccessToastAction,
  onClose,
}: RamenCalendarAddEntryProps) => {
  const {
    title,
    submitText,
    entryVisitDate,
    ramenyaName,
    menuInput,
    menuBadges,
    isPriceInputEnabled,
    priceInput,
    suggestions,
    showSuggestions,
    isRamenyaMatched,
    currentMenuQuery,
    menuSuggestions,
    showMenuSuggestions,
    errors,
    isSubmitting,
    handleVisitDateChange,
    handleNameChange,
    handleSelectResult,
    handleRamenyaInputFocusChange,
    handleMenuChange,
    handleSelectMenuSuggestion,
    handleRemoveMenuBadge,
    handleMenuInputKeyDown,
    handleMenuInputFocusChange,
    handlePriceInputEnabledChange,
    handlePriceChange,
    handleSubmit,
  } = useRamenCalendarAddEntry({ visitDate, entry, initialRamenya, createSuccessToastAction, onClose })

  return (
    <Popup isOpen direction="bottom" onClose={onClose}>
      <BottomPopupLayout>
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            <IconClose />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Field>
            <FieldLabel>방문 날짜</FieldLabel>
            <TextInput
              type="date"
              value={entryVisitDate}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleVisitDateChange(event.target.value)}
              data-error={errors.visitDate}
              // iOS/WebKit의 date 입력은 네이티브 크롬 때문에 h-44를 무시하고 세로로 커지고, intrinsic 너비로 다른 입력보다 넓어진다.
              // appearance-none으로 네이티브 크롬 제거, min-w-0으로 너비 넘침 방지, value 박스 기본 마진 제거로 높이 정상화.
              className="appearance-none min-w-0 [&::-webkit-date-and-time-value]:m-0 [&::-webkit-date-and-time-value]:text-left"
            />
            {errors.visitDate && <FieldError>날짜는 YYYY-MM-DD 형식으로 입력해주세요</FieldError>}
          </Field>

          <Field>
            <FieldLabel>가게</FieldLabel>
            <AutocompleteFieldWrapper>
              <TextInput
                value={ramenyaName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleNameChange(event.target.value)}
                onFocus={() => handleRamenyaInputFocusChange(true)}
                onBlur={() => handleRamenyaInputFocusChange(false)}
                placeholder="라멘집을 검색하거나 직접 입력하세요"
                data-error={errors.ramenyaName}
                data-matched={isRamenyaMatched}
                className="data-[matched=true]:font-bold data-[matched=true]:text-orange"
              />
              {showSuggestions && (
                <SuggestionList>
                  {suggestions.map((result) => (
                    <SuggestionRow
                      key={result._id}
                      type="button"
                      // 클릭(데스크톱)이 인풋 blur를 일으켜 리스트가 사라지면서 클릭이 씹히는 것 방지.
                      onMouseDown={(event: MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                      onClick={() => handleSelectResult(result)}
                    >
                      <SuggestionMatchText query={ramenyaName} target={result.name} />
                    </SuggestionRow>
                  ))}
                </SuggestionList>
              )}
            </AutocompleteFieldWrapper>
            {errors.ramenyaName && <FieldError>가게를 입력해주세요</FieldError>}
          </Field>

          <Field>
            <FieldLabel>메뉴</FieldLabel>
            <AutocompleteFieldWrapper>
              <MenuChipField>
                {menuBadges.map((badge, index) => (
                  <MenuBadge key={badge}>
                    {badge}
                    <MenuBadgeRemoveButton
                      type="button"
                      aria-label={`${badge} 삭제`}
                      onClick={() => handleRemoveMenuBadge(index)}
                    >
                      <IconClose width={8} height={8} color="var(--color-orange)" />
                    </MenuBadgeRemoveButton>
                  </MenuBadge>
                ))}
                <MenuChipInput
                  value={menuInput}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => handleMenuChange(event.target.value)}
                  onKeyDown={handleMenuInputKeyDown}
                  onFocus={() => handleMenuInputFocusChange(true)}
                  onBlur={() => handleMenuInputFocusChange(false)}
                  placeholder={menuBadges.length === 0 ? '메뉴를 입력하세요' : ''}
                />
              </MenuChipField>
              {showMenuSuggestions && (
                <MenuSuggestionList>
                  {menuSuggestions.map((menu) => (
                    <SuggestionRow
                      key={menu}
                      type="button"
                      // 클릭(데스크톱)이 인풋 blur를 일으켜 리스트가 사라지면서 클릭이 씹히는 것 방지.
                      onMouseDown={(event: MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                      onClick={() => handleSelectMenuSuggestion(menu)}
                    >
                      <SuggestionMatchText query={currentMenuQuery} target={menu} />
                    </SuggestionRow>
                  ))}
                </MenuSuggestionList>
              )}
            </AutocompleteFieldWrapper>
            <FieldCaption>엔터를 누르시면 메뉴를 2개 이상 넣으실 수 있어요</FieldCaption>
          </Field>

          <Field>
            <PriceHeader>
              <FieldLabel>가격 입력하기</FieldLabel>
              <Toggle checked={isPriceInputEnabled} onChange={handlePriceInputEnabledChange} />
            </PriceHeader>
            <FieldCaption>켜면 입력한 금액이 이번 달 지출 통계에 반영돼요.</FieldCaption>
            {isPriceInputEnabled && (
              <TextInput
                type="text"
                inputMode="numeric"
                value={priceInput}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handlePriceChange(event.target.value)}
                placeholder="가격을 입력하세요 (선택, 원)"
              />
            )}
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {submitText}
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

const Form = render.form('mt-20 flex flex-col gap-16')

const Field = render.div('flex flex-col gap-8')

const FieldLabel = render.span('font-14-m text-gray-900')

const PriceHeader = render.div('flex items-center justify-between')

const FieldCaption = render.span('font-12-r text-gray-500')

// 제안 텍스트에서 입력과 일치하는 구간만 주황색으로 강조(원문 순서 유지, 지도 검색과 동일한 시각 언어).
const SuggestionMatchText = ({ query, target }: { query: string; target: string }) => {
  const { before, match, after } = getTextMatchParts({ query, target })

  return (
    <span>
      {before}
      {match && <SuggestionMatchedPart>{match}</SuggestionMatchedPart>}
      {after}
    </span>
  )
}

const SuggestionMatchedPart = render.span('text-orange')

const AutocompleteFieldWrapper = render.div('relative flex flex-col')

const TextInput = render.input(
  'font-16-r box-border h-44 w-full rounded-8 border border-solid border-transparent bg-border px-12 py-10 text-black outline-none focus:border-orange data-[error=true]:border-red',
)

// TextInput과 같은 껍데기의 칩 필드 — 뱃지가 줄바꿈되며 쌓일 수 있게 고정 높이 대신 min-h + flex-wrap.
const MenuChipField = render.div(
  'box-border flex min-h-44 w-full flex-wrap items-center gap-6 rounded-8 border border-solid border-transparent bg-border px-12 py-6 focus-within:border-orange',
)

const MenuChipInput = render.input(
  'font-16-r h-32 min-w-96 flex-1 border-none bg-transparent p-0 text-black outline-none',
)

const MenuBadge = render.span(
  'inline-flex items-center gap-4 rounded-8 bg-light-orange px-8 py-4 font-14-m text-orange',
)

const MenuBadgeRemoveButton = render.button(
  'flex cursor-pointer items-center justify-center border-none bg-transparent p-0',
)

// top-[calc(100%+4px)]: 칩이 줄바꿈돼 필드가 높아져도 목록이 항상 필드 바로 아래 4px에 붙는다.
const suggestionListClassName =
  'absolute left-0 right-0 top-[calc(100%+4px)] z-10 overflow-y-auto rounded-8 border border-solid border-gray-100 bg-white shadow-lg'

const SuggestionList = render.div(`${suggestionListClassName} max-h-200`)

// 메뉴 제안은 3줄(행 45px) + 반 줄 높이로 잘라 스크롤 가능함이 보이게 하고, 나머지는 스크롤로 본다.
const MenuSuggestionList = render.div(`${suggestionListClassName} max-h-158`)

const SuggestionRow = render.button(
  'flex w-full cursor-pointer items-center border-none bg-white px-12 py-12 text-left font-14-r text-gray-900 outline-none',
)

const FieldError = render.span('font-12-r text-red')
