// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Third-party
import tw from "twin.macro";
import { useQueryClient } from "@tanstack/react-query";

// UI Components
import { Button } from "../../components/common/Button";
import { Line } from "../../components/common/Line";
import { Modal } from "../../components/common/Modal";
import { RaisingText } from "../../components/common/RamenroadText";
import { ImagePopup } from "../../components/popup/ImagePopup";
import { useToast } from "../../components/toast/ToastProvider";

// Icons
import { IconMenuBoard, IconArrowRight } from "../../components/Icon";

// Hooks
import { useModal } from "../../hooks/common/useModal";
import { useMenuBoardMutation } from "../../hooks/mutation/useMenuBoardMutation";
import { queryKeys } from "../../hooks/queries/queryKeys";

// Stores
import { useUserInformationStore } from "../../store/location/useUserInformationStore";
import { useSignInStore } from "../../states/sign-in";

// Types
import { MenuBoard } from "../../types";

// Local Components
import { MenuBoardDetail } from "./MenuBoardDetail";
import {
  ModalButtonBox,
  ModalCancelButton,
  ModalConfirmButton,
  ModalContent,
  ModalText,
  ModalTextBox,
  ModalTitle,
} from "./commonStyles";

interface MenuBoardSectionProps {
  menuBoard: MenuBoard[];
  ramenyaId: string;
}

export const MenuBoardSection = ({ menuBoard, ramenyaId }: MenuBoardSectionProps) => {
  const navigate = useNavigate();

  // Hooks - UI state
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isRemoveMenuBoardModalOpen, setIsRemoveMenuBoardModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Hooks - Data
  const { openToast } = useToast();
  const queryClient = useQueryClient();
  const { removeMenuBoard } = useMenuBoardMutation();
  const { userInformation } = useUserInformationStore();
  const { isSignIn } = useSignInStore();

  // Computed values
  const isMenuBoardEmpty = menuBoard.length === 0;

  // Event handlers
  const handleOpenImagePopup = (index: number) => {
    setSelectedImageIndex(index);
    openImagePopup();
  };

  const handleSubmitMenuBoard = () => {
    if (!isSignIn) {
      openLoginModal();
    } else {
      navigate(`/menu-board-submit/${ramenyaId}`);
    }
  };

  const handleRemoveMenuBoard = () => {
    removeMenuBoard.mutate(
      { menuBoardId: menuBoard[selectedImageIndex!]._id, ramenyaId },
      {
        onSuccess: () => {
          openToast("메뉴판 삭제 성공");
          queryClient.invalidateQueries({ ...queryKeys.ramenya.detail(ramenyaId) });
          const newIndex = selectedImageIndex! === 0 ? 0 : selectedImageIndex! - 1;
          setSelectedImageIndex(newIndex);
          closeRemoveMenuBoardModal();
        },
        onError: () => {
          openToast("메뉴판 삭제에 실패했습니다.");
        },
      },
    );
  };

  // Modal handlers
  const openRemoveMenuBoardModal = () => {
    setIsRemoveMenuBoardModalOpen(true);
  };

  const closeRemoveMenuBoardModal = () => {
    setIsRemoveMenuBoardModalOpen(false);
  };

  const handleLoginConfirm = () => {
    closeLoginModal();
    navigate(`/login`);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <SectionWrapper>
      <TitleWrapper>
        <Title size={18} weight="sb">
          메뉴판
        </Title>
        {!isMenuBoardEmpty && (
          <EditButton variant="gray-outline" onClick={handleSubmitMenuBoard}>
            <span>등록하기</span>
          </EditButton>
        )}
      </TitleWrapper>

      {isMenuBoardEmpty ? (
        <MenuboardEmptyContainer>
          <IconMenuBoard />
          <MenuBoardEmptyDescription size={16} weight="r">
            등록된 메뉴판이 없습니다
          </MenuBoardEmptyDescription>
          <MenuBoardEmptyCaption size={14} weight="r">
            첫 등록의 주인공이 되어주세요!
          </MenuBoardEmptyCaption>
          <MenuBoardSubmitbutton onClick={handleSubmitMenuBoard}>등록하기</MenuBoardSubmitbutton>
        </MenuboardEmptyContainer>
      ) : (
        <MenuBoardContainer>
          <MenuBoardImageContainer>
            {menuBoard.slice(0, 10).map((menu, index) => (
              <MenuBoardImage key={menu._id} src={menu.imageUrl} onClick={() => handleOpenImagePopup(index)} />
            ))}
          </MenuBoardImageContainer>
          <Line />
          <Button variant="gray" onClick={() => navigate(`/menu-board-images/${ramenyaId}`)}>
            <span>전체 메뉴판 보기</span>
            <MenuBoardAllArrowRight color="#888888" />
          </Button>
        </MenuBoardContainer>
      )}
      <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
        {selectedImageIndex !== null && menuBoard[selectedImageIndex] && (
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeImagePopup}
            images={menuBoard.map((menu) => menu.imageUrl)}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
          >
            <MenuBoardDetail
              profileImage={menuBoard[selectedImageIndex].userId.profileImageUrl}
              nickname={menuBoard[selectedImageIndex].userId.nickname}
              createdAt={menuBoard[selectedImageIndex].createdAt}
              description={menuBoard[selectedImageIndex].description}
              isMine={userInformation?.id === menuBoard[selectedImageIndex].userId._id}
              onDelete={openRemoveMenuBoardModal}
            />
          </ImagePopup>
        )}
      </Modal>

      <Modal isOpen={isRemoveMenuBoardModalOpen} onClose={closeRemoveMenuBoardModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>메뉴판 삭제</ModalTitle>
            <ModalText>메뉴판을 삭제하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton onClick={closeRemoveMenuBoardModal}>취소</ModalCancelButton>
            <ModalConfirmButton onClick={handleRemoveMenuBoard}>확인</ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>

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
    </SectionWrapper>
  );
};

// 스타일 컴포넌트들
const SectionWrapper = tw.div`
  flex flex-col gap-14
  px-20 py-32
`;

const TitleWrapper = tw.div`
  flex items-center justify-between
`;

const Title = tw(RaisingText)`
  text-black
`;

const EditButton = tw(Button)`
  w-61 h-18
  font-12-m
  flex items-center justify-center
  rounded-100
`;

const MenuboardEmptyContainer = tw.div`
  flex flex-col items-center justify-center
`;

const MenuBoardEmptyDescription = tw(RaisingText)`
  text-black pt-8 pb-4
`;

const MenuBoardEmptyCaption = tw(RaisingText)`
  text-gray-70 pb-16
`;

const MenuBoardSubmitbutton = tw.div`
  flex w-fit py-10 px-32
  box-border
  justify-center items-center
  font-16-m
  bg-brightOrange rounded-100 gap-2
  cursor-pointer
  text-orange
`;

const MenuBoardContainer = tw.div`
  flex flex-col gap-10
`;

const MenuBoardImageContainer = tw.div`
  flex gap-10
  w-full
  rounded-8 overflow-x-auto
`;

const MenuBoardImage = tw.img`
  w-110 h-110 object-cover
  rounded-8
  cursor-pointer
`;

const MenuBoardAllArrowRight = tw(IconArrowRight)`
  pl-2
`;
