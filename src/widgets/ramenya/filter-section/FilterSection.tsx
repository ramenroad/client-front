import { useMemo } from "react";
import styled from "@emotion/styled";
import { FilterOptions, initialFilterOptions, RamenyaType, SortType } from "@/entities/ramenya/model";
import { PopupType } from "@/shared/model/popup";
import { usePopup } from "@/shared/lib/use-popup";
import { IconFilterWithTag } from "@/shared/ui/icon";
import { Line } from "@/shared/ui/line";
import render from "@/shared/ui/render";

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

const FilterWrapper = render.section(
  "flex flex-nowrap items-center box-border px-20 gap-8 w-full py-11 overflow-x-auto scrollbar-hide whitespace-nowrap box-border",
);

const RelativeWrapper = render.div("relative flex-shrink-0 box-border h-30");

const StyledIconFilter = render.extend(IconFilterWithTag, "cursor-pointer");

const FilterCount = render.div(
  "absolute top-[-4px] right-0 w-14 h-14 flex items-center justify-center rounded-full bg-orange text-white text-[9px]",
);

const Divider = render.extend(Line, "h-18");

const FilterButton = styled.button<{ active?: boolean }>(({ active }) => [
  {
    padding: "4px 12px",
    borderRadius: "50px",
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 400,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#f6f6f6",
    color: "#a0a0a0",
    flexShrink: 0,
    display: "inline-block",
  },
  active && {
    backgroundColor: "#fff4eb",
    color: "#ff5e00",
  },
]);

export default FilterSection;
