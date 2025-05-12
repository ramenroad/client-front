import { useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/queries/useRamenyaListQuery";
import { useMemo, useState } from "react";
import { IconFilterWithOrder, IconFilterWithTag } from "../../components/Icon";
import styled from "@emotion/styled";
import { RAMENYA_TYPES } from "../../constants";
import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";
import TopBar from "../../components/common/TopBar.tsx";
import { Line } from "../../components/common/Line.tsx";
import { useScrollToTop } from "../../hooks/common/useScrollToTop.tsx";
import { useLocationStore } from "../../store/location/useLocationStore.ts";
import { calculateDistanceValue } from "../../util/number.ts";
import { usePopup } from "../../hooks/common/usePopup.ts";
import { PopupType } from "../../types/index.ts";

export const LocationPage = () => {
  useScrollToTop();

  const { openPopup } = usePopup();
  const { location } = useParams();

  const ramenyaListQuery = useRamenyaListQuery({
    type: "region",
    value: location!,
  });

  const [selectedFilterList, setSelectedFilterList] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<"distance" | "rating">(
    "distance"
  );
  const { current } = useLocationStore();

  const ramenyaList = useMemo(() => {
    if (selectedFilterList.length === 0) {
      return ramenyaListQuery.data;
    }

    return ramenyaListQuery.data?.filter((ramenya) =>
      ramenya.genre.some((genre) => selectedFilterList.includes(genre))
    );
  }, [selectedFilterList, ramenyaListQuery.data]);

  const filteredRamenyaList = useMemo(() => {
    if (filterType === "distance") {
      if (current.latitude === 0 || current.longitude === 0) {
        return ramenyaList;
      }
      return ramenyaList?.sort(
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
    return ramenyaList?.sort((a, b) => b.rating - a.rating);
  }, [current, filterType, ramenyaList]);

  const handleFilterClick = (type: string) => {
    if (selectedFilterList.includes(type)) {
      setSelectedFilterList((prev) =>
        prev.filter((prevType) => prevType !== type)
      );
    } else {
      setSelectedFilterList((prev) => [...prev, type]);
    }
  };

  return (
    <Layout>
      <Wrapper>
        <HeaderSectionWrapper>
          <HeaderSection>
            <TopBar title={location || ""} />
            <FilterWrapper>
              <StyledIconFilter
                // onClick={() => setSelectedFilterList([])}
                onClick={() => openPopup(PopupType.FILTER)}
                color={selectedFilterList.length >= 1 ? "#FF5E00" : "black"}
              />
              <TagWrapper>
                <TagList>
                  <OverflowBox>
                    {RAMENYA_TYPES.map((type, index) => {
                      if (index > 5) return;
                      return (
                        <Tag
                          key={index}
                          onClick={() => handleFilterClick(type)}
                          selected={selectedFilterList.includes(type)}
                        >
                          {type}
                        </Tag>
                      );
                    })}
                  </OverflowBox>
                </TagList>
                <TagList>
                  <OverflowBox>
                    {RAMENYA_TYPES.map((type, index) => {
                      if (index <= 5) return;
                      return (
                        <Tag
                          key={index}
                          onClick={() => handleFilterClick(type)}
                          selected={selectedFilterList.includes(type)}
                        >
                          {type}
                        </Tag>
                      );
                    })}
                  </OverflowBox>
                </TagList>
              </TagWrapper>
            </FilterWrapper>
            <Line />
          </HeaderSection>
        </HeaderSectionWrapper>

        <InformationWrapper>
          {ramenyaList?.length === 0 ? (
            <NoStoreBox />
          ) : (
            <>
              <RamenyaListHeader>
                <InformationHeader>가게 정보</InformationHeader>
                <FilterButtonContainer>
                  <StyledIconOrderFilter />
                  <FilterButtonWrapper>
                    <FilterButtonText
                      isActive={filterType === "distance"}
                      onClick={() => setFilterType("distance")}
                    >
                      거리순
                    </FilterButtonText>
                    <FilterButtonText
                      isActive={filterType === "rating"}
                      onClick={() => setFilterType("rating")}
                    >
                      평점순
                    </FilterButtonText>
                  </FilterButtonWrapper>
                </FilterButtonContainer>
              </RamenyaListHeader>
              <RamenyaListWrapper isEmpty={ramenyaList?.length === 0}>
                {filteredRamenyaList?.map((ramenya) => (
                  <>
                    <RamenyaCard key={ramenya._id} ramenya={ramenya} />
                    <SubLine />
                  </>
                ))}
              </RamenyaListWrapper>
            </>
          )}
        </InformationWrapper>

        {/*<div onClick={() => navigate("/detail/라멘야1")}>디테일페이지</div>*/}
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
  flex
  box-border h-100 pl-20 pt-20 py-16 gap-8 w-full pr-2
`;

const RamenyaListHeader = tw.div`
  flex justify-between
  w-full px-20
  bg-white
  box-border
`;

const StyledIconFilter = tw(IconFilterWithTag)`
  cursor-pointer
`;

const StyledIconOrderFilter = tw(IconFilterWithOrder)`
  mr-2
`;

const FilterButtonContainer = tw.div`
  flex flex-row items-center box-border justify-end
  font-14-sb
  flex-1
  bg-white
  select-none
`;

const FilterButtonWrapper = tw.div`
  flex flex-row items-center gap-8
`;

const FilterButtonText = styled.span<{ isActive: boolean }>(({ isActive }) => [
  tw`cursor-pointer`,
  !isActive && tw`text-gray-400`,
]);

const TagWrapper = tw.div`
  flex overflow-x-auto gap-8 flex-1 scrollbar-hide flex-col box-border
`;

const TagList = tw.div`
  flex flex-col gap-8
`;

const OverflowBox = tw.div`
  flex gap-8
`;

const Tag = styled.div(({ selected }: { selected?: boolean }) => [
  tw`
  px-12 py-5 h-28 overflow-hidden select-none
  border border-solid border-gray-200 box-border rounded-full 
  font-14-r cursor-pointer 
  flex items-center justify-center flex-shrink-0`,
  selected && tw`border-orange text-orange`,
]);

const SubLine = tw.div`
  w-full h-1 bg-border box-border
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full mt-160
`;

const InformationHeader = tw.span`
  font-14-sb self-start text-gray-900
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(
  ({ isEmpty }) => [tw`flex flex-col w-full`, isEmpty && tw`h-full`]
);

export default LocationPage;
