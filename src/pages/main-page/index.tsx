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
import { useMemo } from "react";

const MainPage = () => {
  const navigate = useNavigate();

  const { data: ramenyaGroup } = useRamenyaGroupQuery();
  const { data: regions } = useRegionsQuery();

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
  grid grid-cols-5 gap-x-14 gap-y-12
`;

const LocationPathContainer = tw.div`
  grid grid-cols-3 gap-10
  w-350
`;

const SwiperContainer = tw.div`
  w-350
`;

export default MainPage;
