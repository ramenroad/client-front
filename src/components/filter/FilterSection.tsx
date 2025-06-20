import { FilterOptions, SortType } from "../../types/filter";
import { initialFilterOptions } from "../../constants";
import tw from "twin.macro";
import { IconFilterWithTag } from "../Icon";
import { usePopup } from "../../hooks/common/usePopup";
import { PopupType } from "../../types";
import { useMemo } from "react";
import { Line } from "../common/Line";
import styled from "@emotion/styled";

interface FilterSectionProps {
  sessionStorageKey: string;
  filterOptions: FilterOptions;
  onFilterChange: (filterOptions: FilterOptions) => void;
}

const FilterSection = (props: FilterSectionProps) => {
  const { filterOptions, onFilterChange } = props;
  const { openPopup } = usePopup();

  const filterCount = useMemo(() => {
    let count = 0;
    if (filterOptions.isOpen) count++;
    if (filterOptions.sort !== SortType.DEFAULT) count++;
    count += filterOptions.genre.length;
    return count;
  }, [filterOptions]);

  return (
    <FilterWrapper>
      <RelativeWrapper>
        <StyledIconFilter
          onClick={() =>
            openPopup(PopupType.FILTER, {
              initialFilterOptions: initialFilterOptions,
              currentFilterOptions: filterOptions,
              onChange: (filterOptions: FilterOptions | null) => {
                if (filterOptions) {
                  onFilterChange(filterOptions);
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
        onClick={() => {
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
          });
        }}
      >
        {filterOptions.sort}
      </FilterButton>
      {filterOptions.genre?.length > 0 && (
        <>
          <Divider vertical />
          {filterOptions.genre.map((genre) => (
            <FilterButton key={genre} active>
              {genre}
            </FilterButton>
          ))}
        </>
      )}
    </FilterWrapper>
  );
};

const FilterWrapper = tw.section`
  flex flex-nowrap items-center
  box-border px-20 gap-8 w-full pt-11
  overflow-x-auto scrollbar-hide
  whitespace-nowrap
  box-border
`;

const RelativeWrapper = tw.div`
  relative flex-shrink-0 box-border
  h-30
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

interface FilterButtonProps {
  active?: boolean;
}

const FilterButton = styled.button<FilterButtonProps>(({ active }) => [
  tw`
      px-12 py-4 rounded-50 font-14-r border-none cursor-pointer
      bg-filter-background text-filter-text
      flex-shrink-0 inline-block
    `,
  active && tw`bg-filter-active-background text-filter-active-text`,
]);

export default FilterSection;
