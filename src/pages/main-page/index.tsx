import tw from "twin.macro";
import { LocationPathBox } from "./LocationPathBox";
import mainLogo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { genrePath } from "../../constants";
import { IconArrowRight } from "../../components/Icon";
import { Banner } from "../../components/common/Banner";
import { GroupListBox } from "../../components/main-page/GroupListBox";
import { useRamenyaGroupQuery } from "../../hooks/useRamenyaGroupQuery";

const locationPath = [
  {
    location: "연남동",
  },
  {
    location: "서교동",
  },
  {
    location: "망원동",
  },
  {
    location: "합정동",
  },
  {
    location: "강남역",
  },
  {
    location: "종로",
  },
  {
    location: "잠실",
  },
  {
    location: "강서구",
  },
  {
    location: "관악구",
  },
];

const MainPage = () => {
  const navigate = useNavigate();

  const { data: ramenyaGroup } = useRamenyaGroupQuery();

  console.log(ramenyaGroup);

  return (
    <Wrapper>
      <MainLogoBox>
        <MainLogo src={mainLogo} />
      </MainLogoBox>
      <MainImageContainer>
        <Banner />
      </MainImageContainer>

      <GenreViewingWrapper>
        <LocationViewingText>장르별 보기</LocationViewingText>
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
        <LocationViewingText>지역별 보기</LocationViewingText>
        <LocationPathContainer>
          {locationPath.map((location, index) => (
            <LocationPathBox key={index} location={location.location} />
          ))}
        </LocationPathContainer>
      </LocationViewingWrapper>

      {ramenyaGroup?.[0] && (
      <GroupViewingWrapper>
        <GroupInfoBox>
        <GroupTitleBox>
          <GroupTitleText>{ramenyaGroup?.[0].name}</GroupTitleText>
          <GroupTitleButtonBox onClick={() => navigate(`/group`)}>
            <GroupTitleButtonText>더 보기</GroupTitleButtonText>
            <IconArrowRight color="#888888" />
          </GroupTitleButtonBox>
        </GroupTitleBox>
        <GroupSubTitle>
          {ramenyaGroup?.[0].description}
        </GroupSubTitle>
        </GroupInfoBox>
        <GroupListWrapper>
          {ramenyaGroup?.[0].ramenyas
            .map((data) => (
              <GroupListBox
                key={data._id}
                title={data.name}
                subTitle={data.genre[0]}
                image={data.thumbnailUrl ?? ""}
                onClick={() => navigate(`/detail/${data._id}`)}
              />
            ))}
          </GroupListWrapper>
        </GroupViewingWrapper>
      )}
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

const GroupListWrapper = tw.div`
  flex gap-10 w-full overflow-x-scroll scrollbar-hide
`;

export default MainPage;
