import { useParams } from "react-router-dom";
import tw from "twin.macro";
import { useRamenyaListQuery } from "../../hooks/queries/useRamenyaListQuery";
import RamenyaCard from "../../components/ramenya-card/RamenyaCard.tsx";
import NoStoreBox from "../../components/no-data/NoStoreBox.tsx";
import styled from "@emotion/styled";
import TopBar from "../../components/top-bar/index.tsx";
import { useScrollToTop } from "../../hooks/common/useScrollToTop.tsx";
import { FilterOptions } from "../../types/filter/index.ts";
import { initialFilterOptions, RamenyaType } from "../../constants/index.ts";
import { useSessionStorage } from "usehooks-ts";
import FilterSection from "../../components/filter/FilterSection.tsx";

export const GenrePage = () => {
  useScrollToTop();

  const { genre } = useParams();

  const [filterOptions, setFilterOptions] = useSessionStorage<FilterOptions>(
    "genrePageFilterOptions",
    initialFilterOptions,
  );

  const { ramenyaListQuery } = useRamenyaListQuery({
    type: "genre",
    value: genre!,
    filterOptions: filterOptions,
  });

  return (
    <Layout>
      <Wrapper>
        <HeaderContainer>
          <TopBar title={genre || ""} />

          {/* 필터 영역 */}
          <FilterSection
            sessionStorageKey="genrePageFilterOptions"
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
            genre={genre as RamenyaType}
          />
        </HeaderContainer>

        {/* 라멘야 리스트 영역 */}
        <InformationWrapper>
          {ramenyaListQuery.data?.length === 0 ? (
            <NoStoreBox />
          ) : (
            <>
              <RamenyaListWrapper isEmpty={ramenyaListQuery.data?.length === 0}>
                {ramenyaListQuery.data?.map((ramenya, index) => (
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
                    {index !== ramenyaListQuery.data.length - 1 && <SubLine />}
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

export const HeaderContainer = tw.section`
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
  flex flex-col w-full h-full overflow-y-auto box-border
  mt-84
`;

interface RamenyaListWrapperProps {
  isEmpty?: boolean;
}

const RamenyaListWrapper = styled.div<RamenyaListWrapperProps>(({ isEmpty }) => [
  tw`flex flex-col items-center justify-center w-full`,
  isEmpty && tw`h-full`,
]);

export default GenrePage;
