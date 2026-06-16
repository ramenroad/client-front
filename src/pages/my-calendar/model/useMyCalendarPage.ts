import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  ramenCalendarQueryKeys,
  useDeleteRamenCalendarEntryMutation,
  useRamenCalendarEntriesQuery,
} from '@/entities/ramen-calendar/api'
import type { RamenCalendarEntry } from '@/entities/ramen-calendar/model'
import { useAuthSession, useGoToLogin } from '@/entities/session/model'
import { useToast } from '@/shared/ui/toast'

export type MyCalendarDay = {
  key: string
  date: Date
  label: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isSunday: boolean
  isSaturday: boolean
  hasRecord: boolean
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const
const SELECTED_DATE_QUERY_KEY = 'date'
const VIEW_MONTH_QUERY_KEY = 'month'
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/

const pad2 = (value: number) => String(value).padStart(2, '0')

// 로컬 날짜 구성요소로 'YYYY-MM-DD' 생성(toISOString 금지 — UTC 변환으로 날짜가 밀릴 수 있음).
// 서버 visitDate와 동일 포맷이라야 인디케이터/리스트 매칭이 맞는다.
const toDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

const toMonthKey = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`
}

const parseDateKey = (value: string | null) => {
  if (!value || !DATE_KEY_PATTERN.test(value)) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

const parseMonthKey = (value: string | null) => {
  if (!value || !MONTH_KEY_PATTERN.test(value)) {
    return null
  }

  const [year, month] = value.split('-').map(Number)
  const date = new Date(year, month - 1, 1)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1) {
    return null
  }

  return date
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
  const leadingEmptyCount = firstDate.getDay()
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
      isSaturday: date.getDay() === 6,
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

const countEntryBowls = (entry: RamenCalendarEntry) => {
  return entry.menus.length > 0 ? entry.menus.length : 1
}

const createInitialCalendarState = (today: Date, searchParams: URLSearchParams) => {
  const selectedDate = parseDateKey(searchParams.get(SELECTED_DATE_QUERY_KEY)) ?? today
  const viewMonth = parseMonthKey(searchParams.get(VIEW_MONTH_QUERY_KEY)) ?? createMonthDate(selectedDate)

  return { selectedDate, viewMonth }
}

export const useMyCalendarPage = () => {
  const navigate = useNavigate()
  const goToLogin = useGoToLogin()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const { isSignIn } = useAuthSession()

  const today = useMemo(() => new Date(), [])
  const initialCalendarState = useMemo(() => createInitialCalendarState(today, searchParams), [searchParams, today])
  const [viewMonth, setViewMonth] = useState(initialCalendarState.viewMonth)
  const [selectedDate, setSelectedDate] = useState(initialCalendarState.selectedDate)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [deleteTargetEntryId, setDeleteTargetEntryId] = useState<string | null>(null)

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
  const monthlyBowlCount = useMemo(
    () => entries.reduce((count, entry) => count + countEntryBowls(entry), 0),
    [entries],
  )
  // 가격 미입력(null)은 0원 처리(null-safe). 보고 있는 달 기준 총 지출.
  const monthlyTotalPrice = useMemo(
    () => entries.reduce((sum, entry) => sum + (entry.price ?? 0), 0),
    [entries],
  )
  const shouldShowMonthlyTotalPrice = monthlyTotalPrice > 0
  const monthlyTotalPriceLabel = useMemo(() => monthlyTotalPrice.toLocaleString('ko-KR'), [monthlyTotalPrice])
  const editingEntry = useMemo(
    () => entries.find((entry) => entry._id === editingEntryId) ?? null,
    [editingEntryId, entries],
  )

  const deleteMutation = useDeleteRamenCalendarEntryMutation()

  const syncCalendarSearchParams = useCallback(
    (nextViewMonth: Date, nextSelectedDate: Date) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          next.set(VIEW_MONTH_QUERY_KEY, toMonthKey(nextViewMonth))
          next.set(SELECTED_DATE_QUERY_KEY, toDateKey(nextSelectedDate))
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const openDeleteConfirm = useCallback((id: string) => {
    setDeleteTargetEntryId(id)
  }, [])

  const closeDeleteConfirm = useCallback(() => {
    setDeleteTargetEntryId(null)
  }, [])

  const handleConfirmDeleteEntry = useCallback(
    async () => {
      if (!deleteTargetEntryId) {
        return
      }

      const targetEntryId = deleteTargetEntryId
      setDeleteTargetEntryId(null)

      try {
        await deleteMutation.mutateAsync(targetEntryId)
        queryClient.invalidateQueries({ queryKey: ramenCalendarQueryKeys.all })
        openToast('기록을 삭제했어요')
      } catch {
        openToast('삭제에 실패했어요', undefined, 'error')
      }
    },
    [deleteMutation, deleteTargetEntryId, openToast, queryClient],
  )

  const handleMonthChange = useCallback(
    (monthCount: number) => {
      setViewMonth((current) => {
        const nextViewMonth = addMonths(current, monthCount)
        syncCalendarSearchParams(nextViewMonth, selectedDate)
        return nextViewMonth
      })
    },
    [selectedDate, syncCalendarSearchParams],
  )

  const handleDateClick = useCallback(
    (date: Date) => {
      const nextViewMonth = createMonthDate(date)
      setSelectedDate(date)
      setViewMonth(nextViewMonth)
      syncCalendarSearchParams(nextViewMonth, date)
    },
    [syncCalendarSearchParams],
  )

  const handleEntryClick = useCallback(
    (entry: RamenCalendarEntry) => {
      if (!entry.ramenyaId) {
        return
      }

      navigate(`/detail/${entry.ramenyaId}`)
    },
    [navigate],
  )

  return {
    monthLabel: createMonthLabel(viewMonth),
    selectedDateLabel: createDateLabel(selectedDate),
    weekdayLabels: WEEKDAY_LABELS,
    days,
    isSignIn,
    selectedEntries,
    monthlyBowlCount,
    monthlyTotalPrice,
    shouldShowMonthlyTotalPrice,
    monthlyTotalPriceLabel,
    editingEntry,
    selectedVisitDate,
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
    isDeleting: deleteMutation.isPending,
    isDeleteConfirmOpen: Boolean(deleteTargetEntryId),
    isAddOpen,
    onPrevMonth: () => handleMonthChange(-1),
    onNextMonth: () => handleMonthChange(1),
    onDateClick: handleDateClick,
    onEntryClick: handleEntryClick,
    onBack: () => navigate(-1),
    onLoginClick: () => goToLogin(),
    onEditEntry: (id: string) => setEditingEntryId(id),
    onCloseEdit: () => setEditingEntryId(null),
    onDeleteEntry: openDeleteConfirm,
    onCloseDeleteConfirm: closeDeleteConfirm,
    onConfirmDeleteEntry: handleConfirmDeleteEntry,
    openAdd: () => setIsAddOpen(true),
    closeAdd: () => setIsAddOpen(false),
  }
}
