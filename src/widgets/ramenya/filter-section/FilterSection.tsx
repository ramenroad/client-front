import { useMemo, useState } from 'react'
import { initialFilterOptions, RAMENYA_TYPES, SortType, type FilterOptions, type RamenyaType } from '@/entities/ramenya/model'
import { IconFilterWithTag, IconPinned } from '@/shared/ui/icon'
import { Line } from '@/shared/ui/line'
import render from '@/shared/ui/render'

interface FilterSectionProps {
  filterOptions: FilterOptions
  onFilterChange: (filterOptions: FilterOptions) => void
  genre?: RamenyaType
}

const sortOptions = Object.values(SortType)

export const FilterSection = ({ filterOptions, onFilterChange, genre }: FilterSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const ramenyaGenres = useMemo(() => {
    const filteredTypes = Object.values(RAMENYA_TYPES).filter((type) => type !== genre)
    return genre ? [genre, ...filteredTypes] : filteredTypes
  }, [genre])

  const filterCount = useMemo(() => {
    let count = 0
    if (filterOptions.isOpen) count += 1
    if (filterOptions.sort !== SortType.DEFAULT) count += 1
    if (genre) count += 1
    count += filterOptions.genre.length
    return count
  }, [filterOptions.genre.length, filterOptions.isOpen, filterOptions.sort, genre])

  const handleOpenOnlyClick = () => {
    onFilterChange({
      ...filterOptions,
      isOpen: !filterOptions.isOpen,
    })
  }

  const handleSortClick = (sort: SortType) => {
    onFilterChange({
      ...filterOptions,
      sort,
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

  const handleResetClick = () => {
    onFilterChange(initialFilterOptions)
  }

  return (
    <Wrapper>
      <FilterWrapper>
        <RelativeWrapper>
          <FilterIconButton type="button" onClick={() => setIsExpanded((prev) => !prev)} aria-label="필터 열기">
            <IconFilterWithTag color={filterCount === 0 ? 'black' : '#FF5E00'} />
          </FilterIconButton>
          {filterCount > 1 && <FilterCount>{filterCount}</FilterCount>}
        </RelativeWrapper>

        <FilterButton type="button" data-active={filterOptions.isOpen} onClick={handleOpenOnlyClick}>
          영업중
        </FilterButton>

        <FilterButton
          type="button"
          data-active={filterOptions.sort !== SortType.DEFAULT}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
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

      {isExpanded && (
        <ExpandedPanel>
          <PanelSection>
            <SectionTitle>정렬</SectionTitle>
            <ButtonGroup>
              {sortOptions.map((sort) => (
                <FilterButton key={sort} type="button" data-active={filterOptions.sort === sort} onClick={() => handleSortClick(sort)}>
                  {sort}
                </FilterButton>
              ))}
            </ButtonGroup>
          </PanelSection>

          <PanelSection>
            <PanelHeader>
              <SectionTitle>장르</SectionTitle>
              <ResetButton type="button" onClick={handleResetClick}>
                초기화
              </ResetButton>
            </PanelHeader>
            <ButtonGroup>
              {ramenyaGenres.map((ramenyaGenre) => (
                <FilterButton
                  key={ramenyaGenre}
                  type="button"
                  data-active={ramenyaGenre === genre || filterOptions.genre.includes(ramenyaGenre)}
                  data-pinned={ramenyaGenre === genre}
                  onClick={() => handleGenreClick(ramenyaGenre)}
                >
                  {ramenyaGenre === genre && <IconPinned />}
                  {ramenyaGenre}
                </FilterButton>
              ))}
            </ButtonGroup>
          </PanelSection>
        </ExpandedPanel>
      )}
    </Wrapper>
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
  'font-14-r flex shrink-0 cursor-pointer items-center gap-2 rounded-[50px] border-0 bg-filter-background px-12 py-4 text-filter-text shadow-none outline-none data-[active=true]:bg-filter-active-background data-[active=true]:text-filter-active-text data-[pinned=true]:pl-8',
)

const ExpandedPanel = render.div('box-border flex w-full flex-col gap-14 border-0 border-t border-border border-solid px-20 py-16')

const PanelSection = render.div('flex flex-col gap-8')

const PanelHeader = render.div('flex items-center justify-between')

const SectionTitle = render.span('font-16-m text-black')

const ButtonGroup = render.div('flex flex-wrap gap-8')

const ResetButton = render.button('font-12-m cursor-pointer border-0 bg-transparent p-0 text-gray-500 underline')
