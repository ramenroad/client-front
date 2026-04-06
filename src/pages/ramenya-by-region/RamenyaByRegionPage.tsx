import { useParams } from "react-router-dom";
import tw from "twin.macro";
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
  w-full h-1 bg-border box-border
`;

const InformationWrapper = tw.section`
  flex flex-col w-full h-full mt-84
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(({ isEmpty }) => [
  tw`flex flex-col w-full`,
  isEmpty && tw`h-full`,
]);

export default LocationPage;
