import { useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/queries/useRamenyaListQuery";
import { useMemo } from "react";

import styled from "@emotion/styled";
import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";
import TopBar from "../../components/common/TopBar.tsx";
import { useScrollToTop } from "../../hooks/common/useScrollToTop.tsx";
import { useLocationStore } from "../../store/location/useLocationStore.ts";
import { calculateDistanceValue } from "../../util/number.ts";
import { usePopup } from "../../hooks/common/usePopup.ts";
import { PopupType } from "../../types/index.ts";
import { FilterOptions, SortType } from "../../types/filter/index.ts";
import { IconFilterWithTag } from "../../components/Icon/index.tsx";
import { initialFilterOptions } from "../../constants/index.ts";
import { useSessionStorage } from "usehooks-ts";

export const LocationPage = () => {
  useScrollToTop();

  const { openPopup } = usePopup();
  const { location } = useParams();

  const ramenyaListQuery = useRamenyaListQuery({
    type: "region",
    value: location!,
  });

  const { current } = useLocationStore();
  const [filterOptions, setFilterOptions] = useSessionStorage<FilterOptions>(
    "locationPageFilterOptions",
    initialFilterOptions
  );

  const filterCount = useMemo(() => {
    let count = 0;
    if (filterOptions.isOpen) count++;
    if (filterOptions.sort !== SortType.DEFAULT) count++;
    count += filterOptions.genre.length;
    return count;
  }, [filterOptions]);

  const ramenyaList = useMemo(() => {
    if (!ramenyaListQuery.data) return [];

    // 1. 장르 필터링
    let filtered = ramenyaListQuery.data;
    if (filterOptions.genre.length > 0) {
      filtered = filtered.filter((ramenya) =>
        filterOptions.genre.every((selectedGenre) =>
          ramenya.genre.includes(selectedGenre)
        )
      );
    }

    // 2. 정렬
    if (filterOptions.sort === SortType.DISTANCE) {
      if (current.latitude === 0 || current.longitude === 0) {
        return filtered;
      }

      return [...filtered].sort(
        (a, b) =>
          calculateDistanceValue(current, {
            latitude: a.latitude,
            longitude: a.longitude,
          }) -
          calculateDistanceValue(current, {
            latitude: b.latitude,
            longitude: b.longitude,
          })
      );
    }

    // 평점 순 정렬
    return [...filtered].sort((a, b) => b.rating - a.rating);
  }, [ramenyaListQuery.data, filterOptions.genre, filterOptions.sort, current]);

  return (
    <Layout>
      <Wrapper>
        <HeaderSectionWrapper>
          <HeaderSection>
            <TopBar title={location || ""} />
            <FilterWrapper>
              <RelativeWrapper>
                <StyledIconFilter
                  onClick={() =>
                    openPopup(PopupType.FILTER, {
                      initialFilterOptions: initialFilterOptions,
                      currentFilterOptions: filterOptions,
                      onChange: (filterOptions: FilterOptions | null) => {
                        if (filterOptions) {
                          setFilterOptions(filterOptions);
                          return;
                        }
                        setFilterOptions(initialFilterOptions);
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
                  setFilterOptions((prev) => ({
                    ...prev,
                    isOpen: !prev.isOpen,
                  }));
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
                        setFilterOptions((prev) => ({
                          ...prev,
                          sort: sortOption,
                        }));
                        return;
                      }
                      setFilterOptions(initialFilterOptions);
                    },
                  });
                }}
              >
                {filterOptions.sort}
              </FilterButton>
              {filterOptions.genre?.length > 0 && (
                <>
                  <Divider />
                  {filterOptions.genre.map((genre) => (
                    <FilterButton key={genre} active>
                      {genre}
                    </FilterButton>
                  ))}
                </>
              )}
            </FilterWrapper>
          </HeaderSection>
        </HeaderSectionWrapper>

        <InformationWrapper>
          {ramenyaList?.length === 0 ? (
            <NoStoreBox />
          ) : (
            <>
              <RamenyaListWrapper isEmpty={ramenyaList?.length === 0}>
                {ramenyaList?.map((ramenya) => (
                  <>
                    <RamenyaCard key={ramenya._id} ramenya={ramenya} />
                    <SubLine />
                  </>
                ))}
              </RamenyaListWrapper>
            </>
          )}
        </InformationWrapper>
      </Wrapper>
    </Layout>
  );
};

const Layout = tw.section`
  flex justify-center h-full box-border
`;

const Wrapper = tw.div`
  flex flex-col
  w-390 h-full 
`;

export const HeaderSectionWrapper = tw.section`
`;

export const HeaderSection = tw.section`
  fixed w-390
  flex flex-col items-center
  font-16-sb
  bg-white
  border-0 border-x border-border border-solid box-border
`;

const FilterWrapper = tw.section`
  flex flex-nowrap items-center
  box-border h-30 mt-11 mb-20 px-20 gap-8 w-full 
  overflow-x-auto overflow-y-hidden scrollbar-hide
  whitespace-nowrap
  box-border
`;

const StyledIconFilter = tw(IconFilterWithTag)`
  cursor-pointer
`;

const SubLine = tw.div`
  w-full h-1 bg-border box-border
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full mt-84
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

const RelativeWrapper = tw.div`
  relative flex-shrink-0 box-border
  h-30
`;

const FilterCount = tw.div`
  absolute top-0 right-0 w-14 h-14
  flex items-center justify-center
  rounded-full bg-orange text-white
  text-9
`;

const Divider = tw.div`
  w-1 h-24 bg-border box-border flex-shrink-0 inline-block
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(
  ({ isEmpty }) => [tw`flex flex-col w-full`, isEmpty && tw`h-full`]
);

export default LocationPage;
