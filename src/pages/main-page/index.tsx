import tw from "twin.macro";
import { LocationPathBox } from "./LocationPathBox";
import mainLogo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { genrePath } from "../../constants";
import { IconArrowRight } from "../../components/Icon";
import { Banner } from "../../components/common/Banner";
import { GroupListBox } from "../../components/main-page/GroupListBox";
import { useRamenyaGroupQuery } from "../../hooks/queries/useRamenyaGroupQuery";
import { useRegionsQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Swiper, SwiperSlide } from "swiper/react";

const MainPage = () => {
  const navigate = useNavigate();

  const { data: ramenyaGroup } = useRamenyaGroupQuery();
  const { data: regions } = useRegionsQuery();
  const locationPath = regions?.map((region) => ({
    location: region,
  }));
  return (
    <Wrapper>
      <MainLogoBox>
        <MainLogo src={mainLogo} />
      </MainLogoBox>
      <MainImageContainer>
        <Banner />
      </MainImageContainer>

      <GenreViewingWrapper>
        <LocationViewingText>어떤 라멘을 찾으시나요?</LocationViewingText>
        <GenrePathContainer>
          {genrePath.map((genre, index) => (
            <Genre onClick={() => navigate(`/genre/${genre.genre}`)}>
              <GenreImage key={index} src={genre.image} alt={genre.genre} />
              <GenreInfo>{genre.genre}</GenreInfo>
            </Genre>
          ))}
        </GenrePathContainer>
      </GenreViewingWrapper>

      <LocationViewingWrapper>
        <LocationViewingText>어디로 가시나요?</LocationViewingText>
        <LocationPathContainer>
          {locationPath?.map((region, index) => (
            <LocationPathBox key={index} location={region.location} />
          ))}
        </LocationPathContainer>
      </LocationViewingWrapper>

      {ramenyaGroup?.map((group) => (
        <GroupViewingWrapper key={group._id}>
          <GroupInfoBox>
            <GroupTitleBox>
              <GroupTitleText>{group.name}</GroupTitleText>
              <GroupTitleButtonBox
                onClick={() => navigate(`/group/${group._id}`)}
              >
                <GroupTitleButtonText>더보기</GroupTitleButtonText>
                <IconArrowRight color="#888888" />
              </GroupTitleButtonBox>
            </GroupTitleBox>
            <GroupSubTitle>{group.description}</GroupSubTitle>
          </GroupInfoBox>
          <SwiperContainer>
            <Swiper slidesPerView={2.1} spaceBetween={10} modules={[]}>
              {group.ramenyas.map((data) => (
                <SwiperSlide key={data._id}>
                  <GroupListBox
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
        </GroupViewingWrapper>
      ))}
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center
  gap-20 p-20
`;

const MainLogoBox = tw.div`
  flex items-center justify-center
  p-10
`;

const MainLogo = tw.img`
  flex w-98 h-24
`;

const MainImageContainer = tw.div`
  flex relative mb-20
`;

const GenreImage = tw.img`
  w-48 h-48
`;

const GenreViewingWrapper = tw.div`
  flex flex-col gap-16 w-350 mb-20
`;

const LocationViewingWrapper = tw.div`
  flex flex-col gap-16 w-350 mb-20
`;

const LocationViewingText = tw.div`
  flex font-18-sb text-black
`;

const Genre = tw.div`
  flex flex-col items-center gap-4 cursor-pointer
`;

const GenrePathContainer = tw.div`
  grid grid-cols-5 gap-x-14 gap-y-12
`;

const GenreInfo = tw.span`
  font-14-r
  whitespace-nowrap
`;

const LocationPathContainer = tw.div`
  grid grid-cols-3 gap-10
  w-350
`;

const GroupViewingWrapper = tw.div`
  flex flex-col w-350 mb-20 gap-16
`;

const GroupInfoBox = tw.div`
  flex flex-col
`;

const GroupTitleBox = tw.div`
  flex justify-between items-center
`;

const GroupTitleText = tw.span`
  flex font-18-sb text-black
`;

const GroupTitleButtonBox = tw.div`
  flex items-center gap-2 cursor-pointer
`;

const GroupTitleButtonText = tw.div`
  flex font-12-r text-gray-700
`;

const GroupSubTitle = tw.span`
  flex font-14-r text-gray-800
`;

const SwiperContainer = tw.div`
  w-full
`;

export default MainPage;
