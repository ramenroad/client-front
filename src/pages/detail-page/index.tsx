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
import { useParams } from "react-router-dom";
import { useRamenyaDetailQuery } from "../../hooks/useRamenyaDetailQuery";
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
  address: "성남대로43번길 10 하나EZ타워",
  operatingHours: {
    월요일: "10:00 - 20:00",
    화요일: "10:00 - 20:00",
    수요일: "10:00 - 20:00",
    목요일: "10:00 - 20:00",
    금요일: "10:00 - 20:00",
    토요일: "10:00 - 20:00",
    일요일: "10:00 - 20:00",
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
  description: `라멘을 받자마자 느낀 점은 플레이팅에 굉장히 신경을 쓰셨구나 였습니다. 이게 플레이팅이 너무 예뻐서 약간 먹기 아까다 싶을 정도였습니다. 야채가 조금 들어가있는데 여러 색을 쓰셔서 그런지 보기가 정말 좋았습니다. 보기 좋은 떡이 먹기도 좋다라는 말이 괜히 있는 게 아니죠.

국물부터 먹어봤습니다. 국물은 생각보다 기름기가 있는 편이였습니다. 느끼하다기보단 육향이 잘 느껴지는 느낌이였습니다. 면은 푹 익은 면이였습니다. 먹었던 시오 라멘 중엔 가장 푹 익은 면이였던 거 같아요. 거부감은 없는 정도였습니다.

차슈랑 닭가슴살은 부드럽게 잘 익었지만 육향이 진하진 않았습니다. 평범하게 잘 조리된 고기였습니다.

라멘 롱시즌 시오 라멘은 고기를 모두 먹고 면과 국물을 먹을 때 비로소 강점이 도드라지는 느낌이였습니다. 최근에 방문했고 자주 방문하는 멘야준, 희옥에 비해 염도가 낮은 느낌이였는데요. 염도가 낮은 게 '심심하다' '간이 더 됐으면 좋겠다' 가 아닌 '국믈이 육향을 즐기기 너무 좋다' 로 다가왔습니다. 평소에 라멘 염도를 높게 먹기도 하고 삼삼한 맛을 별로 선호하진 않음에도 불구하고 삼삼함이 정말 기분좋게 느껴졌습니다. 오히려 간이 더 됐다면 닭 육향만을 찐하게 즐기기 어려웠을 것 같습니다. 처음에 얘기했던 기름기가 이 부분에서 빛났습니다. 삼삼함과 적절한 기름기가 만나 국물을 즐기기 정말 좋았습니다.

연남동에서 손에 꼽히는 시오 라멘 맛집이 아닐까..생각해봅니다.`
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

// 영업 상태 확인 함수
const checkIsOpen = (operatingHours: { [key: string]: string }): boolean => {
  const now = new Date();
  const currentDay = DAYS_MAP[now.getDay()];
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todayHours = operatingHours[currentDay];
  if (!todayHours) return false;

  const [start, end] = todayHours.split("-").map((time) => {
    const [hours, minutes] = time.trim().split(":").map(Number);
    return hours * 100 + minutes;
  });

  return currentTime >= start && currentTime <= end;
};

export const DetailPage = () => {
  const { id } = useParams();
  const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
  const navigate = useNavigate();
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);

  const isOpen = checkIsOpen(dummyData.operatingHours);

  return (
    <Wrapper>
      <Container>
      <Header>
        <StyledIconBack onClick={() => navigate(-1)} />
      </Header>
      <MarketDetailWrapper>
        <MarketDetailTitle>{dummyData.name}</MarketDetailTitle>
        <MarketDetailBoxContainer>
          <MarketDetailBox>
            <DetailIconTag icon={<IconTag />} text="장르" />
            <MarketDetailGenreBox>
              {ramenyaDetailQuery.data?.genre.map((genre, index) => (
                <MarketDetailGenre key={genre}>
                  {genre} {index !== ramenyaDetailQuery.data?.genre.length - 1 && <IconBar />}
                </MarketDetailGenre>
              ))}
            </MarketDetailGenreBox>
          </MarketDetailBox>

          <MarketDetailBox>
            <DetailIconTag icon={<IconLocate />} text="주소" />
            <MarketDetailBoxAddressText>
              {ramenyaDetailQuery.data?.address}
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
              <PhoneNumberText>{ramenyaDetailQuery.data?.contactNumber}</PhoneNumberText>
            </MarketDetailBoxContent>
          </MarketDetailBox>

          <MarketDetailBox>
            <DetailIconTag icon={<IconInstagram />} text="인스타그램" />
            <MarketDetailBoxContent>
              <InstagramLink
                href={ramenyaDetailQuery.data?.instagramProfile}
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
        <RecommendBox>
        <RecommendMenuTitle>추천 메뉴</RecommendMenuTitle>
        <RecommendMenuContainer>
          {ramenyaDetailQuery.data?.recommendedMenu.map((menu) => (
            <RecommendMenuBox key={menu.name}>
              {/* <RecommendMenuImage src={menu.image} alt={menu.name} /> */}
              <RecommendMenuInfo>
                <RecommendMenuName>{menu.name}</RecommendMenuName>
                <RecommendMenuPrice>{menu.price}</RecommendMenuPrice>
              </RecommendMenuInfo>
            </RecommendMenuBox>
          ))}
        </RecommendMenuContainer>
        </RecommendBox>
        <RecommendTextContainer>
          <QuoteStartImage src={quoteStart} />
          <RecommendTitle>추천 메뉴를 소개합니다.</RecommendTitle>
          <RecommendText>{dummyData.description}</RecommendText>
          <QuateEndBox>
            <QuoteEndImage src={quoteEnd} />
          </QuateEndBox>
        </RecommendTextContainer>

        <Divider />

        <LocationTitle>위치</LocationTitle>
        <LocationWrapper>
          <KakaoMap location={dummyData.address} />
        </LocationWrapper>
      </MarketDetailWrapper>
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center
  pb-40 px-20
`;

const Container = tw.div`
  flex flex-col gap-16 w-390
`;

const Header = tw.div`
  flex items-center justify-start
  px-20 py-10 w-full
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

const RecommendBox = tw.div`
  flex flex-col gap-8
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

// const RecommendMenuImage = tw.img`
//   w-100 h-100 rounded-8
// `;

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
  font-14-r whitespace-pre-line
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
  flex flex-col gap-16
`;

export default DetailPage;
