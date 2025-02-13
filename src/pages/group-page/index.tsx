import tw from "twin.macro";

import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";
import styled from "@emotion/styled";
import TopBar from "../../components/common/TopBar.tsx";
import { useScrollToTop } from "../../hooks/common/useScrollToTop.tsx";
import { useRamenyaGroupQuery } from "../../hooks/queries/useRamenyaGroupQuery";

export const GroupPage = () => {
  useScrollToTop();

  const { data: ramenyaGroup } = useRamenyaGroupQuery();
  const ramenyaList = ramenyaGroup?.[0]?.ramenyas;

  return (
    <Layout>
      <Wrapper>
        <HeaderSectionWrapper>
          <HeaderSection>
            <TopBar title={ramenyaGroup?.[0]?.name || ""} />
            <HeaderImage src={ramenyaGroup?.[0]?.descriptionImageUrl || ""} />
          </HeaderSection>
        </HeaderSectionWrapper>
        <InformationWrapper>
          {ramenyaList?.length === 0 ? (
            <NoStoreBox />
          ) : (
            <>
              <InformationHeader>가게 정보</InformationHeader>
              <RamenyaListWrapper isEmpty={ramenyaList?.length === 0}>
                {ramenyaList?.map((ramenya, index) => (
                  <>
                    <RamenyaCard key={ramenya._id} ramenya={ramenya} />
                    {index !== ramenyaList.length - 1 && <SubLine />}
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

const HeaderImage = tw.img`
  w-full h-78
`;

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full overflow-y-auto
  pt-132
`;

const InformationHeader = tw.span`
  px-20 font-14-sb self-start
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

export default GroupPage;
