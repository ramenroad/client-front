import { useParams } from "react-router-dom";
import { useRamenyaListQuery } from "@/entities/ramenya/model";
import RamenyaCard from "@/entities/ramenya/ui";
import NoStoreBox from "@/shared/ui/no-store-box";
import styled from "@emotion/styled";
import TopBar from "@/shared/ui/top-bar";
import { useScrollToTop } from "@/shared/lib/use-scroll-to-top";
import { FilterOptions } from "@/entities/ramenya/model";
import { genreDescriptions, initialFilterOptions, RamenyaType } from "@/entities/ramenya/model";
import { useSessionStorage } from "usehooks-ts";
import FilterSection from "@/widgets/ramenya/filter-section";
import { IconTooltip } from "@/shared/ui/icon";
import Tooltip from "@/shared/ui/tooltip";
import render from "@/shared/ui/render";

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
          <TopBar
            title={genre || ""}
            tooltip={
              <Tooltip content={genreDescriptions[genre as RamenyaType]}>
                <IconTooltip />
              </Tooltip>
            }
          />

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

const Layout = render.section("flex justify-center h-full box-border");

const Wrapper = render.div("flex flex-col w-390 h-full");

export const HeaderContainer = render.section(
  "fixed w-390 flex flex-col items-center font-16-sb bg-white border-0 border-x border-border border-solid box-border",
);

const SubLine = render.div("w-full h-1 bg-border box-border mx-20");

const InformationWrapper = render.section("flex flex-col w-full h-full overflow-y-auto box-border mt-84");

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

export default GenrePage;
