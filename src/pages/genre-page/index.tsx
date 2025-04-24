import { useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/queries/useRamenyaListQuery";

import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";
import styled from "@emotion/styled";
import TopBar from "../../components/common/TopBar.tsx";
import { useScrollToTop } from "../../hooks/common/useScrollToTop.tsx";
import { useMemo, useState } from "react";
import { IconFilterWithOrder } from "../../components/Icon/index.tsx";
import { useLocationStore } from "../../store/location/useLocationStore.ts";
import { calculateDistanceValue } from "../../util/number.ts";

export const GenrePage = () => {
  useScrollToTop();

  const { genre } = useParams();

  const ramenyaListQuery = useRamenyaListQuery({
    type: "genre",
    value: genre!,
  });

  const { current } = useLocationStore();
  const [filterType, setFilterType] = useState<"distance" | "rating">(
    "distance"
  );

  const ramenyaList = ramenyaListQuery.data;

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

  return (
    <Layout>
      <Wrapper>
        <HeaderSectionWrapper>
          <HeaderSection>
            <TopBar title={genre || ""} />
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
                  <StyledIconFilter />
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
                {filteredRamenyaList?.map((ramenya, index) => (
                  <>
                    <RamenyaCard key={ramenya._id} ramenya={ramenya} />
                    {index !== filteredRamenyaList.length - 1 && <SubLine />}
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

const RamenyaListHeader = tw.div`
  flex justify-between
  w-full px-20
  bg-white
  box-border
`;

const StyledIconFilter = tw(IconFilterWithOrder)`
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

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full overflow-y-auto box-border
  pt-60
`;

const InformationHeader = tw.span`
  font-14-sb box-border
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(
  ({ isEmpty }) => [
    tw`flex flex-col items-center justify-center w-full`,
    isEmpty && tw`h-full`,
  ]
);

export default GenrePage;
