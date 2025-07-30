import tw from "twin.macro";
import { LocationPathCard } from "./LocationPathCard";
import { useNavigate } from "react-router-dom";
import { genrePath } from "../../constants";
import { Banner } from "../../components/banner";
import { GroupCard } from "./GroupCard";
import { useRamenyaGroupQuery } from "../../hooks/queries/useRamenyaGroupQuery";
import { useRegionsQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import RamenroadLogo from "./RamenroadLogo";
import Section from "./Section";
import GenreCard from "./GenreCard";
import { useMemo, useState } from "react";
import { SearchOverlay } from "../../components/map/SearchOverlay";
import { IconSearch } from "../../components/Icon";

const MainPage = () => {
  const navigate = useNavigate();

  const { data: ramenyaGroup } = useRamenyaGroupQuery();
  const { data: regions } = useRegionsQuery();

  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const locationPath = useMemo(
    () =>
      regions?.map((region) => ({
        location: region,
      })),
    [regions],
  );

  return (
    <Container>
      {/* 로고 */}
      <RamenroadLogoWrapper>
        <RamenroadLogo />
      </RamenroadLogoWrapper>

      {/* 검색 */}
      <SearchInputWrapper onClick={() => setIsSearchOverlayOpen(true)}>
        <IconSearch color="#FF5200" />
        <SearchInput placeholder="무슨 라멘 먹을까?" readOnly />
      </SearchInputWrapper>

      <SearchOverlay
        isExternal={true}
        isSearchOverlayOpen={isSearchOverlayOpen}
        setIsSearchOverlayOpen={setIsSearchOverlayOpen}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSelectKeyword={(data) => {
          const mapString = new URLSearchParams();
          mapString.append("keywordName", data.name);
          navigate(`/map?${mapString}`);
        }}
      />

      {/* 배너 */}
      <BannerWrapper>
        <Banner />
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
        <LocationPathContainer>
          {locationPath?.map((region, index) => <LocationPathCard key={index} location={region.location} />)}
        </LocationPathContainer>
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
          <SwiperContainer>
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
          </SwiperContainer>
        </Section>
      ))}
    </Container>
  );
};

const Container = tw.div`
  flex flex-col items-center justify-center
  gap-40 px-20 pt-20 pb-40
`;

const RamenroadLogoWrapper = tw.div`
  flex items-center justify-center
  p-10 mb-[-20px]
`;

const BannerWrapper = tw.div`
  flex relative
`;

const GenrePathContainer = tw.div`
  grid grid-cols-4 gap-x-14 gap-y-12
`;

const LocationPathContainer = tw.div`
  grid grid-cols-3 gap-10
  w-350
`;

const SwiperContainer = tw.div`
  w-350
`;

const SearchInputWrapper = tw.div`
  box-border
  rounded-40
  w-350 h-48 px-16 py-12
  mb-[-20px]
  bg-white
  outline-none border border-orange border-solid border-[1.2px]
  cursor-pointer
  w-350
  flex gap-4
`;

const SearchInput = tw.input`
  w-full h-full
  outline-none border-none
  bg-transparent
  text-black
  placeholder:text-gray-400 font-16-r
`;

export default MainPage;
