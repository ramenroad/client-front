import { useNavigate } from "react-router-dom";
import {
  IconBack,
  IconBar,
  IconCall,
  IconDropDown,
  IconDropDownSelected,
  IconInstagram,
  IconLocate,
  IconTag,
  IconTime,
} from "../../components/Icons";
import tw from "twin.macro";
import DetailIconTag from "./DetailIconTag";
import styled from "@emotion/styled/macro";
import { useState } from "react";
import quoteStart from "../../assets/images/quotes-start.png";
import quoteEnd from "../../assets/images/quotes-end.png";
import KakaoMap from "./KaKaoMap";

const dummyData = {
  id: "라멘야1",
  name: "라멘야",
  genre: ["이에케", "이부라", "츠케멘"],
  address: "서울특별시 강남구 테헤란로 14길 57 1층",
  operatingHours: {
    월요일: "10:00 ~ 20:00",
    화요일: "10:00 ~ 20:00",
    수요일: "10:00 ~ 20:00",
    목요일: "10:00 ~ 20:00",
    금요일: "10:00 ~ 20:00",
    토요일: "10:00 ~ 20:00",
    일요일: "10:00 ~ 20:00",
    브레이크타임: "10:00 ~ 20:00",
    휴무일: "일요일",
  },
  phoneNumber: "010-1234-5678",
  instagram: "https://www.instagram.com/example12312313123123123131231231",
  recommendMenu: [
    {
      name: "라멘",
      price: "10,000원",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "라멘2",
      price: "12,000원",
      image: "https://picsum.photos/200/300",
    },
  ],
};

// 요일 매핑 객체 추가
const DAYS_MAP: { [key: string]: string } = {
  0: "일요일",
  1: "월요일",
  2: "화요일",
  3: "수요일",
  4: "목요일",
  5: "금요일",
  6: "토요일",
};

const locationImage = "https://picsum.photos/200/300";

//const realLocation = "서울특별시 마포구 동교로34길 21";

// 영업 상태 확인 함수
const checkIsOpen = (operatingHours: { [key: string]: string }): boolean => {
  const now = new Date();
  const currentDay = DAYS_MAP[now.getDay()];
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayHours = operatingHours[currentDay];
  if (!todayHours) return false;

  const [start, end] = todayHours.split("~").map((time) => {
    const [hours, minutes] = time.trim().split(":").map(Number);
    return hours * 100 + minutes;
  });

  return currentTime >= start && currentTime <= end;
};

