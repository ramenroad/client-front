import type { MouseEvent } from 'react'
import type { RamenCalendarEntry } from '@/entities/ramen-calendar/model'
import { RamenCalendarAddEntry } from '@/features/ramen-calendar-add-entry'
import { Button } from '@/shared/ui/button'
import { IconArrowRight, IconEdit, IconRamenCalendar, IconTrash } from '@/shared/ui/icon'
import { LoadingLottie } from '@/shared/ui/lottie'
import { PageLayout } from '@/shared/ui/page-layout'
import { Popup, PopupConfirm } from '@/shared/ui/popup'
import render from '@/shared/ui/render'
import TopBar from '@/shared/ui/top-bar'
import { useMyCalendarPage } from '../model/useMyCalendarPage'

const MyCalendarPage = () => {
  const {
    monthLabel,
    selectedDateLabel,
    weekdayLabels,
    days,
    isSignIn,
    selectedEntries,
    monthlyBowlCount,
    monthlyTotalPriceLabel,
    editingEntry,
    selectedVisitDate,
    isLoading,
    isError,
    isDeleting,
    isDeleteConfirmOpen,
    isAddOpen,
    onPrevMonth,
    onNextMonth,
    onDateClick,
    onEntryClick,
    onBack,
    onLoginClick,
    onEditEntry,
    onCloseEdit,
    onDeleteEntry,
    onCloseDeleteConfirm,
    onConfirmDeleteEntry,
    openAdd,
    closeAdd,
  } = useMyCalendarPage()

  return (
    <Layout variant="appBar">
      <TopBar title="라멘 캘린더" onBackClick={onBack} />
      <Content>
        <MonthHeader>
          <MonthButton type="button" onClick={onPrevMonth} aria-label="이전 달">
            <PrevMonthIcon />
          </MonthButton>
          <MonthTitle>{monthLabel}</MonthTitle>
          <MonthButton type="button" onClick={onNextMonth} aria-label="다음 달">
            <NextMonthIcon />
          </MonthButton>
        </MonthHeader>
        <CalendarBoard>
          <WeekdayRow>
            {weekdayLabels.map((weekday, index) => (
              <WeekdayLabel key={weekday} data-sunday={index === weekdayLabels.length - 1}>
                {weekday}
              </WeekdayLabel>
            ))}
          </WeekdayRow>
          <DayGrid>
            {days.map((day) => (
              <DayButton
                key={day.key}
                type="button"
                data-current-month={day.isCurrentMonth}
                data-selected={day.isSelected}
                data-sunday={day.isSunday}
                onClick={() => onDateClick(day.date)}
                aria-label={`${day.label}일 선택`}
              >
                <DateNumber data-selected={day.isSelected}>{day.label}</DateNumber>
                <RecordDot data-visible={day.hasRecord} />
              </DayButton>
            ))}
          </DayGrid>
        </CalendarBoard>

        <BottomSection>
          {!isSignIn ? (
            <SignInPrompt>
              <SignInText>로그인 후 이용할 수 있어요.</SignInText>
              <Button onClick={onLoginClick}>로그인/회원가입</Button>
            </SignInPrompt>
          ) : (
            <>
              {isLoading ? (
                <StateWrapper>
                  <LoadingLottie />
                </StateWrapper>
              ) : isError ? (
                <StateWrapper>
                  <StateText>기록을 불러오지 못했어요.</StateText>
                </StateWrapper>
              ) : selectedEntries.length > 0 ? (
                <EntryList>
                  {selectedEntries.map((entry) => (
                    <CalendarEntryCard
                      key={entry._id}
                      entry={entry}
                      isDeleting={isDeleting}
                      onClick={onEntryClick}
                      onEdit={onEditEntry}
                      onDelete={onDeleteEntry}
                    />
                  ))}
                </EntryList>
              ) : (
                <EmptyState>
                  <EmptyIcon>
                    <IconRamenCalendar width={32} height={32} />
                  </EmptyIcon>
                  <EmptyTitle>{selectedDateLabel} 기록이 없어요.</EmptyTitle>
                  <EmptyDescription>라멘 기록이 생기면 캘린더에서 모아볼 수 있어요.</EmptyDescription>
                </EmptyState>
              )}
            </>
          )}
        </BottomSection>

        <MonthlyStats>
          {!isSignIn ? (
            <StatsNotice>로그인하면 이번 달 기록을 볼 수 있어요</StatsNotice>
          ) : isLoading ? (
            <StatsNotice>이번 달 기록을 불러오는 중이에요</StatsNotice>
          ) : (
            <>
              <StatItem>
                <StatLabel>이번 달 먹은 라멘</StatLabel>
                <StatValue>{monthlyBowlCount}그릇</StatValue>
              </StatItem>
              <StatDivider />
              <StatItem>
                <StatLabel>이번 달 쓴 금액</StatLabel>
                <StatValue>{monthlyTotalPriceLabel}원</StatValue>
              </StatItem>
            </>
          )}
        </MonthlyStats>
      </Content>

      {isSignIn && (
        <FloatingAddButton type="button" onClick={openAdd} aria-label="라멘 기록 추가">
          <FloatingAddText>+</FloatingAddText>
        </FloatingAddButton>
      )}
      {isAddOpen && <RamenCalendarAddEntry visitDate={selectedVisitDate} onClose={closeAdd} />}
      {editingEntry && <RamenCalendarAddEntry visitDate={editingEntry.visitDate} entry={editingEntry} onClose={onCloseEdit} />}
      <Popup isOpen={isDeleteConfirmOpen} onClose={onCloseDeleteConfirm} direction="center">
        <PopupConfirm
          content={
            <ConfirmBody>
              <ConfirmTitle>라멘 기록 삭제</ConfirmTitle>
              <ConfirmMessage>정말 삭제하시겠어요?</ConfirmMessage>
            </ConfirmBody>
          }
          confirmText="삭제"
          onClose={onCloseDeleteConfirm}
          onConfirm={onConfirmDeleteEntry}
        />
      </Popup>
    </Layout>
  )
}

