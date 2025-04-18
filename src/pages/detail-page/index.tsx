import { useNavigate } from "react-router-dom";
import {
  IconBar,
  IconCall,
  IconDropDown,
  IconDropDownSelected,
  IconInstagram,
  IconLocate,
  IconStarLarge,
  IconTag,
  IconTime,
  IconArrowRight,
  IconStarMedium,
} from "../../components/Icon";
import tw from "twin.macro";
import { useParams } from "react-router-dom";
import { useRamenyaDetailQuery } from "../../hooks/queries/useRamenyaDetailQuery";
import DetailIconTag from "./DetailIconTag";
import styled from "@emotion/styled/macro";
import { useState, useEffect } from "react";
import quoteStart from "../../assets/images/quotes-start.png";
import quoteEnd from "../../assets/images/quotes-end.png";
import emptyThumbnail from "../../assets/images/store.png";
import KakaoMap from "./KaKaoMap";
import { checkBusinessStatus } from "../../util";
import { OpenStatus } from "../../constants";
import { formatNumber } from "../../util/number";
import { ReviewCard } from "./ReviewCard";
import TopBar from "../../components/common/TopBar";
import React from "react";
import { useRamenyaReviewImagesQuery } from "../../hooks/queries/useRamenyaReviewQuery";
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
  const ramenyaReviewImagesQuery = useRamenyaReviewImagesQuery(id!);
  const navigate = useNavigate();
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);

  // 컴포넌트가 마운트될 때 스크롤 위치를 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <HeaderBox>
          <TopBar title={ramenyaDetailQuery.data?.name ?? ""} />
          <ThumbnailContainer>
            {ramenyaDetailQuery.data?.thumbnailUrl ? (
              <MarketThumbnail src={ramenyaDetailQuery.data?.thumbnailUrl} />
            ) : (
              <EmptyThumbnail src={emptyThumbnail} />
            )}
          </ThumbnailContainer>
        </HeaderBox>
        <MarketDetailWrapper>
          <MarketDetailTitle>{ramenyaDetailQuery.data?.name}</MarketDetailTitle>
          <MarketDetailBoxContainer>
            <MarketDetailBox>
              <DetailIconTag
                icon={<IconStarMedium color="#CFCFCF" />}
                text="평점"
              />
              <MarketDetailReviewBox>
                <StarContainer>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconStarMedium
                      key={star}
                      color={
                        (ramenyaDetailQuery.data?.reviewCount || 0) > 0 &&
                        Math.round(ramenyaDetailQuery.data?.rating || 0) >= star
                          ? "#FFCC00"
                          : "#E1E1E1"
                      }
                    />
                  ))}
                </StarContainer>
                <MarketDetailReviewScore>
                  {ramenyaDetailQuery.data?.rating?.toFixed(1) || "0.0"}
                </MarketDetailReviewScore>
              </MarketDetailReviewBox>
            </MarketDetailBox>

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
                        {todayBusinessHour?.isOpen &&
                          `${dayMapping[todayBusinessHour?.day.toLowerCase() ?? ""]} 브레이크타임 ${todayBusinessHour?.breakTime}`}
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
                                  {businessHour.breakTime && (
                                    <div>{`${dayMapping[businessHour.day.toLowerCase()]} 브레이크타임 ${businessHour.breakTime}`}</div>
                                  )}
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
                    <RecommendMenuPrice>
                      {formatNumber(menu.price)}원
                    </RecommendMenuPrice>
                  </RecommendMenuInfo>
                </RecommendMenuBox>
              ))}
            </RecommendMenuContainer>
          </RecommendBox>
          <RecommendTextContainer>
            <QuoteStartImage src={quoteStart} />
            <RecommendText>
              <RecommendTitle>
                {ramenyaDetailQuery.data?.ramenroadReview.oneLineReview}
              </RecommendTitle>
            </RecommendText>
            <QuateEndBox>
              <QuoteEndImage src={quoteEnd} />
            </QuateEndBox>
          </RecommendTextContainer>

          <Divider />

          <ImageTitle>사진</ImageTitle>
          <ImageContainer>
            {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls
              ?.slice(0, 5)
              .map((image: string, index: number) => (
                <Image key={index} src={image} />
              ))}
            {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.length >
              5 && (
              <MoreImageWrapper onClick={() => navigate(`/images/${id}`)}>
                <Image
                  src={
                    ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.[5]
                  }
                />
                <MoreOverlay>
                  <MoreText>더보기</MoreText>
                  <IconArrowRight color="#FFFFFF" />
                </MoreOverlay>
              </MoreImageWrapper>
            )}
          </ImageContainer>

          <Divider />

          <ReviewWrapper>
            <ReviewHeader>
              <ReviewHeaderTitle>
                <ReviewerName>라멘로드</ReviewerName>님 리뷰를 남겨주세요
              </ReviewHeaderTitle>
              <LargeStarContainer
                onClick={() => navigate(`/review/create/${id}`)}
              >
                <IconStarLarge color="#E1E1E1" />
                <IconStarLarge color="#E1E1E1" />
                <IconStarLarge color="#E1E1E1" />
                <IconStarLarge color="#E1E1E1" />
                <IconStarLarge color="#E1E1E1" />
              </LargeStarContainer>
            </ReviewHeader>

            <ReviewDivider />

            <ReviewContent>
              <ReviewContentTitle>고객 리뷰</ReviewContentTitle>

              <ReviewCardContainer>
                {ramenyaDetailQuery.data?.reviews
                  ?.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 3)
                  .map((review) => (
                    <React.Fragment key={review._id}>
                      <ReviewCard review={review} />
                      <ReviewDivider />
                    </React.Fragment>
                  ))}
              </ReviewCardContainer>

              <AllReviewButton onClick={() => navigate(`/review/list/${id}`)}>
                <span>모든 리뷰 보기</span>
                <IconArrowRight />
              </AllReviewButton>
            </ReviewContent>
          </ReviewWrapper>

          <Divider />

          {ramenyaDetailQuery.data?.latitude &&
            ramenyaDetailQuery.data?.longitude && (
              <>
                <LocationTitle>위치</LocationTitle>
                <LocationWrapper>
                  <KakaoMap
                    latitude={ramenyaDetailQuery.data?.latitude}
                    longitude={ramenyaDetailQuery.data?.longitude}
                  />
                </LocationWrapper>
              </>
            )}
        </MarketDetailWrapper>
      </Container>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center
  pb-40 px-20 w-full
