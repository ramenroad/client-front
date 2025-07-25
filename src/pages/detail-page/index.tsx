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
  IconMap,
} from "../../components/Icon";
import tw from "twin.macro";
import { useParams } from "react-router-dom";
import { useRamenyaDetailQuery } from "../../hooks/queries/useRamenyaDetailQuery";
import DetailIconTag from "./DetailIconTag";
import { useState, useEffect } from "react";
import emptyThumbnail from "../../assets/images/store.png";
import emptyImage from "../../assets/images/empty-images.png";
import emptyReview from "../../assets/images/empty-review.png";
import KakaoMap from "./KaKaoMap";
import { checkBusinessStatus, checkBusinessStatusSpecial } from "../../util";
import { formatNumber } from "../../util/number";
import TopBar from "../../components/top-bar";
import { useRamenyaReviewImagesQuery, useRamenyaReviewQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { Modal } from "../../components/common/Modal";
import { useModal } from "../../hooks/common/useModal";
import { useSignInStore } from "../../states/sign-in";
import { ReviewImage } from "../../components/review/ReviewImage";
import { ImagePopup } from "../../components/popup/ImagePopup";
import ReviewCard from "../../components/review/ReviewCard";
import { Line } from "../../components/common/Line";
import { useMobileState } from "../../hooks/common/useMobileState";
import { RamenyaOpenStatus } from "../../components/ramenya-card/RamenyaCard";
import { DAY_MAP, OpenStatus, WEEKDAYS_ORDER, WeekdaysOrderType } from "../../constants";
import styled from "@emotion/styled";

export const DetailPage = () => {
  const { id } = useParams();
  const { isMobile } = useMobileState();
  const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
  const { ramenyaReviewQuery } = useRamenyaReviewQuery(id!);
  const ramenyaReviewImagesQuery = useRamenyaReviewImagesQuery(id!);
  const { userInformationQuery } = useUserInformationQuery();
  const navigate = useNavigate();
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const { isOpen: isLoginModalOpen, open: openLoginModal, close: closeLoginModal } = useModal();
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const { isSignIn } = useSignInStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // 오늘 요일 구하기
  const getCurrentDayIndex = () => {
    // JavaScript getDay(): 0=일요일, 1=월요일, 2=화요일, 3=수요일, 4=목요일, 5=금요일, 6=토요일
    const dayIndex = new Date().getDay();
    const dayMapping = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return dayMapping[dayIndex];
  };

  // 오늘을 기준으로 한 주의 순서로 정렬하는 함수
  const sortBusinessHoursByCurrentDay = (
    businessHours: { day: string; isOpen: boolean; operatingTime: string; breakTime?: string }[],
  ) => {
    const today = getCurrentDayIndex();

    const todayIndex = WEEKDAYS_ORDER.indexOf(today as WeekdaysOrderType);

    // 오늘부터 시작하는 새로운 순서 배열 생성
    const reorderedDays = [...WEEKDAYS_ORDER.slice(todayIndex), ...WEEKDAYS_ORDER.slice(0, todayIndex)];

    return businessHours.sort((a, b) => {
      const aIndex = reorderedDays.indexOf(a.day as WeekdaysOrderType);
      const bIndex = reorderedDays.indexOf(b.day as WeekdaysOrderType);
      return aIndex - bIndex;
    });
  };

  // 오늘 영업 시간 찾기
  const getTodayBusinessHour = () => {
    const today = getCurrentDayIndex();
    return ramenyaDetailQuery.data?.businessHours.find((hour) => hour.day.toLowerCase() === today);
  };

  const todayBusinessHour = getTodayBusinessHour();

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    handleNavigateReviewCreatePage(rating);
  };

  const handleNavigateReviewCreatePage = (rating: number = 0) => {
    if (!isSignIn) {
      openLoginModal();
      return;
    }
    navigate(`/review/create/${id}?rating=${rating}`);
  };

  const handleLoginConfirm = () => {
    closeLoginModal();
    navigate("/login");
  };

  const handleOpenImagePopup = (index: number, images: string[]) => {
    setSelectedImageIndex(index);
    setSelectedImages(images);
    openImagePopup();
  };

  const handleNavigateImagesPage = () => {
    navigate(`/images/${id}`);
  };

  const handleOpenMapURL = (url: string) => {
    if (isMobile) {
      window.location.href = url;
      return;
    }
    window.open(url, "_blank");
  };

  // 맵 버튼 데이터 정의
  const mapButtons = [
    {
      type: "naver" as const,
      url: ramenyaDetailQuery.data?.naverMapUrl,
      label: "네이버 지도 바로가기",
    },
    {
      type: "kakao" as const,
      url: ramenyaDetailQuery.data?.kakaoMapUrl,
      label: "카카오맵 바로가기",
    },
    {
      type: "google" as const,
      url: ramenyaDetailQuery.data?.googleMapUrl,
      label: "구글맵 바로가기",
    },
  ];

  // 컴포넌트가 마운트될 때 스크롤 위치를 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <DetailIconTag icon={<IconStarMedium color="#CFCFCF" />} text="평점" />
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
                    {genre} {index !== ramenyaDetailQuery.data?.genre.length - 1 && <IconBar />}
                  </MarketDetailGenre>
                ))}
              </MarketDetailGenreBox>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconLocate />} text="주소" />
              <MarketDetailBoxAddressText>{ramenyaDetailQuery.data?.address}</MarketDetailBoxAddressText>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconTime />} text="운영시간" />
              <MarketDetailBoxContent>
                <OperationgTimeTextContainer>
                  <RamenyaOpenStatus status={checkBusinessStatus(ramenyaDetailQuery.data?.businessHours ?? []).status}>
                    {checkBusinessStatus(ramenyaDetailQuery.data?.businessHours ?? []).status}
                  </RamenyaOpenStatus>
                  <TimeHeader>
                    {todayBusinessHour?.isOpen
                      ? `${todayBusinessHour.operatingTime}`
                      : checkBusinessStatusSpecial(ramenyaDetailQuery.data?.businessHours ?? []).closeInformation}
                    {isTimeExpanded ? (
                      <StyledIconDropDownSelected onClick={() => setIsTimeExpanded(false)} />
                    ) : (
                      <StyledIconDropDown onClick={() => setIsTimeExpanded(true)} />
                    )}
                  </TimeHeader>
                  {isTimeExpanded && (
                    <BusinessHoursWrapper>
                      {checkBusinessStatusSpecial(ramenyaDetailQuery.data?.businessHours ?? []).daily.allSame ? (
                        <BusinessHoursContainer today={true}>
                          <BusinessHoursDay>매일</BusinessHoursDay>
                          <BusinessHoursTime>
                            <div>{`${checkBusinessStatusSpecial(ramenyaDetailQuery.data?.businessHours ?? []).daily.operatingTime}`}</div>
                            {checkBusinessStatusSpecial(ramenyaDetailQuery.data?.businessHours ?? []).daily
                              .breakTime && (
                              <div>{`${checkBusinessStatusSpecial(ramenyaDetailQuery.data?.businessHours ?? []).daily.breakTime} ${OpenStatus.BREAK}`}</div>
                            )}
                          </BusinessHoursTime>
                        </BusinessHoursContainer>
                      ) : (
                        sortBusinessHoursByCurrentDay(ramenyaDetailQuery.data?.businessHours || []).map(
                          (businessHour) => (
                            <BusinessHoursContainer
                              key={businessHour.day}
                              today={todayBusinessHour?.day === businessHour.day}
                            >
                              <BusinessHoursDay>{DAY_MAP[businessHour.day]}</BusinessHoursDay>
                              <BusinessHoursTime>
                                {businessHour.isOpen ? (
                                  <div key={businessHour.day}>
                                    <div>{`${businessHour.operatingTime}`}</div>
                                    {businessHour.breakTime && (
                                      <BreakTimeText>
                                        <span>{businessHour.breakTime}</span>
                                        <span>{OpenStatus.BREAK}</span>
                                      </BreakTimeText>
                                    )}
                                  </div>
                                ) : (
                                  <div>{`매주 휴무`}</div>
                                )}
                              </BusinessHoursTime>
                            </BusinessHoursContainer>
                          ),
                        )
                      )}
                      {/* {!todayBusinessHour?.isOpen && (
                        <div>
                          {checkBusinessStatusSpecial(ramenyaDetailQuery.data?.businessHours ?? []).closeInformation}
                        </div>
                      )} */}
                    </BusinessHoursWrapper>
                  )}
                </OperationgTimeTextContainer>
              </MarketDetailBoxContent>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconCall />} text="전화번호" />
              <MarketDetailBoxContent>
                <PhoneNumberText>{ramenyaDetailQuery.data?.contactNumber || "미공개"}</PhoneNumberText>
              </MarketDetailBoxContent>
            </MarketDetailBox>

            <MarketDetailBox>
              <DetailIconTag icon={<IconInstagram />} text="인스타그램" />
              <MarketDetailBoxContent>
                {ramenyaDetailQuery.data?.instagramProfile ? (
                  <InstagramLink
                    href={ramenyaDetailQuery.data?.instagramProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ramenyaDetailQuery.data?.instagramProfile}
                  </InstagramLink>
                ) : (
                  <PhoneNumberText>미공개</PhoneNumberText>
                )}
              </MarketDetailBoxContent>
            </MarketDetailBox>
          </MarketDetailBoxContainer>
        </MarketDetailWrapper>

        <Divider />

        <RecommendWrapper>
          <ReviewTitle>라멘로드 추천 메뉴</ReviewTitle>
          <RecommendBox>
            <RecommendMenuContainer>
              {ramenyaDetailQuery.data?.recommendedMenu.map((menu) => (
                <RecommendMenuBox key={menu.name}>
                  <RecommendMenuInfo>
                    <RecommendMenuName>{menu.name}</RecommendMenuName>
                    <RecommendMenuPrice>{formatNumber(menu.price)}원</RecommendMenuPrice>
                  </RecommendMenuInfo>
                </RecommendMenuBox>
              ))}
            </RecommendMenuContainer>
          </RecommendBox>
        </RecommendWrapper>
        <Divider />

        <ImageWrapper>
          <ImageTitle>사진</ImageTitle>
          {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.length === 0 ? (
            <EmptyImageContainer>
              <EmptyImageImage src={emptyImage} />
              <EmptyImageTitle>등록된 사진이 없습니다.</EmptyImageTitle>
              <EmptyImageText>리뷰를 작성하고 사진을 등록해주세요!</EmptyImageText>
            </EmptyImageContainer>
          ) : (
            <ImageContainer>
              {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls
                ?.slice(0, 5)
                .map((image: string, index: number) => (
                  <ImageBox key={index}>
                    <ReviewImage
                      src={image}
                      onClick={() =>
                        handleOpenImagePopup(
                          index,
                          ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.slice(0, 5) || [],
                        )
                      }
                    />
                  </ImageBox>
                ))}
              {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.length > 5 && (
                <MoreImageWrapper onClick={handleNavigateImagesPage}>
                  <ImageBox>
                    <ReviewImage src={ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.[5]} />
                  </ImageBox>
                  <MoreOverlay>
                    <MoreText>더보기</MoreText>
                    <IconArrowRight color="#FFFFFF" />
                  </MoreOverlay>
                </MoreImageWrapper>
              )}
            </ImageContainer>
          )}
        </ImageWrapper>

        <Divider />

        <ReviewWrapper>
          <ReviewHeader>
            <ReviewHeaderTitle>
              <ReviewerName>{userInformationQuery.data?.nickname && userInformationQuery.data?.nickname}</ReviewerName>
              {isSignIn ? "님 리뷰를 남겨주세요" : "로그인 후 리뷰를 남겨주세요"}
            </ReviewHeaderTitle>

            <LargeStarContainer>
              {[...Array(5)].map((_, i) => (
                <IconStarLarge
                  key={i}
                  color={i < selectedRating ? "#FFCC00" : "#E1E1E1"}
                  onClick={() => handleStarClick(i + 1)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </LargeStarContainer>

            {!isSignIn && <LoginButton onClick={() => navigate("/login")}>로그인하기</LoginButton>}
          </ReviewHeader>
          <ReviewDivider />

          <ReviewContent>
            <ReviewContentTitle>고객 리뷰</ReviewContentTitle>
            {ramenyaReviewQuery.data?.pages.flatMap((page) => page.reviews)?.length === 0 ? (
              <EmptyReviewContainer>
                <EmptyReviewImage src={emptyReview} />
                <EmptyReviewTitle>등록된 리뷰가 없습니다.</EmptyReviewTitle>
                <EmptyReviewText>방문하셨나요? 평가를 남겨보세요!</EmptyReviewText>
                <CreateReviewButton onClick={() => handleNavigateReviewCreatePage()}>리뷰 작성하기</CreateReviewButton>
              </EmptyReviewContainer>
            ) : (
              <>
                <ReviewCardContainer>
                  {ramenyaReviewQuery.data?.pages
                    .flatMap((page) => page.reviews)
                    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map((review) => (
                      <>
                        <ReviewCard
                          key={review._id}
                          review={review}
                          editable={userInformationQuery.data?._id === review.userId?._id}
                        />
                        <Line />
                      </>
                    ))}
                </ReviewCardContainer>
                <AllReviewButton onClick={() => navigate(`/review/list/${id}`)}>
                  <span>모든 리뷰 보기</span>
                  <IconArrowRight />
                </AllReviewButton>
              </>
            )}
          </ReviewContent>
        </ReviewWrapper>

        <Divider />

        {ramenyaDetailQuery.data?.latitude && ramenyaDetailQuery.data?.longitude && (
          <LocationWrapper>
            <LocationTitle>위치</LocationTitle>
            <KakaoMap latitude={ramenyaDetailQuery.data?.latitude} longitude={ramenyaDetailQuery.data?.longitude} />
          </LocationWrapper>
        )}

        <MapRedirectButtonContainer>
          {mapButtons
            .filter((button) => button.url)
            .map((button) => (
              <MapRedirectButton
                key={button.type}
                onClick={() => {
                  if (button.url) {
                    handleOpenMapURL(button.url);
                  }
                }}
              >
                <IconMap type={button.type} />
                <span>{button.label}</span>
                <StyledIconArrowRight color="#888888" />
              </MapRedirectButton>
            ))}
        </MapRedirectButtonContainer>
      </Container>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>로그인이 필요해요</ModalTitle>
            <ModalText>로그인 하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton onClick={closeLoginModal}>취소</ModalCancelButton>
            <ModalConfirmButton onClick={handleLoginConfirm}>확인</ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>

      <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
        {selectedImageIndex !== null && selectedImages.length > 0 && (
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeImagePopup}
            images={selectedImages}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
          />
        )}
      </Modal>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col items-center justify-center
  pb-40 w-full
`;

const Container = tw.div`
  flex flex-col w-full
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
  flex flex-col gap-16 px-20
  pt-20
  pb-32
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
  flex-wrap
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
  flex flex-col gap-6 items-start
`;

const TimeHeader = tw.div`
  flex gap-4 items-center 
`;

const StyledIconDropDown = tw(IconDropDown)`
  cursor-pointer
`;

const StyledIconDropDownSelected = tw(IconDropDownSelected)`
  cursor-pointer
`;

const BusinessHoursWrapper = tw.div`
  flex flex-col gap-8
`;

const BusinessHoursContainer = styled.div<{ today: boolean }>(({ today }) => [
  tw`flex gap-7`,
  today && tw`font-semibold`,
]);

const BusinessHoursDay = tw.span`  
`;

const BusinessHoursTime = tw.div`
  flex flex-col gap-4
`;

const BreakTimeText = tw.div`
  flex gap-4 items-center
`;

const PhoneNumberText = tw.div`
  font-14-r
`;

const InstagramLink = tw.a`
  font-14-r text-blue
`;

const Divider = tw.div`
  w-full h-8 bg-divider
`;

const ReviewTitle = tw.div`
  font-18-sb
`;

const RecommendBox = tw.div`
  flex flex-col gap-8
`;

const RecommendMenuContainer = tw.div`
  flex gap-16 mb-16 flex-wrap
`;

const RecommendMenuBox = tw.div`
  flex flex-col gap-12
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

const RecommendWrapper = tw.div`
  flex flex-col gap-16 
  px-20 py-32
`;

const ImageTitle = tw.div`
  font-18-sb
`;

const ImageWrapper = tw.div`
  flex flex-col gap-16 
  px-20 py-32
`;

const ImageContainer = tw.div`
  flex flex-wrap gap-1 mb-16
  w-350
  rounded-8 overflow-hidden
`;

const ImageBox = tw.div`
  w-116 h-116
`;

const ReviewWrapper = tw.div`
  flex flex-col 
  py-32
`;

const ReviewHeader = tw.div`
  flex flex-col gap-10 items-center
  px-20
  mb-32
`;

const ReviewHeaderTitle = tw.div`
  font-18-r text-black
  flex items-center
`;

const ReviewerName = tw.span`
  text-orange
`;

const StarContainer = tw.div`
  flex gap-2 items-center
  cursor-none
`;

const LargeStarContainer = tw.div`
  flex gap-2 items-center
  cursor-pointer
`;

const LoginButton = tw.div`
  mt-16
  flex w-fit py-10 px-32
  box-border
  justify-center items-center
  font-16-m
  bg-brightOrange rounded-100 gap-2
  cursor-pointer
  text-orange
`;

const ReviewDivider = tw.div`
  w-full h-1 bg-divider
`;

const ReviewContent = tw.div`
  flex flex-col
`;

const ReviewContentTitle = tw.div`
  font-18-sb text-black pl-20 pt-20
`;

const EmptyReviewContainer = tw.div`
  flex flex-col items-center justify-center
`;

const EmptyReviewImage = tw.img`
  w-80
  pb-8
`;

const EmptyReviewTitle = tw.div`
  font-16-r text-black pb-4
`;

const EmptyReviewText = tw.span`
  font-14-r text-gray-700
`;

const CreateReviewButton = tw.div`
  mt-16
  flex w-fit py-10 px-32
  box-border
  justify-center items-center
  font-16-m
  bg-brightOrange rounded-100 gap-2
  cursor-pointer
  text-orange
`;

const ReviewCardContainer = tw.div`
  flex flex-col
`;

const AllReviewButton = tw.div`
  mt-10
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
  flex flex-col gap-16 px-20
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

const EmptyImageContainer = tw.div`
  flex flex-col items-center justify-center
`;

const EmptyImageImage = tw.img`
  w-80
  pb-8
`;

const EmptyImageTitle = tw.div`
  font-16-r text-black pb-4
`;

const EmptyImageText = tw.div`
  font-14-r text-gray-700
`;

const ModalContent = tw.div`
    flex flex-col gap-16 w-290 pt-32
    items-center
    justify-center
    bg-white
    rounded-12
`;

const ModalTextBox = tw.div`
    flex flex-col
`;

const ModalTitle = tw.div`
    font-16-sb text-gray-900
    text-center
`;

const ModalText = tw.div`
    font-16-r text-gray-900
    text-center
`;

const ModalButtonBox = tw.div`
    flex h-60 w-full
`;

const ModalCancelButton = tw.button`
    w-full
    font-16-r text-black
    cursor-pointer
    border-none
    bg-transparent
`;

const ModalConfirmButton = tw.button`
    w-full
    font-16-r text-orange
    cursor-pointer
    border-none
    bg-transparent
`;

const MapRedirectButtonContainer = tw.div`
  flex flex-col px-20 gap-8 mt-16
`;

const MapRedirectButton = tw.button`
  bg-transparent box-border
  border border-solid border-gray-100 rounded-8
  flex items-center gap-10
  py-14 px-20 h-52
  font-14-r
  text-black
  cursor-pointer
`;

const StyledIconArrowRight = tw(IconArrowRight)`
  ml-auto
`;

export default DetailPage;