type CalendarEntryCardProps = {
  entry: RamenCalendarEntry
  isDeleting: boolean
  onClick: (entry: RamenCalendarEntry) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const CalendarEntryCard = ({ entry, isDeleting, onClick, onEdit, onDelete }: CalendarEntryCardProps) => {
  const isClickable = Boolean(entry.ramenyaId)

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onEdit(entry._id)
  }

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onDelete(entry._id)
  }

  const handleNameClick = () => {
    onClick(entry)
  }

  return (
    <EntryRow>
      <EntryInfo>
        {isClickable ? (
          <EntryNameButton type="button" onClick={handleNameClick} aria-label={`${entry.ramenyaName} 상세 페이지로 이동`}>
            {entry.ramenyaName}
          </EntryNameButton>
        ) : (
          <EntryName>{entry.ramenyaName}</EntryName>
        )}
        {entry.menus.length > 0 && <EntryMenus>{entry.menus.join(', ')}</EntryMenus>}
        {entry.price != null && <EntryPrice>{entry.price.toLocaleString('ko-KR')}원</EntryPrice>}
      </EntryInfo>
      <EntryActions>
        <EntryActionButton type="button" onClick={handleEditClick} aria-label="기록 수정">
          <IconEdit />
        </EntryActionButton>
        <EntryActionButton
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          aria-label="기록 삭제"
        >
          <IconTrash />
        </EntryActionButton>
      </EntryActions>
    </EntryRow>
  )
}

const Layout = render.extend(PageLayout, 'pb-40')

const Content = render.section('flex w-full flex-col px-20')

const MonthHeader = render.section('mt-12 grid h-44 grid-cols-[44px_1fr_44px] items-center')

const MonthButton = render.button(
  'flex h-44 w-44 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none',
)

const PrevMonthIcon = render.extend(IconArrowRight, 'rotate-180')

