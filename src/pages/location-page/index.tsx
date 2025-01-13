import { useNavigate, useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/useRamenyaListQuery.ts";
import { useMemo, useState } from "react";
import { IconBack, IconFilter } from "../../components/Icons";
import styled from "@emotion/styled";
import { RAMENYA_TYPES } from "../../constants";
import RamenyaCard from "./RamenyaCard.tsx";

export const LocationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const ramenyaListQuery = useRamenyaListQuery(location);

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

  return (
    <Layout>
      <Wrapper>
        <Header>
          <IconWrapper>
            <StyledIconBack onClick={() => navigate(-1)} />
          </IconWrapper>
          <span>{location}</span>
        </Header>
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
        <InformationWrapper>
          <InformationHeader>가게 정보</InformationHeader>
          <RamenyaListWrapper>
            {ramenyaList?.map((ramenya) => (
              <>
                <RamenyaCard key={ramenya._id} ramenya={ramenya} />
                <SubLine />
              </>
            ))}
          </RamenyaListWrapper>
        </InformationWrapper>
        {/*<div onClick={() => navigate("/detail/라멘야1")}>디테일페이지</div>*/}
      </Wrapper>
    </Layout>
  );
};

const Layout = tw.section`
  flex justify-center h-screen overflow-hidden box-border
`;

const Wrapper = tw.div`
  flex flex-col items-center box-border
  w-390 h-full
  border-0 border-x border-border border-solid
  overflow-hidden
`;

const Header = tw.section`
  flex items-center justify-center
  font-16-sb
  w-full h-44 min-h-44 relative
  px-20 mb-10 box-border
`;

const IconWrapper = tw.div`
  absolute left-20
  w-24 h-24
`;

const FilterWrapper = tw.section`
  box-border pl-20 flex gap-8 w-full
`;

const StyledIconFilter = tw(IconFilter)`
  cursor-pointer
`;

const TagWrapper = tw.div`
  flex overflow-x-auto gap-8 flex-1 scrollbar-hide flex-col
`;

const TagList = tw.div`
  flex flex-col gap-8
`;

const OverflowBox = tw.div`
  flex gap-8
`;

const Tag = styled.div(({ selected }: { selected?: boolean }) => [
  tw`
  px-12 h-29 overflow-hidden select-none
  border border-solid border-gray-200 box-border rounded-full 
  font-14-r cursor-pointer 
  flex items-center justify-center flex-shrink-0`,
  selected && tw`border-orange text-orange`,
]);

const Line = tw.div`
  w-full h-1 bg-divider mt-16
`;

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const InformationWrapper = tw.section`
  flex flex-col w-full overflow-y-auto flex-1
`;

const InformationHeader = tw.span`
  px-20 mt-16 mb-[-8px] font-14-sb self-start text-gray-900
`;

const RamenyaListWrapper = tw.section`
  flex flex-col items-center justify-center w-full
`;

const StyledIconBack = tw(IconBack)`
  cursor-pointer
`;

export default LocationPage;
