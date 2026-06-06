import { useMemo, useState } from 'react'
import { initialFilterOptions, RAMENYA_TYPES, SortType, type FilterOptions, type RamenyaType } from '@/entities/ramenya/model'
import { Button } from '@/shared/ui/button'
import { IconCheck, IconClose, IconFilterWithTag, IconPinned } from '@/shared/ui/icon'
import { Line } from '@/shared/ui/line'
import { BottomPopupLayout, Popup } from '@/shared/ui/popup'
import render from '@/shared/ui/render'
import { Toggle } from '@/shared/ui/toggle'

interface FilterSectionProps {
  filterOptions: FilterOptions
  onFilterChange: (filterOptions: FilterOptions) => void
  genre?: RamenyaType
}

type FilterPopupType = 'filter' | 'sort'

const sortOptions = Object.values(SortType)

export const FilterSection = ({ filterOptions, onFilterChange, genre }: FilterSectionProps) => {
  const [popupType, setPopupType] = useState<FilterPopupType | null>(null)

  const filterCount = useMemo(() => {
    let count = 0
    if (filterOptions.isOpen) count += 1
    if (filterOptions.sort !== SortType.DEFAULT) count += 1
    if (genre) count += 1
    return count
  }, [filterOptions.isOpen, filterOptions.sort, genre])

  const handleOpenOnlyClick = () => {
    onFilterChange({
      ...filterOptions,
      isOpen: !filterOptions.isOpen,
    })
  }

  const handleGenreClick = (ramenyaGenre: string) => {
    if (ramenyaGenre === genre) {
      return
    }

    const nextGenres = filterOptions.genre.includes(ramenyaGenre)
      ? filterOptions.genre.filter((selectedGenre) => selectedGenre !== ramenyaGenre)
      : [...filterOptions.genre, ramenyaGenre]

    onFilterChange({
      ...filterOptions,
      genre: nextGenres,
    })
  }

  const closePopup = () => setPopupType(null)

  return (
    <Wrapper>
      <FilterWrapper>
        <RelativeWrapper>
          <FilterIconButton type="button" onClick={() => setPopupType('filter')} aria-label="필터 열기">
            <IconFilterWithTag color={filterCount === 0 ? 'black' : '#FF5E00'} />
          </FilterIconButton>
          {filterCount > 1 && <FilterCount>{filterCount}</FilterCount>}
        </RelativeWrapper>

        <FilterButton type="button" data-active={filterOptions.isOpen} onClick={handleOpenOnlyClick}>
          영업중
        </FilterButton>

        <FilterButton type="button" data-active onClick={() => setPopupType('sort')}>
          {filterOptions.sort}
        </FilterButton>

        {(genre || filterOptions.genre.length > 0) && <Divider vertical />}

        {genre && (
          <FilterButton type="button" data-active>
            {genre}
          </FilterButton>
        )}

        {filterOptions.genre.map((filterGenre) => (
          <FilterButton key={filterGenre} type="button" data-active onClick={() => handleGenreClick(filterGenre)}>
            {filterGenre}
          </FilterButton>
        ))}
      </FilterWrapper>

      <Popup isOpen={popupType === 'filter'} direction="bottom" onClose={closePopup}>
        <FilterBottomPopup
          currentFilterOptions={filterOptions}
          pinnedGenre={genre}
          onClose={closePopup}
          onChange={onFilterChange}
        />
      </Popup>

      <Popup isOpen={popupType === 'sort'} direction="bottom" onClose={closePopup}>
        <SortBottomPopup
          sortOption={filterOptions.sort}
          onClose={closePopup}
          onChange={(sortOption) => {
            onFilterChange({
              ...filterOptions,
              sort: sortOption,
            })
            closePopup()
          }}
        />
      </Popup>
    </Wrapper>
  )
}