const NextMonthIcon = render.extend(IconArrowRight)

const MonthTitle = render.h1('text-center font-18-m text-gray-900')

const CalendarBoard = render.section('mt-12 flex w-full flex-col')

const WeekdayRow = render.div('grid grid-cols-[repeat(7,44px)] justify-between')

const WeekdayLabel = render.span('flex h-34 items-center justify-center font-14-r text-gray-700 data-[sunday=true]:text-red')

const DayGrid = render.div('grid grid-cols-[repeat(7,44px)] justify-between')

const DayButton = render.button(
  'relative flex h-56 w-44 cursor-pointer flex-col items-center justify-center border-none bg-transparent p-0 text-gray-300 shadow-none outline-none data-[current-month=true]:text-gray-900 data-[sunday=true]:data-[current-month=true]:text-red',
)

const DateNumber = render.span(
  'flex h-32 w-32 shrink-0 items-center justify-center rounded-full font-16-m data-[selected=true]:bg-black data-[selected=true]:text-white',
)

const RecordDot = render.span('mt-3 h-6 w-6 rounded-full bg-orange opacity-0 data-[visible=true]:opacity-100')

const FloatingAddButton = render.button(
  'fixed right-[max(20px,calc(50%_-_175px))] bottom-82 z-40 flex h-52 w-52 cursor-pointer items-center justify-center rounded-full border-none bg-orange p-0 shadow-[0_8px_20px_rgba(255,94,0,0.28)] outline-none active:scale-95',
)

const FloatingAddText = render.span('font-22-sb leading-none text-white')

const MonthlyStats = render.div('mt-24 flex items-center rounded-12 bg-gray-50 px-16 py-16')

const StatItem = render.div('flex flex-1 flex-col items-center gap-4')

const StatDivider = render.span('mx-12 h-36 w-1 shrink-0 bg-gray-200')

const StatLabel = render.span('font-12-r text-gray-500')

const StatValue = render.span('font-18-sb text-orange')

const StatsNotice = render.p('flex-1 text-center font-14-r text-gray-500')

const BottomSection = render.section('mt-16 flex w-full flex-col gap-16')

const StateWrapper = render.div('flex min-h-160 flex-col items-center justify-center gap-12')

const StateText = render.span('font-16-m text-gray-500')

const SignInPrompt = render.div('flex min-h-160 flex-col items-center justify-center gap-16')

const SignInText = render.span('font-16-m text-gray-500')

const EntryList = render.div('flex flex-col gap-8')

const EntryRow = render.div('flex items-center justify-between rounded-8 border border-solid border-gray-100 bg-white px-16 py-12')

const EntryInfo = render.div('flex min-w-0 flex-col gap-2')

const EntryName = render.span('font-16-sb text-gray-900')

const EntryNameButton = render.button(
  'block max-w-full cursor-pointer truncate border-none bg-transparent p-0 text-left font-16-sb text-gray-900 underline-offset-2 outline-none hover:text-orange focus:text-orange focus:underline',
)

const EntryMenus = render.span('truncate font-14-r text-gray-500')

const EntryPrice = render.span('font-14-m text-gray-900')

const EntryActions = render.div('ml-12 flex shrink-0 items-center gap-4')

const EntryActionButton = render.button(
  'flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none disabled:opacity-40',
)

const EmptyState = render.section('flex flex-col items-center rounded-8 bg-gray-50 px-20 py-28 text-center')

const EmptyIcon = render.div('flex h-56 w-56 items-center justify-center rounded-full bg-white')

const EmptyTitle = render.h2('mt-14 font-16-sb text-gray-900')

const EmptyDescription = render.p('mt-6 font-14-r text-gray-500')

const ConfirmBody = render.div('flex flex-col items-center gap-4')

const ConfirmTitle = render.div('font-16-sb text-gray-900')

const ConfirmMessage = render.div('font-16-r text-gray-500')

export default MyCalendarPage
