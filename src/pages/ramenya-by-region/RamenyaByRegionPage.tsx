import { useParams } from "react-router-dom";
import { useRamenyaListQuery } from "@/entities/ramenya/model";
import styled from "@emotion/styled";
import RamenyaCard from "@/entities/ramenya/ui";
import NoStoreBox from "@/shared/ui/no-store-box";
import TopBar from "@/shared/ui/top-bar";
import { useScrollToTop } from "@/shared/lib/use-scroll-to-top";
import { FilterOptions } from "@/entities/ramenya/model";
import { initialFilterOptions } from "@/entities/ramenya/model";
import { useSessionStorage } from "usehooks-ts";
import FilterSection from "@/widgets/ramenya/filter-section";
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
          {ramenyaListQuery.data?.length === 0 ? (
            <NoStoreBox />
          ) : (
            <>
              <RamenyaListWrapper isEmpty={ramenyaListQuery.data?.length === 0}>
                {ramenyaListQuery.data?.map((ramenya) => (
                  <>
                    <RamenyaCard
                      key={ramenya._id}
                      _id={ramenya._id}
                      name={ramenya.name}
                      thumbnailUrl={ramenya.thumbnailUrl}
                      reviewCount={ramenya.reviewCount}
                      rating={ramenya.rating}
                      address={ramenya.address}
                      businessHours={ramenya.businessHours}
                      genre={ramenya.genre}
                      latitude={ramenya.latitude}
                      longitude={ramenya.longitude}
                    />
                    <SubLine />
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

const Layout = render.section("flex justify-center h-full box-border");

const Wrapper = render.div("flex flex-col w-390 h-full");

export const HeaderSectionWrapper = render.section("");

export const HeaderSection = render.section(
  "fixed w-390 flex flex-col items-center font-16-sb bg-white border-0 border-x border-border border-solid box-border",
);

const SubLine = render.div("w-full h-1 bg-border box-border");

const InformationWrapper = render.section("flex flex-col w-full h-full mt-84");

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(({ isEmpty }) => [
  {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  isEmpty && {
    height: "100%",
  },
]);

export default LocationPage;
