import { genrePath, RAMENYA_LOCATION_LIST } from "@/entities/ramenya/model";
import { Swiper, SwiperSlide } from "swiper/react";
import { SearchOverlay } from "@/widgets/map/search-overlay";
import { GenreCard, GroupCard, HomeBanner, RamenroadLogo, Section } from "@/widgets/home";
import { IconCoordinate, IconSearch } from "@/shared/ui/icon";
import styled from "@emotion/styled";
import render from "@/shared/ui/render";
import { useHomePage } from "./model/useHomePage";

const HomePage = () => {
  const {
    ramenyaGroup,
    locationContainerRef,
    isDragging,
    isSearchOverlayOpen,
    setIsSearchOverlayOpen,
    searchValue,
    setSearchValue,
    handleOpenSearchOverlay,
    handleLocationBadgeClick,
    handleSearchKeywordSelect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    navigate,
  } = useHomePage();

  return (
    <Container>
      {/* 로고 */}
      <RamenroadLogoWrapper>
        <RamenroadLogo />
      </RamenroadLogoWrapper>

      {/* 검색 */}
      <SearchInputWrapper type="button" onClick={handleOpenSearchOverlay}>
        <IconSearch color="#FF5200" />
        <SearchPlaceholder>무슨 라멘 먹을까?</SearchPlaceholder>
      </SearchInputWrapper>

      <SearchOverlay
        isExternal={true}
        isSearchOverlayOpen={isSearchOverlayOpen}
        setIsSearchOverlayOpen={setIsSearchOverlayOpen}
        keyword={searchValue}
        setKeyword={setSearchValue}
        onSelectKeyword={handleSearchKeywordSelect}
      />

      {/* 배너 */}
      <BannerWrapper>
        <HomeBanner />
      </BannerWrapper>

      {/* 장르: 라멘 종류 */}
      <Section title="어떤 라멘을 찾으시나요?">
        <GenrePathContainer>
          {genrePath.map((genre) => (
            <GenreCard
              key={genre.genre}
              genreName={genre.genre}
              genreIcon={genre.image}
              onClick={() => navigate(`/genre/${genre.genre}`)}
            />
          ))}
        </GenrePathContainer>
      </Section>

      {/* 지역: 라멘 매장이 있는 지역 선택 */}
      <Section title="어디로 가시나요?">
        <LocationSwiperContainer
          ref={locationContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          $isDragging={isDragging}
        >
          <MyLocationBadge type="button" onClick={() => handleLocationBadgeClick(null)}>
            <IconCoordinate />
            <BadgeText>내 주변</BadgeText>
          </MyLocationBadge>

          {RAMENYA_LOCATION_LIST.map((location) => (
            <LocationPathBadge
              type="button"
              key={location.name.join(",")}
              onClick={() => handleLocationBadgeClick(location.location)}
            >
              {location.name.map((name) => (
                <BadgeText key={name}>{name}</BadgeText>
              ))}
            </LocationPathBadge>
          ))}
        </LocationSwiperContainer>
      </Section>

      {/* 그룹: 특정 컨셉 및 키워드에 대한 그룹 리스트 */}
      {ramenyaGroup?.map((group) => (
        <Section
          key={group._id}
          title={group.name}
          subTitle={group.description}
          isAdditionalInformation
          onClickAdditionalInformation={() => navigate(`/group/${group._id}`)}
        >
          <GroupSwiperContainer>
            <Swiper slidesPerView={2.1} spaceBetween={10} modules={[]}>
              {group.ramenyas.map((data) => (
                <SwiperSlide key={data._id}>
                  <GroupCard
                    title={data.name}
                    subTitle={data.genre[0]}
                    image={data.thumbnailUrl ?? ""}
                    onClick={() => navigate(`/detail/${data._id}`)}
                    type={group.type}
                    region={data.region}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </GroupSwiperContainer>
        </Section>
      ))}
    </Container>
  );
};

const Container = render.div("flex flex-col items-center justify-center gap-40 px-20 pt-20 pb-40");

const RamenroadLogoWrapper = render.div("flex items-center justify-center p-10 mb-[-30px]");

const BannerWrapper = render.div("flex relative");

const GenrePathContainer = render.div("grid grid-cols-4 gap-x-14 gap-y-12");

const LocationPathBadge = render.button(
  "flex h-71 w-52 min-w-52 cursor-pointer flex-col items-center justify-center rounded-[50px] border border-solid border-[#F1F1F1] bg-[#F8F8F8] text-gray-800 shadow-none outline-none",
);

const MyLocationBadge = render.button(
  "flex h-71 w-71 min-w-71 cursor-pointer flex-col items-center justify-center rounded-[50px] border border-solid border-[#FFE4D4] bg-[#FFF4EE] text-orange shadow-none outline-none",
);

const LocationSwiperContainer = styled.div<{ $isDragging: boolean }>(({ $isDragging }) => ({
  width: "350px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  overflowX: "auto",
  fontSize: "14px",
  lineHeight: "21px",
  fontWeight: 400,
  userSelect: "none",
  whiteSpace: "nowrap",
  cursor: $isDragging ? "grabbing" : "grab",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

const GroupSwiperContainer = render.div("w-350");

const SearchInputWrapper = render.button(
  "mb-[-20px] flex h-48 w-350 cursor-pointer items-center gap-4 rounded-[40px] border-[1.2px] border-solid border-orange bg-white px-16 shadow-none outline-none",
);

const SearchPlaceholder = render.span("font-16-r text-gray-400");

const BadgeText = render.span("text-inherit");

export default HomePage;
