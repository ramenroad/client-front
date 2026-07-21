import { useMemo, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ramenCalendarQueryKeys,
  useCreateRamenCalendarEntryMutation,
  useUpdateRamenCalendarEntryMutation,
} from '@/entities/ramen-calendar/api'
import type { RamenCalendarEntry } from '@/entities/ramen-calendar/model'
import { useRamenyaDetailQuery } from '@/entities/ramenya/api'
import { useSearchAutocompleteQuery } from '@/entities/search/api'
import type { AutocompleteRamenyaResult } from '@/entities/search/model'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
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
  const [isRamenyaInputFocused, setIsRamenyaInputFocused] = useState(false)
  // 뱃지로 확정된 메뉴들. 수정 모드에선 저장된 메뉴가 곧 뱃지로 올라온다.
  const [menuBadges, setMenuBadges] = useState<string[]>(entry?.menus ?? [])
  // 아직 뱃지가 되지 않은, 입력 중인 메뉴 1개 분량의 텍스트.
  const [menuInput, setMenuInput] = useState('')
  const [isMenuInputFocused, setIsMenuInputFocused] = useState(false)
  // 저장된 선호가 켜져 있거나, 수정 중인 기록에 가격이 있으면 입력란을 연다.
  const [isPriceInputEnabled, setIsPriceInputEnabled] = useState(
    () => getStoredPriceInputEnabled() || entry?.price != null,
  )
  const [priceInput, setPriceInput] = useState(entry?.price != null ? createPriceInputValue(entry.price) : '')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // 입력은 즉시 반영하되 자동완성 요청은 타이핑이 멈춘 뒤에만 보낸다 (지도 검색 오버레이와 동일 패턴).
  const debouncedRamenyaName = useDebouncedValue(ramenyaName, 250)
  const autocompleteQuery = useSearchAutocompleteQuery(debouncedRamenyaName, { staleTime: 30_000 })
  const suggestions = autocompleteQuery.data?.ramenyaSearchResults ?? []
  // 매장을 직접 선택(ramenyaId 존재)했으면 추천 숨김. 포커스 중에 직접 입력할 때만 노출.
  const showSuggestions =
    isRamenyaInputFocused && ramenyaId === null && ramenyaName.trim().length > 0 && suggestions.length > 0

  // 라이징 등록 매장을 선택했을 때만 매장 메뉴를 가져와 메뉴 자동완성 재료로 쓴다.
  // (쿼리가 자체적으로 enabled: Boolean(id)라 미선택 시 요청이 나가지 않는다.)
  const ramenyaDetailQuery = useRamenyaDetailQuery(ramenyaId ?? '')
  const storeMenus = [...new Set(ramenyaDetailQuery.data?.menus ?? [])]

  const currentMenuQuery = menuInput.trim()
  // 입력 텍스트가 메뉴 목록의 한 항목과 완전히 일치하면 다 친 것으로 보고 제안을 멈춘다(Enter로 뱃지화만 남은 상태).
  // (예: '이에케라멘'을 다 친 상태에서 그 문자열을 포함하는 '매운 이에케라멘'이 계속 뜨는 것 방지)
  const isCurrentMenuMatched =
    currentMenuQuery.length > 0 && storeMenus.some((menu) => menu.toLowerCase() === currentMenuQuery.toLowerCase())
  const menuSuggestions = isCurrentMenuMatched
    ? []
    : storeMenus.filter((menu) => {
        const normalizedMenu = menu.toLowerCase()

        // 이미 뱃지로 확정한 메뉴는 항상 제외.
        if (menuBadges.some((badge) => badge.toLowerCase() === normalizedMenu)) {
          return false
        }

        // 빈 입력(포커스 직후·뱃지 확정 직후)은 남은 메뉴 전체를 후보로 삼는다.
        if (!currentMenuQuery) {
          return true
        }

        return normalizedMenu.includes(currentMenuQuery.toLowerCase())
      })
  // 포커스 중에만 노출 — 저장된 메뉴가 있는 수정 모드에서 열리자마자 목록이 떠 있는 것도 막는다.
  const showMenuSuggestions = isMenuInputFocused && menuSuggestions.length > 0

  const createMutation = useCreateRamenCalendarEntryMutation()
  const updateMutation = useUpdateRamenCalendarEntryMutation()

  // 뱃지가 있으면 뱃지만 저장 — 입력하다 만 텍스트는 버린다(뱃지 사용법을 아는 사용자로 간주).
  // 뱃지가 없으면 입력 텍스트 1개를 배열로 감싼다 — 뱃지를 안 써도 기존처럼 동작.
  const menus = useMemo(() => {
    if (menuBadges.length > 0) {
      return menuBadges
    }

    const draft = menuInput.trim()
    return draft ? [draft] : []
  }, [menuBadges, menuInput])

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

  // 입력 텍스트/제안 메뉴를 뱃지로 확정. 이미 있는 뱃지(대소문자 무시)면 추가 없이 입력만 비운다.
  const addMenuBadge = (menu: string) => {
    const trimmed = menu.trim()

    if (!trimmed) {
      return
    }

    setMenuBadges((prev) =>
      prev.some((badge) => badge.toLowerCase() === trimmed.toLowerCase()) ? prev : [...prev, trimmed],
    )
    setMenuInput('')
  }

  const handleSelectMenuSuggestion = (menu: string) => {
    addMenuBadge(menu)
  }

  const handleRemoveMenuBadge = (index: number) => {
    setMenuBadges((prev) => prev.filter((_, badgeIndex) => badgeIndex !== index))
  }

  // Enter → 폼 제출 대신 뱃지 생성. 빈 입력에서 Backspace → 마지막 뱃지 제거.
  const handleMenuInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      // 한글 IME 조합 중 Enter는 조합 확정용이라, 뱃지까지 만들면 마지막 글자가 이중 처리된다.
      if (!event.nativeEvent.isComposing) {
        addMenuBadge(menuInput)
      }
      return
    }

    if (event.key === 'Backspace' && menuInput === '' && menuBadges.length > 0) {
      setMenuBadges((prev) => prev.slice(0, -1))
    }
  }

  const handleMenuInputFocusChange = (focused: boolean) => {
    setIsMenuInputFocused(focused)
  }

  const handleRamenyaInputFocusChange = (focused: boolean) => {
    setIsRamenyaInputFocused(focused)
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
    menuBadges,
    isPriceInputEnabled,
    priceInput,
    suggestions,
    showSuggestions,
    // 라이징 등록 매장과 매칭된 상태 — 직접 수정하면 handleNameChange가 ramenyaId를 풀어 자동 해제된다.
    isRamenyaMatched: ramenyaId !== null,
    currentMenuQuery,
    menuSuggestions,
    showMenuSuggestions,
    errors,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
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
  }
}
