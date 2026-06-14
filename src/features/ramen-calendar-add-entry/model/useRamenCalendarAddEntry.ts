import { useMemo, useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ramenCalendarQueryKeys, useCreateRamenCalendarEntryMutation } from '@/entities/ramen-calendar/api'
import { useSearchAutocompleteQuery } from '@/entities/search/api'
import type { AutocompleteRamenyaResult } from '@/entities/search/model'
import { useToast } from '@/shared/ui/toast'

type UseRamenCalendarAddEntryParams = {
  visitDate: string
  onClose: () => void
}

export const useRamenCalendarAddEntry = ({ visitDate, onClose }: UseRamenCalendarAddEntryParams) => {
  const queryClient = useQueryClient()
  const { openToast } = useToast()

  const [ramenyaName, setRamenyaName] = useState('')
  const [ramenyaId, setRamenyaId] = useState<string | null>(null)
  const [menuInput, setMenuInput] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const autocompleteQuery = useSearchAutocompleteQuery(ramenyaName)
  const suggestions = autocompleteQuery.data?.ramenyaSearchResults ?? []
  // 매장을 직접 선택(ramenyaId 존재)했으면 추천 숨김. 직접 입력 중일 때만 노출.
  const showSuggestions = ramenyaId === null && ramenyaName.trim().length > 0 && suggestions.length > 0

  const createMutation = useCreateRamenCalendarEntryMutation()

  // 단일 입력 → 쉼표 분리 배열(빈 메뉴 허용).
  const menus = useMemo(
    () =>
      menuInput
        .split(',')
        .map((menu) => menu.trim())
        .filter(Boolean),
    [menuInput],
  )

  const isNameValid = ramenyaName.trim().length > 0
  const errors = { ramenyaName: hasSubmitted && !isNameValid }

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSubmitted(true)

    if (!isNameValid) {
      openToast('가게를 입력해주세요')
      return
    }

    try {
      await createMutation.mutateAsync({
        visitDate,
        ramenyaName: ramenyaName.trim(),
        ramenyaId: ramenyaId ?? null,
        menus,
      })
      queryClient.invalidateQueries({ queryKey: ramenCalendarQueryKeys.all })
      openToast('기록을 추가했어요')
      onClose()
    } catch {
      openToast('기록 추가에 실패했어요')
    }
  }

  return {
    ramenyaName,
    menuInput,
    suggestions,
    showSuggestions,
    errors,
    isSubmitting: createMutation.isPending,
    handleNameChange,
    handleSelectResult,
    handleMenuChange,
    handleSubmit,
  }
}