const FilterBottomPopup = ({
  currentFilterOptions,
  pinnedGenre,
  onClose,
  onChange,
}: {
  currentFilterOptions: FilterOptions
  pinnedGenre?: RamenyaType
  onClose: () => void
  onChange: (filterOptions: FilterOptions) => void
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(currentFilterOptions)
  const ramenyaGenres = useMemo(() => {
    const filteredTypes = Object.values(RAMENYA_TYPES).filter((type) => type !== pinnedGenre)
    return pinnedGenre ? [pinnedGenre, ...filteredTypes] : filteredTypes
  }, [pinnedGenre])

  const handleSortClick = (sort: SortType) => {
    setFilterOptions((prev) => ({
      ...prev,
      sort,
    }))
  }

  const handleGenreClick = (ramenyaGenre: string) => {
    if (ramenyaGenre === pinnedGenre) {
      return
    }

    setFilterOptions((prev) => ({
      ...prev,
      genre: prev.genre.includes(ramenyaGenre)
        ? prev.genre.filter((selectedGenre) => selectedGenre !== ramenyaGenre)
        : [...prev.genre, ramenyaGenre],
    }))
  }

  const handleResetClick = () => {
    setFilterOptions(initialFilterOptions)
    onChange(initialFilterOptions)
    onClose()
  }

  const handleApplyClick = () => {
    onChange(filterOptions)
    onClose()
  }

  return (
    <BottomPopupLayout>
      <PopupWrapper>
        <PopupHeader>
          <PopupTitle>필터</PopupTitle>
          <CloseButton type="button" onClick={onClose} aria-label="필터 닫기">
            <IconClose />
          </CloseButton>
        </PopupHeader>

        <PopupSection>
          <PopupRow>
            <SectionTitle>영업중</SectionTitle>
            <Toggle
              checked={filterOptions.isOpen}
              onChange={(checked) => setFilterOptions((prev) => ({ ...prev, isOpen: checked }))}
              onText="ON"
              offText="OFF"
            />
          </PopupRow>
        </PopupSection>

        <PopupSection>
          <SectionTitle>정렬</SectionTitle>
          <ButtonGroup>
            {sortOptions.map((sort) => (
              <FilterButton key={sort} type="button" data-popup data-active={filterOptions.sort === sort} onClick={() => handleSortClick(sort)}>
                {sort}
              </FilterButton>
            ))}
          </ButtonGroup>
        </PopupSection>

        <PopupSection>
          <SectionTitle>장르</SectionTitle>
          <ButtonGroup>
            {ramenyaGenres.map((ramenyaGenre) => (
              <FilterButton
                key={ramenyaGenre}
                type="button"
                data-popup
                data-active={ramenyaGenre === pinnedGenre || filterOptions.genre.includes(ramenyaGenre)}
                data-pinned={ramenyaGenre === pinnedGenre}
                onClick={() => handleGenreClick(ramenyaGenre)}
              >
                {ramenyaGenre === pinnedGenre && <IconPinned />}
                {ramenyaGenre}
              </FilterButton>
            ))}
          </ButtonGroup>
        </PopupSection>

        <PopupButtonRow>
          <Button type="button" variant="secondary" onClick={handleResetClick}>
            초기화
          </Button>
          <Button type="button" onClick={handleApplyClick}>
            적용하기
          </Button>
        </PopupButtonRow>
      </PopupWrapper>
    </BottomPopupLayout>
  )
}

const SortBottomPopup = ({
  sortOption,
  onClose,
  onChange,
}: {
  sortOption: SortType
  onClose: () => void
  onChange: (sortOption: SortType) => void
}) => {
  return (
    <BottomPopupLayout>
      <SortPopupWrapper>
        <PopupHeader>
          <PopupTitle>정렬</PopupTitle>
          <CloseButton type="button" onClick={onClose} aria-label="정렬 닫기">
            <IconClose />
          </CloseButton>
        </PopupHeader>

        <SortOptionList>
          {sortOptions.map((sort) => (
            <SortOptionRow key={sort} type="button" onClick={() => onChange(sort)}>
              <SortOptionText data-selected={sortOption === sort}>{sort}</SortOptionText>
              {sortOption === sort && <IconCheck />}
            </SortOptionRow>
          ))}
        </SortOptionList>
      </SortPopupWrapper>
    </BottomPopupLayout>
  )
}

const Wrapper = render.section('w-full bg-white')

const FilterWrapper = render.section(
  'box-border flex w-full flex-nowrap items-center gap-8 overflow-x-auto whitespace-nowrap px-20 py-11 scrollbar-hide',
)

const RelativeWrapper = render.div('relative h-30 shrink-0')

const FilterIconButton = render.button('h-30 w-30 cursor-pointer border-0 bg-transparent p-0 shadow-none outline-none')

const FilterCount = render.div(
  'absolute right-0 top-[-4px] flex h-14 w-14 items-center justify-center rounded-full bg-orange text-[9px] text-white',
)

const Divider = render.extend(Line, 'h-18')

const FilterButton = render.button(
  'font-14-r flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-0 bg-filter-background px-12 py-4 text-filter-text shadow-none outline-none data-[active=true]:bg-filter-active-background data-[active=true]:text-filter-active-text data-[pinned=true]:pl-8 data-[popup=true]:py-6',
)

const PopupWrapper = render.div('flex w-full flex-col gap-20')

const SortPopupWrapper = render.div('box-border flex w-350 max-w-350 flex-col gap-20')

const PopupHeader = render.div('box-border flex items-center justify-between')

const PopupTitle = render.span('font-18-sb text-black')

const CloseButton = render.button('cursor-pointer border-0 bg-transparent p-0 shadow-none outline-none')

const PopupSection = render.div('mb-12 flex flex-col gap-8')

const PopupRow = render.div('flex items-center justify-between gap-8')

const SectionTitle = render.div('mb-4 font-16-m text-black')

const ButtonGroup = render.div('flex flex-wrap gap-8')

const PopupButtonRow = render.div('flex items-center justify-between gap-8')

const SortOptionList = render.div('box-border flex flex-col gap-20 justify-between')

const SortOptionRow = render.button(
  'box-border flex cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left shadow-none outline-none',
)

const SortOptionText = render.span('font-16-r mb-4 text-gray-400 data-[selected=true]:text-orange')
