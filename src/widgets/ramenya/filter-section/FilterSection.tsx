import { useMemo } from "react";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { FilterOptions, initialFilterOptions, RamenyaType, SortType } from "@/entities/ramenya/model";
import { PopupType } from "@/shared/model/popup";
import { usePopup } from "@/shared/lib/use-popup";
import { IconFilterWithTag } from "@/shared/ui/icon";
import { Line } from "@/shared/ui/line";

interface FilterSectionProps {
  sessionStorageKey: string;
  filterOptions: FilterOptions;
  onFilterChange: (filterOptions: FilterOptions) => void;
  genre?: RamenyaType;
}

const FilterSection = ({ filterOptions, onFilterChange, genre }: FilterSectionProps) => {
  const { openPopup } = usePopup();

  const filterCount = useMemo(() => {
    let count = 0;
    if (filterOptions.isOpen) count += 1;
    if (filterOptions.sort !== SortType.DEFAULT) count += 1;
    if (genre) count += 1;
    return count;
  }, [filterOptions.isOpen, filterOptions.sort, genre]);

  return (
    <FilterWrapper>
      <RelativeWrapper>
        <StyledIconFilter
          onClick={() =>
            openPopup(PopupType.FILTER, {
              initialFilterOptions,
              currentFilterOptions: filterOptions,
              pinned: genre,
              onChange: (nextFilterOptions: FilterOptions | null) => {
                if (nextFilterOptions) {
                  onFilterChange(nextFilterOptions);
                  return;
                }
                onFilterChange(initialFilterOptions);
              },
            })
          }
          color={filterCount === 0 ? "black" : "#FF5E00"}
        />
        {filterCount > 1 && <FilterCount>{filterCount}</FilterCount>}
      </RelativeWrapper>
      <FilterButton
        active={filterOptions.isOpen}
        onClick={() => {
          onFilterChange({
            ...filterOptions,
            isOpen: !filterOptions.isOpen,
          });
        }}
      >
        영업중
      </FilterButton>
      <FilterButton
        active
        onClick={() =>
          openPopup(PopupType.SORT, {
            sortOption: filterOptions.sort,
            onChange: (sortOption: SortType | null) => {
              if (sortOption) {
                onFilterChange({
                  ...filterOptions,
                  sort: sortOption,
                });
                return;
              }
              onFilterChange(initialFilterOptions);
            },
          })
        }
      >
        {filterOptions.sort}
      </FilterButton>
      {filterOptions.genre?.length > 0 && (
        <>
          <Divider vertical />
          {filterOptions.genre.map((filterGenre) => (
            <FilterButton key={filterGenre} active>
              {filterGenre}
            </FilterButton>
          ))}
        </>
      )}
    </FilterWrapper>
  );
};

const FilterWrapper = tw.section`
  flex flex-nowrap items-center
  box-border px-20 gap-8 w-full py-11
  overflow-x-auto scrollbar-hide
  whitespace-nowrap box-border
`;

const RelativeWrapper = tw.div`
  relative flex-shrink-0 box-border h-30
`;

const StyledIconFilter = tw(IconFilterWithTag)`
  cursor-pointer
`;

const FilterCount = tw.div`
  absolute top-[-4px] right-0 w-14 h-14
  flex items-center justify-center
  rounded-full bg-orange text-white
  text-9
`;

const Divider = tw(Line)`
  h-18
`;

const FilterButton = styled.button<{ active?: boolean }>(({ active }) => [
  tw`
    px-12 py-4 rounded-50 font-14-r border-none cursor-pointer
    bg-filter-background text-filter-text
    flex-shrink-0 inline-block
  `,
  active && tw`bg-filter-active-background text-filter-active-text`,
]);

export default FilterSection;
