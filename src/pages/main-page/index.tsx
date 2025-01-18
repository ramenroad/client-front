import tw from "twin.macro";
import { LocationPathBox } from "./LocationPathBox";
import mainImage from "../../assets/images/main-image.png";
import mainLogo from "../../assets/images/logo.png";
import pig from "../../assets/images/pig.png";
import sio from "../../assets/images/sio.png";
import soy from "../../assets/images/soy.png";
import iekei from "../../assets/images/iekei.png";
import jiro from "../../assets/images/jiro.png";
import toripaitan from "../../assets/images/toripaitan.png";
import niboshi from "../../assets/images/niboshi.png";
import asari from "../../assets/images/asari.png";
import aburasoba from "../../assets/images/aburasoba.png";
import tsukemen from "../../assets/images/tsukemen.png";
import miso from "../../assets/images/miso.png";
import dandan from "../../assets/images/dandan.png";
import { useNavigate } from "react-router-dom";

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

const genrePath = [
  {
    genre: "돈코츠",
    image: pig,
  },
  {
    genre: "시오",
    image: sio,
  },
  {
    genre: "쇼유",
    image: soy,
  },
  {
    genre: "이에케",
    image: iekei,
  },
  {
    genre: "지로",
    image: jiro,
  },
  {
    genre: "토리파이탄",
    image: toripaitan,
  },
  {
    genre: "니보시",
    image: niboshi,
  },
  {
    genre: "아사리",
    image: asari,
  },
  {
    genre: "아부라소바",
    image: aburasoba,
  },
  {
    genre: "츠케멘",
    image: tsukemen,
  },
  {
    genre: "미소",
    image: miso,
  },
  {
    genre: "탄탄멘",
    image: dandan,
  },
];

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <MainLogoBox>
        <MainLogo src={mainLogo} />
      </MainLogoBox>
      <MainImageContainer>
        <MainImage src={mainImage} />
        <MainText>
          다양한 라멘야 정보를 <br />
          알려드려요
        </MainText>
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

const MainImage = tw.img`
  flex w-350 h-200
`;

const GenreImage = tw.img`
  w-48 h-48
`;

const MainText = tw.div`
  flex font-20-sb text-white
  absolute top-20 left-20
`;

const GenreViewingWrapper = tw.div`
  flex flex-col gap-16 w-350 mb-20
`;

const LocationViewingWrapper = tw.div`
  flex flex-col gap-16 w-350
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

export default MainPage;
