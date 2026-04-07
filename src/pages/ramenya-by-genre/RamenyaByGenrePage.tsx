import { useParams } from "react-router-dom";
import { useRamenyaListQuery } from "@/entities/ramenya/model";
import NoStoreBox from "@/shared/ui/no-store-box";
import TopBar from "@/shared/ui/top-bar";
import { useScrollToTop } from "@/shared/lib/useScrollToTop";
import { FilterOptions } from "@/entities/ramenya/model";
import { genreDescriptions, initialFilterOptions, RamenyaType } from "@/entities/ramenya/model";
import { useSessionStorage } from "usehooks-ts";
import { RamenyaListView } from "@/widgets/ramenya/list-view";
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
          <RamenyaListView ramenyas={ramenyaListQuery.data} emptyContent={<NoStoreBox />} centered dividerInset />
        </InformationWrapper>
      </Wrapper>
    </Layout>
  );
};

const Layout = render.section("flex justify-center h-full box-border");

const Wrapper = render.div("flex flex-col w-390 h-full");

const HeaderContainer = render.section(
  "fixed w-390 flex flex-col items-center font-16-sb bg-white border-0 border-x border-border border-solid box-border",
);

const InformationWrapper = render.section("flex flex-col w-full h-full overflow-y-auto box-border mt-84");

export default GenrePage;
