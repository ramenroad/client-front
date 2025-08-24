import tw from "twin.macro";
import { useNavigate } from "react-router-dom";
import { genrePath, RAMENYA_LOCATION_LIST } from "../../constants";
import { Banner } from "../../components/banner";
import { GroupCard } from "./GroupCard";
import { useRamenyaGroupQuery } from "../../hooks/queries/useRamenyaGroupQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import RamenroadLogo from "./RamenroadLogo";
import Section from "./Section";
import GenreCard from "./GenreCard";
import { useState, useRef, useCallback } from "react";
import { SearchOverlay } from "../../components/map/SearchOverlay";
import { IconCoordinate, IconSearch } from "../../components/Icon";
import { requestLocationPermission } from "../../util";
import { useToast } from "../../components/toast/ToastProvider";
import { useUserLocation } from "../../hooks/common/useUserLocation";
import styled from "@emotion/styled";

const MainPage = () => {
  const navigate = useNavigate();
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: ramenyaGroup } = useRamenyaGroupQuery();

  const { openToast } = useToast();
  const { getUserPosition } = useUserLocation();

  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!locationContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - locationContainerRef.current.offsetLeft);
    setScrollLeft(locationContainerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isDragging || !locationContainerRef.current) return;

      e.preventDefault();
      const x = e.pageX - locationContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      locationContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClickLocationBadge = async (location: { longitude: number; latitude: number } | null) => {
    if (!location) {
      const permission = await requestLocationPermission();
      if (!permission) {
        openToast("위치 권한을 허용해주세요.");
        return;
      }

      const position = await getUserPosition();
      if (!position) {
        openToast("위치 정보를 불러오는데 실패했습니다.");
        return;
      }

      const mapString = new URLSearchParams();
      mapString.append("longitude", position.longitude.toString());
      mapString.append("latitude", position.latitude.toString());
      navigate(`/map?${mapString}`);

      return;
    }

    const mapString = new URLSearchParams();
    mapString.append("longitude", location.longitude.toString());
    mapString.append("latitude", location.latitude.toString());
    mapString.append("level", "14");
    mapString.append("radius", "3241");
    navigate(`/map?${mapString}`);
  };

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
        keyword={searchValue}
        setKeyword={setSearchValue}
        onSelectKeyword={(keyword, isNearBy) => {
          const mapString = new URLSearchParams();
          mapString.append("keyword", keyword);
          if (isNearBy) {
            mapString.append("nearBy", "true");
          }
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
        <LocationSwiperContainer
          ref={locationContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          $isDragging={isDragging}
        >
          <MyLocationBadge onClick={() => handleClickLocationBadge(null)}>
            <IconCoordinate />
            <span>내 주변</span>
          </MyLocationBadge>

          {RAMENYA_LOCATION_LIST.map((location) => (
            <LocationPathBadge
              key={location.name.join(",")}
              onClick={() => handleClickLocationBadge(location.location)}
            >
              {location.name.map((name) => (
                <span key={name}>{name}</span>
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

const Container = tw.div`
  flex flex-col items-center justify-center
  gap-40 px-20 pt-20 pb-40
`;

const RamenroadLogoWrapper = tw.div`
  flex items-center justify-center
  p-10 mb-[-30px]
`;

const BannerWrapper = tw.div`
  flex relative
`;

const GenrePathContainer = tw.div`
  grid grid-cols-4 gap-x-14 gap-y-12
`;

const LocationPathBadge = tw.div`
  flex flex-col items-center justify-center
  min-w-52 w-52 h-71
  rounded-50
  bg-[#F8F8F8]
  border border-solid border-[#F1F1F1]
  cursor-pointer
  text-gray-800
`;

const MyLocationBadge = tw.div`
  min-w-71 w-71 h-71
  flex flex-col items-center justify-center
  rounded-50
  bg-[#FFF4EE]
  border border-solid border-[#FFE4D4]
  text-orange
  cursor-pointer
`;

const LocationSwiperContainer = styled.div<{ $isDragging: boolean }>`
  ${tw`
    w-350
    flex items-center gap-5 overflow-x-auto
    font-14-r
    select-none
    whitespace-nowrap
    hide-scrollbar
  `}
  ${({ $isDragging }) => ($isDragging ? tw`cursor-grabbing` : tw`cursor-grab`)}
`;

const GroupSwiperContainer = tw.div`
  w-350
`;

const SearchInputWrapper = tw.div`
  box-border
  rounded-40
  w-350 h-48 px-16
  mb-[-20px]
  bg-white
  outline-none border border-orange border-solid border-[1.2px]
  cursor-pointer
  w-350
  flex gap-4 items-center
`;

const SearchInput = tw.input`
  w-full h-full
  outline-none border-none
  bg-transparent
  text-black
  placeholder:text-gray-400 font-16-r
`;

export default MainPage;
