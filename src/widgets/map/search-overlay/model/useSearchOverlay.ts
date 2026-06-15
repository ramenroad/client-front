import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { useSearchAutocompleteQuery } from '@/entities/search/api'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'

type LocalRamenyaHistoryItem = {
  _id: string
  name: string
}

interface SearchOverlayModelProps {
  keyword: string
  setKeyword: (value: string) => void
  isExternal: boolean
  isSearchOverlayOpen: boolean
  setIsSearchOverlayOpen?: (value: boolean) => void
  onClearKeyword?: () => void
  onSelectKeyword?: (keyword: string, isNearBy?: boolean) => void
}

const KEYWORD_HISTORY_STORAGE_KEY = 'signOutKeywordHistory'
const RAMENYA_HISTORY_STORAGE_KEY = 'signOutRamenyaHistory'

const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = <T>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const useSearchOverlay = ({
  keyword,
  setKeyword,
  isExternal,
  isSearchOverlayOpen,
  setIsSearchOverlayOpen,
  onClearKeyword,
  onSelectKeyword,
}: SearchOverlayModelProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [keywordHistoryValues, setKeywordHistoryValues] = useState<string[]>(() =>
    readStorage<string[]>(KEYWORD_HISTORY_STORAGE_KEY, []),
  )
  const [ramenyaHistoryValues, setRamenyaHistoryValues] = useState<LocalRamenyaHistoryItem[]>(() =>
    readStorage<LocalRamenyaHistoryItem[]>(RAMENYA_HISTORY_STORAGE_KEY, []),
  )

  // 입력은 즉시 반영하되 자동완성 요청은 타이핑이 멈춘 뒤에만 보낸다.
  const debouncedKeyword = useDebouncedValue(keyword, 250)
  const autocompleteQuery = useSearchAutocompleteQuery(debouncedKeyword, {
    staleTime: 30_000,
  })

  const keywordHistory = useMemo(
    () => keywordHistoryValues.map((historyKeyword, index) => ({ _id: String(index), keyword: historyKeyword })),
    [keywordHistoryValues],
  )
  const ramenyaHistory = useMemo(
    () => ramenyaHistoryValues.map((ramenya) => ({ _id: ramenya._id, keyword: ramenya.name })),
    [ramenyaHistoryValues],
  )

  const keywordResults = autocompleteQuery.data?.keywordSearchResults ?? []
  const ramenyaResults = autocompleteQuery.data?.ramenyaSearchResults ?? []
  const isTyping = keyword.length > 0
  const hasAutoCompleteResults = keywordResults.length > 0 || ramenyaResults.length > 0
  // 디바운스 대기 중이거나 요청 중이면 아직 '결과 없음'으로 단정하지 않는다.
  const isAutocompleteLoading = isTyping && (keyword !== debouncedKeyword || autocompleteQuery.isFetching)
  const isOverlayVisible = isFocused || (isExternal && isSearchOverlayOpen)
  const shouldRenderSearchBox = !isExternal || isSearchOverlayOpen

  useEffect(() => {
    if (isExternal && isSearchOverlayOpen) {
      inputRef.current?.focus()
    }
  }, [isExternal, isSearchOverlayOpen])

  const closeOverlay = useCallback(() => {
    setIsFocused(false)
    setIsSearchOverlayOpen?.(false)
  }, [setIsSearchOverlayOpen])

  const setKeywordHistory = useCallback((updater: (prev: string[]) => string[]) => {
    setKeywordHistoryValues((prev) => {
      const next = updater(prev).slice(0, 10)
      writeStorage(KEYWORD_HISTORY_STORAGE_KEY, next)
      return next
    })
  }, [])

  const setRamenyaHistory = useCallback((updater: (prev: LocalRamenyaHistoryItem[]) => LocalRamenyaHistoryItem[]) => {
    setRamenyaHistoryValues((prev) => {
      const next = updater(prev).slice(0, 10)
      writeStorage(RAMENYA_HISTORY_STORAGE_KEY, next)
      return next
    })
  }, [])

  const selectKeyword = useCallback(
    (nextKeyword: string, isNearBy?: boolean) => {
      onSelectKeyword?.(nextKeyword, isNearBy)
      setKeyword(nextKeyword)
      closeOverlay()
    },
    [closeOverlay, onSelectKeyword, setKeyword],
  )

  const addKeywordHistory = useCallback(
    (nextKeyword: string) => {
      const trimmedKeyword = nextKeyword.trim()

      if (!trimmedKeyword) {
        return
      }

      setKeywordHistory((prev) => [trimmedKeyword, ...prev.filter((historyKeyword) => historyKeyword !== trimmedKeyword)])
    },
    [setKeywordHistory],
  )

  const addRamenyaHistory = useCallback(
    (ramenya: LocalRamenyaHistoryItem) => {
      setRamenyaHistory((prev) => [ramenya, ...prev.filter((history) => history._id !== ramenya._id)])
    },
    [setRamenyaHistory],
  )

  const handleInputFocus = useCallback(() => setIsFocused(true), [])

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setKeyword(event.target.value)
    },
    [setKeyword],
  )

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing || event.key !== 'Enter') {
        return
      }

      addKeywordHistory(keyword)
      selectKeyword(keyword, true)
      inputRef.current?.blur()
    },
    [addKeywordHistory, keyword, selectKeyword],
  )

  const handleClearKeyword = useCallback(() => {
    setKeyword('')
    onClearKeyword?.()
  }, [onClearKeyword, setKeyword])

  const handleKeywordResultClick = useCallback(
    (nextKeyword: string) => {
      addKeywordHistory(nextKeyword)
      selectKeyword(nextKeyword)
    },
    [addKeywordHistory, selectKeyword],
  )

  const handleRamenyaResultClick = useCallback(
    (ramenya: { _id: string; name: string }) => {
      addRamenyaHistory(ramenya)
      selectKeyword(ramenya.name)
    },
    [addRamenyaHistory, selectKeyword],
  )

  const handleKeywordHistoryClick = useCallback(
    (historyKeyword: string) => {
      addKeywordHistory(historyKeyword)
      selectKeyword(historyKeyword)
    },
    [addKeywordHistory, selectKeyword],
  )

  const handleRamenyaHistoryClick = useCallback(
    (ramenya: { _id: string; keyword: string }) => {
      addRamenyaHistory({ _id: ramenya._id, name: ramenya.keyword })
      selectKeyword(ramenya.keyword)
    },
    [addRamenyaHistory, selectKeyword],
  )

  const handleKeywordHistoryDelete = useCallback(
    (keywordToRemove: string) => {
      setKeywordHistory((prev) => prev.filter((historyKeyword) => historyKeyword !== keywordToRemove))
    },
    [setKeywordHistory],
  )

  const handleRamenyaHistoryDelete = useCallback(
    (ramenyaId: string) => {
      setRamenyaHistory((prev) => prev.filter((history) => history._id !== ramenyaId))
    },
    [setRamenyaHistory],
  )

  const handleKeywordHistoryClear = useCallback(() => setKeywordHistory(() => []), [setKeywordHistory])

  const handleRamenyaHistoryClear = useCallback(() => setRamenyaHistory(() => []), [setRamenyaHistory])

  return {
    inputRef,
    isFocused,
    isTyping,
    isOverlayVisible,
    shouldRenderSearchBox,
    hasAutoCompleteResults,
    isAutocompleteLoading,
    keywordHistory,
    ramenyaHistory,
    keywordResults,
    ramenyaResults,
    handleInputFocus,
    handleInputChange,
    handleInputKeyDown,
    handleClearKeyword,
    handleCloseOverlay: closeOverlay,
    handleKeywordResultClick,
    handleRamenyaResultClick,
    handleKeywordHistoryClick,
    handleRamenyaHistoryClick,
    handleKeywordHistoryDelete,
    handleRamenyaHistoryDelete,
    handleKeywordHistoryClear,
    handleRamenyaHistoryClear,
  }
}
