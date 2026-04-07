import { useParams } from "react-router-dom";
import RamenyaCard from "@/entities/ramenya/ui";
import NoStoreBox from "@/shared/ui/no-store-box";
import styled from "@emotion/styled";
import TopBar from "@/shared/ui/top-bar";
import { useScrollToTop } from "@/shared/lib/use-scroll-to-top";
import { useRamenyaGroupQuery } from "@/entities/curation/model";
import { Helmet } from "react-helmet";
import render from "@/shared/ui/render";

export const GroupPage = () => {
  const { id } = useParams();
  useScrollToTop();

  const { ramenyaGroupQuery } = useRamenyaGroupQuery();
  const { data: ramenyaGroupList } = ramenyaGroupQuery;

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

const Layout = render.section("flex justify-center h-full box-border");

const Wrapper = render.div("flex flex-col w-390 h-full");

export const HeaderSectionWrapper = render.section("");

export const HeaderSection = render.section(
  "fixed w-390 flex flex-col items-center font-16-sb bg-white border-0 border-x border-border border-solid box-border",
);

const HeaderImage = render.img("w-full h-78 pt-44");

const SubLine = render.div("w-full h-1 bg-border box-border mx-20");

const InformationWrapper = render.section("flex flex-col w-full h-full overflow-y-auto");

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(({ isEmpty }) => [
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  isEmpty && {
    height: "100%",
  },
]);

export default GroupPage;
