import { useNavigate, useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/useRamenyaListQuery.ts";
import { useEffect, useMemo, useState } from "react";
import { IconBack, IconFilter } from "../../components/Icon";
import styled from "@emotion/styled";
import { RAMENYA_TYPES } from "../../constants";
import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";

export const LocationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const ramenyaListQuery = useRamenyaListQuery({
    type: "region",
    value: location!,
  });

  const [selectedFilterList, setSelectedFilterList] = useState<string[]>([]);

  const ramenyaList = useMemo(() => {
    if (selectedFilterList.length === 0) {
      return ramenyaListQuery.data;
    }

    return ramenyaListQuery.data?.filter((ramenya) =>
      ramenya.genre.some((genre) => selectedFilterList.includes(genre)),
    );
  }, [selectedFilterList, ramenyaListQuery.data]);

  const handleFilterClick = (type: string) => {
    if (selectedFilterList.includes(type)) {
      setSelectedFilterList((prev) =>
        prev.filter((prevType) => prevType !== type),
      );
    } else {
      setSelectedFilterList((prev) => [...prev, type]);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Layout>
      <Wrapper>
        <HeaderSectionWrapper>
          <HeaderSection>
            <LocationTopBar>
              <IconWrapper>
                <StyledIconBack onClick={() => navigate(-1)} />
              </IconWrapper>
              <span>{location}</span>
            </LocationTopBar>
            <FilterWrapper>
              <StyledIconFilter
                onClick={() => setSelectedFilterList([])}
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
              <InformationHeader>가게 정보</InformationHeader>
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

        {/*<div onClick={() => navigate("/detail/라멘야1")}>디테일페이지</div>*/}
      </Wrapper>
    </Layout>
  );
};

const Layout = tw.section`
  flex justify-center h-full box-border
`;

const Wrapper = tw.div`
  flex flex-col items-center box-border
  w-390 h-full
  border-0 border-x border-border border-solid
`;

const HeaderSectionWrapper = tw.section`
  absolute left-0
`;

const HeaderSection = tw.section`
  fixed 
  flex flex-col items-center
  font-16-sb
  w-390 h-144
  bg-white box-border border-0 border-x border-border border-solid
`;

const LocationTopBar = tw.section`
  flex items-center justify-between
  h-44
`;

const IconWrapper = tw.div`
  absolute left-20
  w-24 h-24
`;

const FilterWrapper = tw.section`
  flex
  box-border h-100 pl-20 pt-20 py-16 gap-8 w-full pr-2
`;

const StyledIconFilter = tw(IconFilter)`
  cursor-pointer
`;

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

const Line = tw.div`
  w-full h-1 bg-divider
`;

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full mt-160
`;

const InformationHeader = tw.span`
  px-20 font-14-sb self-start text-gray-900
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(
  ({ isEmpty }) => [
    tw`flex flex-col items-center justify-center w-full`,
    isEmpty && tw`h-full`,
  ],
);

const StyledIconBack = tw(IconBack)`
  cursor-pointer
`;

export default LocationPage;
