import { useParams } from "react-router-dom";
import NoStoreBox from "@/shared/ui/no-store-box";
import TopBar from "@/shared/ui/top-bar";
import { useScrollToTop } from "@/shared/lib/useScrollToTop";
import { useRamenyaGroupQuery } from "@/entities/curation/model";
import { Helmet } from "react-helmet";
import { RamenyaListView } from "@/widgets/ramenya/list-view";
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
          {ramenyaGroup?.descriptionImageUrl && (
            <HeaderImageSection>
              <HeaderImage src={ramenyaGroup.descriptionImageUrl} alt={ramenyaGroup.name} />
            </HeaderImageSection>
          )}
          <InformationWrapper>
            <RamenyaListView
              ramenyas={ramenyaList}
              emptyContent={<NoStoreBox />}
              centered
              dividerInset
              isReview={false}
            />
          </InformationWrapper>
        </Wrapper>
      </Layout>
    </>
  );
};

const Layout = render.section("flex justify-center h-full box-border");

const Wrapper = render.div("flex min-h-0 h-full w-390 flex-col");

const HeaderSectionWrapper = render.section("");

const HeaderSection = render.section(
  "fixed w-390 flex flex-col items-center font-16-sb bg-white border-0 border-x border-border border-solid box-border",
);

const HeaderImageSection = render.section("w-full shrink-0 pt-44");

const HeaderImage = render.img("block w-full h-auto");

const InformationWrapper = render.section("flex min-h-0 flex-1 flex-col overflow-y-auto");

export default GroupPage;
