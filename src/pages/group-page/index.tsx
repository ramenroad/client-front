import tw from "twin.macro";
import { useParams } from "react-router-dom";
import RamenyaCard from "../../components/common/RamenyaCard.tsx";
import NoStoreBox from "../../components/common/NoStoreBox.tsx";
import styled from "@emotion/styled";
import TopBar from "../../components/common/TopBar.tsx";
import { useScrollToTop } from "../../hooks/common/useScrollToTop.tsx";
import { useRamenyaGroupQuery } from "../../hooks/queries/useRamenyaGroupQuery";
import { Helmet } from "react-helmet";

export const GroupPage = () => {
  const { id } = useParams();
  useScrollToTop();

  const { data: ramenyaGroupList } = useRamenyaGroupQuery();

  const ramenyaGroup = ramenyaGroupList?.find((group) => group._id === id);
  const ramenyaList = ramenyaGroup?.ramenyas;

  return (
    <>
      <Helmet>
        <title>{ramenyaGroup?.name}</title>
        <meta name="description" content={ramenyaGroup?.description} />
      </Helmet>
      <Layout>
        <Wrapper>
          <HeaderSectionWrapper>
            <HeaderSection>
              <TopBar title={ramenyaGroup?.name || ""} />
            </HeaderSection>
          </HeaderSectionWrapper>
          <HeaderImage src={ramenyaGroup?.descriptionImageUrl || ""} />
          <InformationWrapper>
            {ramenyaList?.length === 0 ? (
              <NoStoreBox />
            ) : (
              <>
                <RamenyaListWrapper isEmpty={ramenyaList?.length === 0}>
                  {ramenyaList?.map((ramenya, index) => (
                    <>
                      <RamenyaCard key={ramenya._id} {...ramenya} isReview={false} />
                      {index !== ramenyaList.length - 1 && <SubLine />}
                    </>
                  ))}
                </RamenyaListWrapper>
              </>
            )}
          </InformationWrapper>
        </Wrapper>
      </Layout>
    </>
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
  w-full h-78 pt-44
`;

const SubLine = tw.div`
  w-full h-1 bg-border box-border mx-20
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full overflow-y-auto pt-10
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(({ isEmpty }) => [
  tw`flex flex-col items-center justify-center w-full`,
  isEmpty && tw`h-full`,
]);

export default GroupPage;
