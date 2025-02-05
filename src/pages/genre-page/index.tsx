import { useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/useRamenyaListQuery.ts";

import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";
import styled from "@emotion/styled";
import TopBar from "../../components/common/TopBar.tsx";
import { Line } from "../../components/common/Line.tsx";
import { useScrollToTop } from "../../hooks/useScrollToTop.tsx";

export const GenrePage = () => {
  useScrollToTop();

  const { genre } = useParams();

  const ramenyaListQuery = useRamenyaListQuery({
    type: "genre",
    value: genre!,
  });
  const ramenyaList = ramenyaListQuery.data;

  return (
    <Layout>
      <Wrapper>
        <HeaderSectionWrapper>
          <HeaderSection>
            <TopBar title={genre || ""} />
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

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full overflow-y-auto
  pt-60
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
  ],
);

export default GenrePage;
