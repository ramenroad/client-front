import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  ramenCalendarQueryKeys,
  useDeleteRamenCalendarEntryMutation,
  useRamenCalendarEntriesQuery,
} from '@/entities/ramen-calendar/api'
import { useAuthSession } from '@/entities/session/model'
import { useToast } from '@/shared/ui/toast'

export type MyCalendarDay = {
  key: string
  date: Date
  label: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isSunday: boolean
  hasRecord: boolean
}

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const

const getMondayStartOffset = (day: number) => {
  return day === 0 ? 6 : day - 1
}

const pad2 = (value: number) => String(value).padStart(2, '0')

// 로컬 날짜 구성요소로 'YYYY-MM-DD' 생성(toISOString 금지 — UTC 변환으로 날짜가 밀릴 수 있음).
// 서버 visitDate와 동일 포맷이라야 인디케이터/리스트 매칭이 맞는다.
const toDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

const isSameDate = (a: Date, b: Date) => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const createMonthDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const addMonths = (date: Date, monthCount: number) => {
  return new Date(date.getFullYear(), date.getMonth() + monthCount, 1)
}

const createCalendarDays = (
  viewMonth: Date,
  selectedDate: Date,
  today: Date,
  recordedDates: Set<string>,
): MyCalendarDay[] => {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDate = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingEmptyCount = getMondayStartOffset(firstDate.getDay())
  const cellCount = Math.ceil((leadingEmptyCount + daysInMonth) / 7) * 7

  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(year, month, index - leadingEmptyCount + 1)
    const isCurrentMonth = date.getMonth() === month

    return {
      key: toDateKey(date),
      date,
      label: String(date.getDate()),
      isCurrentMonth,
      isToday: isSameDate(date, today),
      isSelected: isSameDate(date, selectedDate),
      isSunday: date.getDay() === 0,
      hasRecord: recordedDates.has(toDateKey(date)),
    }
  })
}

const createMonthLabel = (baseDate: Date) => {
  return `${baseDate.getFullYear()}년 ${baseDate.getMonth() + 1}월`
}

const createDateLabel = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

export const useMyCalendarPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const { isSignIn } = useAuthSession()

  const today = useMemo(() => new Date(), [])
  const [viewMonth, setViewMonth] = useState(() => createMonthDate(today))
  const [selectedDate, setSelectedDate] = useState(today)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth() + 1 // JS 0~11 → API 1~12

  const entriesQuery = useRamenCalendarEntriesQuery(year, month, { enabled: isSignIn })
  const entries = useMemo(() => entriesQuery.data ?? [], [entriesQuery.data])

  const recordedDates = useMemo(() => new Set(entries.map((entry) => entry.visitDate)), [entries])
  const days = useMemo(
    () => createCalendarDays(viewMonth, selectedDate, today, recordedDates),
    [recordedDates, selectedDate, today, viewMonth],
  )

  const selectedVisitDate = toDateKey(selectedDate)
  const selectedEntries = useMemo(
    () => entries.filter((entry) => entry.visitDate === selectedVisitDate),
    [entries, selectedVisitDate],
  )

  const deleteMutation = useDeleteRamenCalendarEntryMutation()

  const handleDeleteEntry = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id)
        queryClient.invalidateQueries({ queryKey: ramenCalendarQueryKeys.all })
        openToast('기록을 삭제했어요')
      } catch {
        openToast('삭제에 실패했어요')
      }
    },
    [deleteMutation, openToast, queryClient],
  )

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setViewMonth(createMonthDate(date))
  }

  return {
    monthLabel: createMonthLabel(viewMonth),
    selectedDateLabel: createDateLabel(selectedDate),
    weekdayLabels: WEEKDAY_LABELS,
    days,
    isSignIn,
    selectedEntries,
    selectedVisitDate,
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
    isDeleting: deleteMutation.isPending,
    isAddOpen,
    onPrevMonth: () => setViewMonth((current) => addMonths(current, -1)),
    onNextMonth: () => setViewMonth((current) => addMonths(current, 1)),
    onDateClick: handleDateClick,
    onBack: () => navigate(-1),
    onLoginClick: () => navigate('/login'),
    onDeleteEntry: handleDeleteEntry,
    openAdd: () => setIsAddOpen(true),
    closeAdd: () => setIsAddOpen(false),
  }
}
