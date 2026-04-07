import { useParams } from "react-router-dom";
import { useRamenyaListQuery } from "@/entities/ramenya/model";
import NoStoreBox from "@/shared/ui/no-store-box";
import TopBar from "@/shared/ui/top-bar";
import { useScrollToTop } from "@/shared/lib/use-scroll-to-top";
import { FilterOptions } from "@/entities/ramenya/model";
import { initialFilterOptions } from "@/entities/ramenya/model";
import { useSessionStorage } from "usehooks-ts";
import FilterSection from "@/widgets/ramenya/filter-section";
import { RamenyaListView } from "@/widgets/ramenya/list-view";
import render from "@/shared/ui/render";

export const LocationPage = () => {
  useScrollToTop();

  const { location } = useParams();

  const [filterOptions, setFilterOptions] = useSessionStorage<FilterOptions>(
    "locationPageFilterOptions",
    initialFilterOptions,
  );

  const { ramenyaListQuery } = useRamenyaListQuery({
    type: "region",
    value: location!,
    filterOptions: filterOptions,
  });

  return (
    <Layout>
      <Wrapper>
        <HeaderSection>
          <TopBar title={location || ""} />
          <FilterSection
            sessionStorageKey="locationPageFilterOptions"
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
          />
        </HeaderSection>

        <InformationWrapper>
          <RamenyaListView ramenyas={ramenyaListQuery.data} emptyContent={<NoStoreBox />} />
        </InformationWrapper>
      </Wrapper>
    </Layout>
  );
};

const Layout = render.section("flex justify-center h-full box-border");

const Wrapper = render.div("flex flex-col w-390 h-full");

const HeaderSection = render.section(
  "fixed w-390 flex flex-col items-center font-16-sb bg-white border-0 border-x border-border border-solid box-border",
);

const InformationWrapper = render.section("flex flex-col w-full h-full mt-84");

export default LocationPage;
