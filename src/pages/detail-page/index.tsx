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
import styled from "@emotion/styled/macro";
import { useState, useEffect } from "react";
//import quoteStart from "../../assets/images/quotes-start.png";
//import quoteEnd from "../../assets/images/quotes-end.png";
import emptyThumbnail from "../../assets/images/store.png";
import emptyImage from "../../assets/images/empty-images.png";
import emptyReview from "../../assets/images/empty-review.png";
import KakaoMap from "./KaKaoMap";
import { checkBusinessStatus } from "../../util";
import { OpenStatus } from "../../constants";
import { formatNumber } from "../../util/number";
import { ReviewCard } from "./ReviewCard";
import TopBar from "../../components/common/TopBar";
import React from "react";
import { useRamenyaReviewImagesQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { Modal } from "../../components/common/Modal";
import { useModal } from "../../hooks/common/useModal";
import { useSignInStore } from "../../states/sign-in";
import { ReviewImage } from "../../components/common/ReviewImage";
import { ImagePopup } from "../../components/common/ImagePopup";

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
  const userInformationQuery = useUserInformationQuery();
  const navigate = useNavigate();
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const {
    isOpen: isLoginModalOpen,
    open: openLoginModal,
    close: closeLoginModal,
  } = useModal();
  const {
    isOpen: isImagePopupOpen,
    open: openImagePopup,
    close: closeImagePopup,
  } = useModal();
  const { isSignIn } = useSignInStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);

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
    window.location.href = url;
  };

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
                  {ramenyaDetailQuery.data?.contactNumber || "미공개"}
                </PhoneNumberText>
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

          {/* 추후 한줄 리뷰 사용 논의 후 사용 */}
          {/* <RecommendTextContainer>
            <QuoteStartImage src={quoteStart} />
            <RecommendText>
              <RecommendTitle>
                {ramenyaDetailQuery.data?.ramenroadReview.oneLineReview}
              </RecommendTitle>
            </RecommendText>
            <QuateEndBox>
              <QuoteEndImage src={quoteEnd} />
            </QuateEndBox>
          </RecommendTextContainer> */}
        </RecommendWrapper>
        <Divider />

        <ImageWrapper>
          <ImageTitle>사진</ImageTitle>
          {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.length ===
            0 ? (
            <EmptyImageContainer>
              <EmptyImageImage src={emptyImage} />
              <EmptyImageTitle>등록된 사진이 없습니다.</EmptyImageTitle>
              <EmptyImageText>
                리뷰를 작성하고 사진을 등록해주세요!
              </EmptyImageText>
            </EmptyImageContainer>
          ) : (
            <ImageContainer>
              {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls
                ?.slice(0, 5)
                .map((image: string, index: number) => (
                  <ImageBox key={index}>
                    <ReviewImage
                      image={image}
                      onClick={() =>
                        handleOpenImagePopup(
                          index,
                          ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.slice(
                            0,
                            5
                          ) || []
                        )
                      }
                    />
                  </ImageBox>
                ))}
              {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.length >
                5 && (
                  <MoreImageWrapper onClick={handleNavigateImagesPage}>
                    <ImageBox>
                      <ReviewImage
                        image={
                          ramenyaReviewImagesQuery.data
                            ?.ramenyaReviewImagesUrls?.[5]
                        }
                      />
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
              <ReviewerName>
                {userInformationQuery.data?.nickname &&
                  userInformationQuery.data?.nickname}
              </ReviewerName>
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

            {!isSignIn && (
              <LoginButton onClick={() => navigate("/login")}>
                로그인하기
              </LoginButton>
            )}

          </ReviewHeader>
          <ReviewDivider />

          <ReviewContent>
            <ReviewContentTitle>고객 리뷰</ReviewContentTitle>
            {ramenyaDetailQuery.data?.reviews?.length === 0 ? (
              <EmptyReviewContainer>
                <EmptyReviewImage src={emptyReview} />
                <EmptyReviewTitle>등록된 리뷰가 없습니다.</EmptyReviewTitle>
                <EmptyReviewText>방문하셨나요? 평가를 남겨보세요!</EmptyReviewText>
                <CreateReviewButton
                  onClick={() => handleNavigateReviewCreatePage()}
                >
                  리뷰 작성하기
                </CreateReviewButton>
              </EmptyReviewContainer>
            ) : (
              <>
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
                        <ReviewCardBox>
                          <ReviewCard review={review} />
                        </ReviewCardBox>
                        <ReviewDivider />
                      </React.Fragment>
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

        {ramenyaDetailQuery.data?.latitude &&
          ramenyaDetailQuery.data?.longitude && (
            <LocationWrapper>
              <LocationTitle>위치</LocationTitle>
              <KakaoMap
                latitude={ramenyaDetailQuery.data?.latitude}
                longitude={ramenyaDetailQuery.data?.longitude}
              />
            </LocationWrapper>
          )}
        <MapRedirectButtonContainer>
          {ramenyaDetailQuery.data?.naverMapUrl && (
            <MapRedirectButton
              onClick={() => {
                if (ramenyaDetailQuery.data?.naverMapUrl) {
                  handleOpenMapURL(ramenyaDetailQuery.data?.naverMapUrl);
                }
              }}
            >
              <IconMap type={"naver"} />
              <span>네이버 지도 바로가기</span>
              <StyledIconArrowRight color="#888888" />
            </MapRedirectButton>
          )}
          {ramenyaDetailQuery.data?.kakaoMapUrl && (
            <MapRedirectButton
              onClick={() => {
                if (ramenyaDetailQuery.data?.kakaoMapUrl) {
                  handleOpenMapURL(ramenyaDetailQuery.data?.kakaoMapUrl);
                }
              }}
            >
              <IconMap type={"kakao"} />
              <span>카카오맵 바로가기</span>
              <StyledIconArrowRight color="#888888" />
            </MapRedirectButton>
          )}
          {ramenyaDetailQuery.data?.googleMapUrl && (
            <MapRedirectButton
              onClick={() => {
                if (ramenyaDetailQuery.data?.googleMapUrl) {
                  handleOpenMapURL(ramenyaDetailQuery.data?.googleMapUrl);
                }
              }}
            >
              <IconMap type={"google"} />
              <span>구글맵 바로가기</span>
              <StyledIconArrowRight color="#888888" />
            </MapRedirectButton>
          )}
        </MapRedirectButtonContainer>
      </Container>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>로그인이 필요해요</ModalTitle>
            <ModalText>로그인 하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton onClick={closeLoginModal}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton onClick={handleLoginConfirm}>
              확인
            </ModalConfirmButton>
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
  w-full h-8 bg-divider
`;

const ReviewTitle = tw.div`
  font-18-sb
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

const RecommendWrapper = tw.div`
  flex flex-col gap-16 
  px-20 py-32
`;

// const RecommendTextContainer = tw.div`
//   flex flex-col p-20 gap-4
//   w-350 box-border
//   bg-orange/[0.02] border-solid border-1 border-orange/30 rounded-8
// `;

// const RecommendText = tw.div`
//   flex items-center justify-center
// `;

// const RecommendTitle = tw.div`
//   font-16-sb text-center
// `;

// const QuoteStartImage = tw.img`
//   w-30 h-22
// `;

// const QuateEndBox = tw.div`  flex justify-end
// `;

// const QuoteEndImage = tw.img`//   w-30 h-22
// `;

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
  cursor-pointer
`;

const LargeStarContainer = tw.div`
  flex gap-2 items-center
  cursor-pointer
`;

const LoginButton = tw.div`
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
  gap-16
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

const EmptyReviewText = tw.div`
  font-14-r text-gray-700 pb-24
`;

const CreateReviewButton = tw.div`
  flex w-fit py-10 px-32
  box-border
  justify-center items-center
  font-16-m
  bg-brightOrange rounded-100 gap-2
  cursor-pointer
  text-orange
`;

const ReviewCardContainer = tw.div`
  flex flex-col gap-20
`;

const ReviewCardBox = tw.div`
  flex flex-col gap-16 px-20
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
