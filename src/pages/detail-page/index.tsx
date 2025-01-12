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
} from "../../components/Icon";
import tw from "twin.macro";
import { useParams } from "react-router-dom";
import { useRamenyaDetailQuery } from "../../hooks/useRamenyaDetailQuery";
import DetailIconTag from "./DetailIconTag";
import styled from "@emotion/styled/macro";
import { useState } from "react";
import quoteStart from "../../assets/images/quotes-start.png";
import quoteEnd from "../../assets/images/quotes-end.png";
import KakaoMap from "./KaKaoMap";
import { checkBusinessStatus } from "../../util";
import { OpenStatus } from "../../constants";

const dayMapping: { [key: string]: string } = {
  mon: "월요일",
  tue: "화요일",
  wed: "수요일",
  thu: "목요일",
  fri: "금요일",
  sat: "토요일",
  sun: "일요일",
};

export const DetailPage = () => {
  const { id } = useParams();
  const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
  const navigate = useNavigate();
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);

  // 오늘 요일 구하기
  const getCurrentDayIndex = () => {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return days[new Date().getDay()];
  };

  // 오늘 영업 시간 찾기
  const getTodayBusinessHour = () => {
    const today = getCurrentDayIndex();
    return ramenyaDetailQuery.data?.businessHours.find(
      (hour) => hour.day.toLowerCase() === today
    );
  };

  const todayBusinessHour = getTodayBusinessHour();

  return (
    <Wrapper>
      <Container>
        <Header>
          <StyledIconBack onClick={() => navigate(-1)} />
        </Header>
        <MarketDetailWrapper>
          <MarketDetailTitle>{ramenyaDetailQuery.data?.name}</MarketDetailTitle>
          <MarketDetailBoxContainer>
            <MarketDetailBox>
              <DetailIconTag icon={<IconTag />} text="장르" />
              <MarketDetailGenreBox>
                {ramenyaDetailQuery.data?.genre.map((genre, index) => (
                  <MarketDetailGenre key={genre}>
                    {genre}{" "}
                    {index !== ramenyaDetailQuery.data?.genre.length - 1 && (
                      <IconBar />
                    )}
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
                  <OpenStatusText
                    status={
                      checkBusinessStatus(
                        ramenyaDetailQuery.data?.businessHours ?? []
                      ).status
                    }
                  >
                    {
                      checkBusinessStatus(
                        ramenyaDetailQuery.data?.businessHours ?? []
                      ).status
                    }
                  </OpenStatusText>
                  <TimeHeader>
                    {todayBusinessHour?.isOpen
                      ? `${dayMapping[todayBusinessHour.day.toLowerCase()]}: ${todayBusinessHour.operatingTime}`
                      : `매주 ${dayMapping[todayBusinessHour?.day.toLowerCase() ?? ""]} 휴무`}
                    {isTimeExpanded ? (
                      <StyledIconDropDownSelected
                        onClick={() => setIsTimeExpanded(false)}
                      />
                    ) : (
                      <StyledIconDropDown
                        onClick={() => setIsTimeExpanded(true)}
                      />
                    )}
                  </TimeHeader>
                  {isTimeExpanded && (
                    <>
                      <TimeDetails>
                        {`${dayMapping[todayBusinessHour?.day.toLowerCase() ?? ""]} 브레이크타임 ${todayBusinessHour?.breakTime}`}
                      </TimeDetails>
                      <TimeDetails>
                        {ramenyaDetailQuery.data?.businessHours
                          .filter(
                            (hour) =>
                              hour.day.toLowerCase() !== getCurrentDayIndex()
                          )
                          .map((businessHour) => (
                            <div key={businessHour.day}>
                              {businessHour.isOpen ? (
                                <TimeDetails>
                                  <div>{`${dayMapping[businessHour.day.toLowerCase()]}: ${businessHour.operatingTime}`}</div>
                                  <div>{`${dayMapping[businessHour.day.toLowerCase()]} 브레이크타임 ${businessHour.breakTime}`}</div>
                                </TimeDetails>
                              ) : (
                                `매주 ${dayMapping[businessHour.day.toLowerCase()]} 휴무`
                              )}
                            </div>
                          ))}
                      </TimeDetails>
                    </>
                  )}
                </OperationgTimeTextContainer>
              </MarketDetailBoxContent>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconCall />} text="전화번호" />
              <MarketDetailBoxContent>
                <PhoneNumberText>
                  {ramenyaDetailQuery.data?.contactNumber}
                </PhoneNumberText>
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
                  {ramenyaDetailQuery.data?.instagramProfile}
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
            <RecommendText>
              {ramenyaDetailQuery.data?.description}
            </RecommendText>
            <QuateEndBox>
              <QuoteEndImage src={quoteEnd} />
            </QuateEndBox>
          </RecommendTextContainer>

          <Divider />

          <LocationTitle>위치</LocationTitle>
          <LocationWrapper>
            <KakaoMap
              latitude={ramenyaDetailQuery.data?.latitude}
              longitude={ramenyaDetailQuery.data?.longitude}
            />
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
  status: OpenStatus;
}

const OpenStatusText = styled.div<OpenStatusTextProps>(({ status }) => [
  tw`font-14-r`,
  status === OpenStatus.OPEN
    ? tw`text-green`
    : status === OpenStatus.BREAK
      ? tw`text-orange`
      : tw`text-red`,
]);

const TimeHeader = tw.div`
  flex gap-4 items-center 
`;

const StyledIconDropDown = tw(IconDropDown)`
  cursor-pointer
`;

const StyledIconDropDownSelected = tw(IconDropDownSelected)`
  cursor-pointer
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
