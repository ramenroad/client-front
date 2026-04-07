import emptyThumbnail from "@/assets/images/store.png";
import TopBar from "@/shared/ui/top-bar";
import { Modal } from "@/shared/ui/modal";
import { ImagePopup } from "@/shared/ui/image-popup";
import {
  RamenyaInformationSection,
  RecommendMenuSection,
  MenuBoardSection,
  ReviewPhotoSection,
  ReviewSection,
  MapSection,
} from "@/widgets/ramenya/detail";
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
} from "@/widgets/ramenya/detail/commonStyles";
import { useRamenyaDetailPage } from "./model/useRamenyaDetailPage";

export const DetailPage = () => {
  const {
    id,
    isSignIn,
    isTimeExpanded,
    setIsTimeExpanded,
    selectedImageIndex,
    setSelectedImageIndex,
    selectedImages,
    selectedRating,
    isLoginModalOpen,
    closeLoginModal,
    isImagePopupOpen,
    closeImagePopup,
    ramenyaDetailQuery,
    ramenyaReviewQuery,
    ramenyaReviewImagesQuery,
    userInformationQuery,
    todayBusinessHour,
    mapButtons,
    sortBusinessHoursByCurrentDay,
    handleStarClick,
    handleLoginConfirm,
    handleOpenImagePopup,
    handleNavigateImagesPage,
    handleNavigateReviewCreatePage,
    handleOpenMapURL,
  } = useRamenyaDetailPage();

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