`;

const Container = tw.div`
  flex flex-col gap-20 w-full
  max-w-390
`;

const HeaderBox = tw.div`
  flex flex-col
`;

const ThumbnailContainer = tw.div`
  w-full flex items-center justify-center
`;

const EmptyThumbnail = tw.img`
  w-190
`;

const MarketDetailWrapper = tw.div`
  flex flex-col px-20 gap-16
`;

const MarketThumbnail = tw.img`
  w-full h-190
  object-center
  object-cover
`;

const MarketDetailTitle = tw.div`
  font-22-sb
`;

const MarketDetailBox = tw.div`
  flex gap-16 items-start
`;

const MarketDetailReviewBox = tw.div`
  flex gap-4 items-center
`;

const MarketDetailReviewScore = tw.div`
  font-14-r text-black
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
  flex flex-col p-20 gap-4
  bg-orange/[0.02] border-solid border-1 border-orange/30 rounded-8
`;

const RecommendText = tw.div`
  flex items-center justify-center
`;

const RecommendTitle = tw.div`
  font-16-sb text-center
`;

const QuoteStartImage = tw.img`
  w-30 h-22
`;

const QuateEndBox = tw.div`
  flex justify-end
`;

const QuoteEndImage = tw.img`
  w-30 h-22
`;

const ImageTitle = tw.div`
  font-18-sb pt-16
`;

const ImageContainer = tw.div`
  flex flex-wrap gap-1 mb-16
  w-350
  rounded-8 overflow-hidden
`;

const Image = tw.img`
  w-116 h-116 object-cover

`;

const ReviewWrapper = tw.div`
  flex flex-col
`;

const ReviewHeader = tw.div`
  flex flex-col gap-10 items-center
`;

const ReviewHeaderTitle = tw.div`
  flex font-18-r text-black
`;

const ReviewerName = tw.div`
  text-orange
`;

const StarContainer = tw.div`
  flex gap-2 items-center
  cursor-pointer
`;

const LargeStarContainer = tw.div`
  flex gap-2 items-center
  cursor-pointer mb-32
`;

const ReviewDivider = tw.div`
  w-full h-1 bg-divider
`;

const ReviewContent = tw.div`
  flex flex-col
  gap-16
`;

const ReviewContentTitle = tw.div`
  font-18-sb text-black mt-20
`;

const ReviewCardContainer = tw.div`
  flex flex-col gap-20
`;

const AllReviewButton = tw.div`
  flex w-full py-10
  box-border
  justify-center items-center
  font-14-m text-black
  bg-border rounded-8 gap-2
  cursor-pointer
`;

const LocationTitle = tw.div`
  font-18-sb pt-16
`;

const LocationWrapper = tw.div`
  flex flex-col gap-16
`;

const MoreImageWrapper = tw.div`
  relative cursor-pointer
  w-116 h-116
`;

const MoreOverlay = tw.div`
  absolute top-0 left-0 w-116 h-116
  bg-black/50 
  flex items-center justify-center gap-4
  rounded-br-8
`;

const MoreText = tw.span`
  font-16-m text-white
`;

export default DetailPage;
