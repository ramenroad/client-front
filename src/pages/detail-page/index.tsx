import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useRamenyaDetailQuery } from "../../hooks/queries/useRamenyaDetailQuery";
import { useState, useEffect } from "react";
import emptyThumbnail from "../../assets/images/store.png";
import TopBar from "../../components/top-bar";
import { useRamenyaReviewImagesQuery, useRamenyaReviewQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { Modal } from "../../components/common/Modal";
import { useModal } from "../../hooks/common/useModal";
import { useSignInStore } from "../../states/sign-in";
import { ImagePopup } from "../../components/popup/ImagePopup";
import { useMobileState } from "../../hooks/common/useMobileState";
import { RamenyaInformationSection } from "./RamenyaInformationSection";
import { RecommendMenuSection } from "./RecommendMenuSection";
import { MenuBoardSection } from "./MenuBoardSection";
import { ReviewPhotoSection } from "./ReviewPhotoSection";
import { ReviewSection } from "./ReviewSection";
import { MapSection } from "./MapSection";
import {
  Wrapper,
  Container,
  HeaderBox,
  ThumbnailContainer,
  EmptyThumbnail,
  MarketThumbnail,
  Divider,
  ModalContent,
  ModalTextBox,
  ModalTitle,
  ModalText,
  ModalButtonBox,
  ModalCancelButton,
  ModalConfirmButton,
} from "./commonStyles";
import { WEEKDAYS_ORDER, WeekdaysOrderType } from "../../constants";

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

        <RamenyaInformationSection
          ramenyaData={ramenyaDetailQuery.data}
          isTimeExpanded={isTimeExpanded}
          setIsTimeExpanded={setIsTimeExpanded}
          sortBusinessHoursByCurrentDay={sortBusinessHoursByCurrentDay}
          todayBusinessHour={todayBusinessHour}
        />

        <Divider />

        <RecommendMenuSection recommendedMenu={ramenyaDetailQuery.data?.recommendedMenu || []} />

        <Divider />

        <MenuBoardSection menuBoard={ramenyaDetailQuery.data?.menuBoard || []} ramenyaId={id!} />

        <Divider />

        <ReviewPhotoSection
          ramenyaReviewImagesUrls={ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls}
          onOpenImagePopup={handleOpenImagePopup}
          onNavigateImagesPage={handleNavigateImagesPage}
        />

        <Divider />

        <ReviewSection
          userInformation={userInformationQuery.data}
          isSignIn={isSignIn}
          selectedRating={selectedRating}
          onStarClick={handleStarClick}
          ramenyaReviewData={ramenyaReviewQuery.data}
          onNavigateReviewCreatePage={handleNavigateReviewCreatePage}
          ramenyaId={id!}
        />

        <Divider />

        <MapSection
          latitude={ramenyaDetailQuery.data?.latitude}
          longitude={ramenyaDetailQuery.data?.longitude}
          mapButtons={mapButtons}
          onOpenMapURL={handleOpenMapURL}
        />
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

export default DetailPage;
