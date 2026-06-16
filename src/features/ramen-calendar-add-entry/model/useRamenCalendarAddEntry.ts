import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ramenCalendarQueryKeys,
  useCreateRamenCalendarEntryMutation,
  useUpdateRamenCalendarEntryMutation,
} from '@/entities/ramen-calendar/api'
import type { RamenCalendarEntry } from '@/entities/ramen-calendar/model'
import { useSearchAutocompleteQuery } from '@/entities/search/api'
import type { AutocompleteRamenyaResult } from '@/entities/search/model'
import { useToast } from '@/shared/ui/toast'

type UseRamenCalendarAddEntryParams = {
  visitDate: string
  entry?: RamenCalendarEntry | null
  initialRamenya?: RamenCalendarAddEntryInitialRamenya
  createSuccessToastAction?: (visitDate: string) => ReactNode
  onClose: () => void
}

export type RamenCalendarAddEntryInitialRamenya = {
  _id: string
  name: string
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const createPriceInputValue = (value: number | string) => {
  const digits = String(value).replace(/[^\d]/g, '')

  if (!digits) {
    return ''
  }

  return digits.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 가격 입력 토글 상태를 기기에 기억(기록별이 아니라 사용자 선호). theme 저장과 동일한 직접 접근 패턴.
const PRICE_INPUT_ENABLED_STORAGE_KEY = 'ramen-calendar:price-input-enabled'

const getStoredPriceInputEnabled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(PRICE_INPUT_ENABLED_STORAGE_KEY) === 'true'
}

const persistPriceInputEnabled = (enabled: boolean) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PRICE_INPUT_ENABLED_STORAGE_KEY, String(enabled))
}

export const useRamenCalendarAddEntry = ({
  visitDate,
  entry,
  initialRamenya,
  createSuccessToastAction,
  onClose,
}: UseRamenCalendarAddEntryParams) => {
  const queryClient = useQueryClient()
  const { openToast } = useToast()
  const isEditMode = Boolean(entry)

  const [entryVisitDate, setEntryVisitDate] = useState(entry?.visitDate ?? visitDate)
  const [ramenyaName, setRamenyaName] = useState(entry?.ramenyaName ?? initialRamenya?.name ?? '')
  const [ramenyaId, setRamenyaId] = useState<string | null>(entry?.ramenyaId ?? initialRamenya?._id ?? null)
  const [menuInput, setMenuInput] = useState(entry?.menus.join(', ') ?? '')
  // 저장된 선호가 켜져 있거나, 수정 중인 기록에 가격이 있으면 입력란을 연다.
  const [isPriceInputEnabled, setIsPriceInputEnabled] = useState(
    () => getStoredPriceInputEnabled() || entry?.price != null,
  )
  const [priceInput, setPriceInput] = useState(entry?.price != null ? createPriceInputValue(entry.price) : '')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const autocompleteQuery = useSearchAutocompleteQuery(ramenyaName)
  const suggestions = autocompleteQuery.data?.ramenyaSearchResults ?? []
  // 매장을 직접 선택(ramenyaId 존재)했으면 추천 숨김. 직접 입력 중일 때만 노출.
  const showSuggestions = ramenyaId === null && ramenyaName.trim().length > 0 && suggestions.length > 0

  const createMutation = useCreateRamenCalendarEntryMutation()
  const updateMutation = useUpdateRamenCalendarEntryMutation()

  // 단일 입력 → 쉼표 분리 배열(빈 메뉴 허용).
  const menus = useMemo(
    () =>
      menuInput
        .split(',')
        .map((menu) => menu.trim())
        .filter(Boolean),
    [menuInput],
  )

  const isVisitDateValid = DATE_PATTERN.test(entryVisitDate.trim())
  const isNameValid = ramenyaName.trim().length > 0
  const errors = {
    visitDate: hasSubmitted && !isVisitDateValid,
    ramenyaName: hasSubmitted && !isNameValid,
  }

  const handleVisitDateChange = (value: string) => {
    setEntryVisitDate(value)
  }

  const handleNameChange = (value: string) => {
    setRamenyaName(value)
    setRamenyaId(null) // 직접 수정하면 이전 선택 무효화 → 이름만 저장
  }

  const handleSelectResult = (result: AutocompleteRamenyaResult) => {
    setRamenyaName(result.name)
    setRamenyaId(result._id)
  }

  const handleMenuChange = (value: string) => {
    setMenuInput(value)
  }

  const handlePriceInputEnabledChange = (enabled: boolean) => {
    setIsPriceInputEnabled(enabled)
    persistPriceInputEnabled(enabled)
  }

  // 숫자만 허용(빈 값은 미입력으로 처리).
  const handlePriceChange = (value: string) => {
    setPriceInput(createPriceInputValue(value))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSubmitted(true)

    if (!isVisitDateValid) {
      openToast('방문 날짜를 확인해주세요', undefined, 'error')
      return
    }

    if (!isNameValid) {
      openToast('가게를 입력해주세요', undefined, 'error')
      return
    }

    try {
      const priceDigits = priceInput.replace(/[^\d]/g, '')
      const formData = {
        visitDate: entryVisitDate.trim(),
        ramenyaName: ramenyaName.trim(),
        ramenyaId: ramenyaId ?? null,
        menus,
        // 토글이 꺼져 있거나 빈 값이면 가격 미입력(null)으로 저장.
        price: isPriceInputEnabled && priceDigits !== '' ? Number(priceDigits) : null,
      }

      if (isEditMode && entry) {
        await updateMutation.mutateAsync({ id: entry._id, data: formData })
      } else {
        await createMutation.mutateAsync(formData)
      }

      queryClient.invalidateQueries({ queryKey: ramenCalendarQueryKeys.all })
      openToast(isEditMode ? '기록을 수정했어요' : '기록을 추가했어요', createSuccessToastAction?.(formData.visitDate))
      onClose()
    } catch {
      openToast(isEditMode ? '기록 수정에 실패했어요' : '기록 추가에 실패했어요', undefined, 'error')
    }
  }

  return {
    title: isEditMode ? '라멘 기록 수정' : '라멘 기록 추가',
    submitText: isEditMode ? '수정하기' : '추가하기',
    entryVisitDate,
    ramenyaName,
    menuInput,
    isPriceInputEnabled,
    priceInput,
    suggestions,
    showSuggestions,
    errors,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleVisitDateChange,
    handleNameChange,
    handleSelectResult,
    handleMenuChange,
    handlePriceInputEnabledChange,
    handlePriceChange,
    handleSubmit,
  }
}