export const DetailPage = () => {
  //const { id } = useParams();
  const navigate = useNavigate();
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);

  const isOpen = checkIsOpen(dummyData.operatingHours);

  return (
    <Wrapper>
      <Header>
        <StyledIconBack onClick={() => navigate(-1)} />
      </Header>
      <MarketDetailWrapper>
        <MarketDetailTitle>{dummyData.name}</MarketDetailTitle>
        <MarketDetailBoxContainer>
          <MarketDetailBox>
            <DetailIconTag icon={<IconTag />} text="장르" />
            <MarketDetailGenreBox>
              {dummyData.genre.map((genre, index) => (
                <MarketDetailGenre key={genre}>
                  {genre} {index !== dummyData.genre.length - 1 && <IconBar />}
                </MarketDetailGenre>
              ))}
            </MarketDetailGenreBox>
          </MarketDetailBox>

          <MarketDetailBox>
            <DetailIconTag icon={<IconLocate />} text="주소" />
            <MarketDetailBoxAddressText>
              {dummyData.address}
            </MarketDetailBoxAddressText>
          </MarketDetailBox>

          <MarketDetailBox>
            <DetailIconTag icon={<IconTime />} text="운영시간" />
            <MarketDetailBoxContent>
              <OperationgTimeTextContainer>
                <OpenStatusText isOpen={isOpen}>
                  {isOpen ? "영업중" : "영업종료"}
                </OpenStatusText>
                <TimeHeader>
                  {Object.entries(dummyData.operatingHours)[0][0]}:{" "}
                  {Object.entries(dummyData.operatingHours)[0][1]}
                  {isTimeExpanded ? (
                    <IconDropDownSelected
                      onClick={() => setIsTimeExpanded(false)}
                    />
                  ) : (
                    <IconDropDown onClick={() => setIsTimeExpanded(true)} />
                  )}
                </TimeHeader>
                {isTimeExpanded && (
                  <TimeDetails>
                    {Object.entries(dummyData.operatingHours)
                      .slice(1)
                      .map(([day, time]) => (
                        <div key={day}>{`${day}: ${time}`}</div>
                      ))}
                  </TimeDetails>
                )}
              </OperationgTimeTextContainer>
            </MarketDetailBoxContent>
          </MarketDetailBox>

          <MarketDetailBox>
            <DetailIconTag icon={<IconCall />} text="전화번호" />
            <MarketDetailBoxContent>
              <PhoneNumberText>{dummyData.phoneNumber}</PhoneNumberText>
            </MarketDetailBoxContent>
          </MarketDetailBox>

          <MarketDetailBox>
            <DetailIconTag icon={<IconInstagram />} text="인스타그램" />
            <MarketDetailBoxContent>
              <InstagramLink
                href={dummyData.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dummyData.instagram}
              </InstagramLink>
            </MarketDetailBoxContent>
          </MarketDetailBox>
        </MarketDetailBoxContainer>

        <Divider />

        <ReviewTitle>리뷰</ReviewTitle>
        <RecommendMenuTitle>추천 메뉴</RecommendMenuTitle>
        <RecommendMenuContainer>
          {dummyData.recommendMenu.map((menu) => (
            <RecommendMenuBox key={menu.name}>
              <RecommendMenuImage src={menu.image} alt={menu.name} />
              <RecommendMenuInfo>
                <RecommendMenuName>{menu.name}</RecommendMenuName>
                <RecommendMenuPrice>{menu.price}</RecommendMenuPrice>
              </RecommendMenuInfo>
            </RecommendMenuBox>
          ))}
        </RecommendMenuContainer>
        <RecommendTextContainer>
          <QuoteStartImage src={quoteStart} />
          <RecommendTitle>추천 메뉴를 소개합니다.</RecommendTitle>
          <RecommendText>추천 메뉴를 소개합니다.</RecommendText>
          <QuateEndBox>
            <QuoteEndImage src={quoteEnd} />
          </QuateEndBox>
        </RecommendTextContainer>

        <Divider />

        <LocationTitle>위치</LocationTitle>
        <LocationWrapper>
          <KakaoMap />
          <LocationImage src={locationImage} />
        </LocationWrapper>
      </MarketDetailWrapper>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center gap-16
  pb-40
`;

const Header = tw.div`
  flex items-center justify-start
  px-20 py-10 w-350
`;

const StyledIconBack = tw(IconBack)`
  cursor-pointer
`;

const MarketDetailWrapper = tw.div`
  flex flex-col px-20 gap-16
`;

const MarketDetailTitle = tw.div`
  font-22-sb
`;

const MarketDetailBox = tw.div`
  flex gap-16 items-start
`;

const MarketDetailGenreBox = tw.div`
  flex gap-8 items-center font-14-r
`;

const MarketDetailBoxAddressText = tw.div`
  font-14-r
`;

const MarketDetailGenre = tw.div`
  flex gap-8 items-center font-14-r
`;

const MarketDetailBoxContainer = tw.div`
  flex flex-col gap-12
`;

const MarketDetailBoxContent = tw.div`
  font-14-r max-w-254 break-words
`;

const OperationgTimeTextContainer = tw.div`
  flex flex-col gap-4 items-start
`;

interface OpenStatusTextProps {
  isOpen: boolean;
}

const OpenStatusText = styled.div<OpenStatusTextProps>(({ isOpen }) => [
  tw`font-14-r`,
  isOpen ? tw`text-green` : tw`text-red`,
]);

const TimeHeader = tw.div`
  flex gap-4 items-center 
`;

const TimeDetails = tw.div`
  flex flex-col gap-4
`;

const PhoneNumberText = tw.div`
  font-14-r
`;

const InstagramLink = tw.a`
  font-14-r text-blue
`;

const Divider = tw.div`
  w-full h-8 bg-divider mt-16
`;

const ReviewTitle = tw.div`
  font-18-sb pt-16
`;

const RecommendMenuTitle = tw.div`
  font-14-r text-gray-400
`;

const RecommendMenuContainer = tw.div`
  flex gap-16 mb-16
`;

const RecommendMenuBox = tw.div`
  flex flex-col gap-12
`;

const RecommendMenuImage = tw.img`
  w-100 h-100 rounded-8
`;

const RecommendMenuInfo = tw.div`
  flex flex-col
`;

const RecommendMenuName = tw.div`
  font-14-m
`;

const RecommendMenuPrice = tw.div`
  font-14-sb 
`;

const RecommendTextContainer = tw.div`
  flex flex-col p-20 gap-20
  bg-orange/[0.02] border-solid border-1 border-orange/30 rounded-8
`;

const RecommendTitle = tw.div`
  font-16-sb
`;

const RecommendText = tw.div`
  font-14-r
`;

const QuoteStartImage = tw.img`
  w-16 h-16
`;

const QuateEndBox = tw.div`
  flex justify-end
`;

const QuoteEndImage = tw.img`
  w-16 h-16
`;

const LocationTitle = tw.div`
  font-18-sb pt-16
`;

const LocationWrapper = tw.div`
  flex flex-col gap-16 w-350
`;

const LocationImage = tw.img`
  w-full h-200
`;

export default DetailPage;
