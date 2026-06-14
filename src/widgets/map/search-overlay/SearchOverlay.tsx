import type { ComponentProps } from 'react'
import { openUrl } from '@/shared/lib/browser'
import NoResultBox from '@/shared/ui/no-result-box'
import render from '@/shared/ui/render'
import { useSearchOverlay } from './model/useSearchOverlay'
import { SearchAutoCompleteResults } from './ui/SearchAutoCompleteResults'
import { SearchHistorySection } from './ui/SearchHistorySection'
import { SearchOverlayInputBar } from './ui/SearchOverlayInputBar'

interface SearchOverlayProps extends ComponentProps<'input'> {
  onSelectKeyword?: (keyword: string, isNearBy?: boolean) => void
  onClearKeyword?: () => void
  keyword: string
  setKeyword: (value: string) => void
  isExternal?: boolean
  isHidden?: boolean
  isSearchOverlayOpen?: boolean
  setIsSearchOverlayOpen?: (value: boolean) => void
}

export const SearchOverlay = ({
  onSelectKeyword,
  onClearKeyword,
  keyword,
  setKeyword,
  isExternal = false,
  isHidden = false,
  isSearchOverlayOpen = false,
  setIsSearchOverlayOpen,
  ...rest
}: SearchOverlayProps) => {
  const {
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
    handleCloseOverlay,
    handleKeywordResultClick,
    handleRamenyaResultClick,
    handleKeywordHistoryClick,
    handleRamenyaHistoryClick,
    handleKeywordHistoryDelete,
    handleRamenyaHistoryDelete,
    handleKeywordHistoryClear,
    handleRamenyaHistoryClear,
  } = useSearchOverlay({
    keyword,
    setKeyword,
    isExternal,
    isSearchOverlayOpen,
    setIsSearchOverlayOpen,
    onClearKeyword,
    onSelectKeyword,
  })

  return (
    <>
      {shouldRenderSearchBox && (
        <SearchOverlayInputBar
          {...rest}
          inputRef={inputRef}
          keyword={keyword}
          isHidden={isHidden && !isFocused}
          showBackIcon={isFocused || isExternal}
          showSearchIcon={!isFocused}
          onClose={handleCloseOverlay}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          onClear={handleClearKeyword}
          placeholder={isFocused ? '어떤 라멘을 찾으세요?' : '장르 또는 매장으로 검색해 보세요'}
        />
      )}

      {isOverlayVisible && (
        <FullScreenSearchOverlay>
          {isTyping ? (
            hasAutoCompleteResults ? (
              <SearchAutoCompleteResults
                keyword={keyword}
                keywordResults={keywordResults}
                ramenyaResults={ramenyaResults}
                onKeywordSelect={handleKeywordResultClick}
                onRamenyaSelect={handleRamenyaResultClick}
              />
            ) : isAutocompleteLoading ? null : (
              <NoResultBox
                actionButton={
                  <SubmitButton type="button" onClick={() => openUrl('https://forms.gle/BuqmFWMT2fCd37eK8')}>
                    제보하기
                  </SubmitButton>
                }
              />
            )
          ) : (
            <>
              <SearchHistorySection
                title="최근 검색어"
                items={keywordHistory}
                emptyMessage="최근 검색어가 없어요"
                display="chip"
                onClear={handleKeywordHistoryClear}
                onSelect={(item) => handleKeywordHistoryClick(item.keyword)}
                onDelete={(item) => handleKeywordHistoryDelete(item.keyword)}
              />
              <SearchHistorySection
                title="검색한 매장"
                items={ramenyaHistory}
                emptyMessage="검색한 매장이 없어요"
                display="list"
                onClear={handleRamenyaHistoryClear}
                onSelect={handleRamenyaHistoryClick}
                onDelete={(item) => handleRamenyaHistoryDelete(item._id)}
              />
            </>
          )}
        </FullScreenSearchOverlay>
      )}
    </>
  )
}

const SubmitButton = render.button(
  'text-orange bg-[#FFE4CE] font-16-m px-32 py-10 rounded-full outline-none border-none cursor-pointer',
)

const FullScreenSearchOverlay = render.main(
  'absolute w-full h-[100dvh] inset-0 bg-white z-[150] flex flex-col gap-32 box-border px-16 py-20 pt-84',
)
