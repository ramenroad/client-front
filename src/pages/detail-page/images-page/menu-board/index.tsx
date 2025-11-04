// React
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Third-party
import tw from "twin.macro";
import { useQueryClient } from "@tanstack/react-query";

// UI Components
import TopBar from "../../../../components/top-bar";
import { Modal } from "../../../../components/common/Modal";
import { ImagePopup } from "../../../../components/popup/ImagePopup";
import { useToast } from "../../../../components/toast/ToastProvider";

// Hooks
import { useModal } from "../../../../hooks/common/useModal";
import { useMenuBoardMutation } from "../../../../hooks/mutation/useMenuBoardMutation";
import { useRamenyaDetailQuery } from "../../../../hooks/queries/useRamenyaDetailQuery";
import { queryKeys } from "../../../../hooks/queries/queryKeys";

// Stores
import { useUserInformationStore } from "../../../../store/location/useUserInformationStore";

// Types
import { MenuBoard } from "../../../../types";

// Local Components
import { MenuBoardDetail } from "../../MenuBoardDetail";
import {
  ModalButtonBox,
  ModalCancelButton,
  ModalConfirmButton,
  ModalContent,
  ModalText,
  ModalTextBox,
  ModalTitle,
} from "../../commonStyles";

export const MenuBoardImagesPage = () => {
  const { id } = useParams();

  // Hooks - Data
  const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
  const queryClient = useQueryClient();
  const { openToast } = useToast();
  const { removeMenuBoard } = useMenuBoardMutation();
  const { userInformation } = useUserInformationStore();

  // Hooks - UI state
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);
  const [isRemoveMenuBoardModalOpen, setIsRemoveMenuBoardModalOpen] = useState(false);

  // Effects
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Event handlers
  const handleOpenImagePopup = (index: number) => {
    setSelectedImageIndex(index);
    openImagePopup();
  };

  const handleRemoveMenuBoard = () => {
    removeMenuBoard.mutate(
      { menuBoardId: ramenyaDetailQuery.data!.menuBoard[selectedImageIndex!]._id, ramenyaId: id! },
      {
        onSuccess: () => {
          openToast("메뉴판 삭제 성공");
          queryClient.invalidateQueries({ ...queryKeys.ramenya.detail(id!) });
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

  return (
    <Wrapper>
      <Header>
        <TopBar title={"메뉴판"} />
      </Header>
      <ImageContainer>
        {ramenyaDetailQuery.data?.menuBoard?.map((menu: MenuBoard, index: number) => (
          <Image
            key={index}
            src={menu.imageUrl}
            onClick={() => handleOpenImagePopup(index)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </ImageContainer>

      <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
        {selectedImageIndex !== null && ramenyaDetailQuery.data?.menuBoard && (
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeImagePopup}
            images={ramenyaDetailQuery.data.menuBoard.map((menu: MenuBoard) => menu.imageUrl)}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
            title={ramenyaDetailQuery.data?.name}
          >
            <MenuBoardDetail
              profileImage={ramenyaDetailQuery.data?.menuBoard[selectedImageIndex].userId.profileImageUrl}
              nickname={ramenyaDetailQuery.data?.menuBoard[selectedImageIndex].userId.nickname}
              createdAt={ramenyaDetailQuery.data?.menuBoard[selectedImageIndex].createdAt}
              description={ramenyaDetailQuery.data?.menuBoard[selectedImageIndex].description}
              isMine={ramenyaDetailQuery.data?.menuBoard[selectedImageIndex].userId._id === userInformation?.id}
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
    </Wrapper>
  );
};

const Wrapper = tw.div`
    flex flex-col pb-40
`;

const Header = tw.div`
    flex flex-col
    w-full
    max-w-390
`;

const ImageContainer = tw.div`
    grid grid-cols-3 gap-1
`;

const Image = tw.img`
    w-full aspect-square object-cover
`;
