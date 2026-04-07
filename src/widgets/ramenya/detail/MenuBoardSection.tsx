// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Third-party
import { useQueryClient } from "@tanstack/react-query";

// UI Components
import { Button } from "@/shared/ui/button";
import { Line } from "@/shared/ui/line";
import { Modal } from "@/shared/ui/modal";
import { RaisingText } from "@/shared/ui/text";
import { ImagePopup } from "@/shared/ui/image-popup";
import { useToast } from "@/shared/ui/toast";

// Icons
import { IconMenuBoard, IconArrowRight } from "@/shared/ui/icon";

// Hooks
import { useModal } from "@/shared/lib/useModal";
import { useMenuBoardMutation } from "@/features/menu-board/model";
import { queryKeys } from "@/shared/model/query-keys";

// Stores
import { useUserInformationStore } from "@/entities/viewer/model";
import { useSignInStore } from "@/entities/viewer/model";

// Types
import type { MenuBoard } from "@/entities/menu-board/model";

// Local Components
import { MenuBoardDetail } from "@/entities/menu-board/ui";
import render from "@/shared/ui/render";
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
  const { remove } = useMenuBoardMutation();
  const { userInformation } = useUserInformationStore();
  const { isSignIn } = useSignInStore();

  // Computed values
  const isMenuBoardEmpty = menuBoard.length === 0;
  const menuBoardImages = menuBoard.map((menu) => menu.imageUrl);
  const selectedMenuBoard = selectedImageIndex === null ? undefined : menuBoard[selectedImageIndex];

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
    if (!selectedMenuBoard) {
      return;
    }

    remove.mutate(
      { menuBoardId: selectedMenuBoard._id, ramenyaId },
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
            등록하기
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
          <MenuBoardSubmitButton type="button" onClick={handleSubmitMenuBoard}>
            등록하기
          </MenuBoardSubmitButton>
        </MenuboardEmptyContainer>
      ) : (
        <MenuBoardContainer>
          <MenuBoardImageContainer>
            {menuBoard.slice(0, 10).map((menu, index) => (
              <MenuBoardImage key={menu._id} src={menu.imageUrl} onClick={() => handleOpenImagePopup(index)} />
            ))}
          </MenuBoardImageContainer>
          <Line />
          <Button type="button" variant="gray" onClick={() => navigate(`/menu-board-images/${ramenyaId}`)}>
            <ButtonText>전체 메뉴판 보기</ButtonText>
            <MenuBoardAllArrowRight color="#888888" />
          </Button>
        </MenuBoardContainer>
      )}
      <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
        {selectedImageIndex !== null && selectedMenuBoard && (
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeImagePopup}
            images={menuBoardImages}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
          >
            <MenuBoardDetail
              profileImage={selectedMenuBoard.userId.profileImageUrl}
              nickname={selectedMenuBoard.userId.nickname}
              createdAt={selectedMenuBoard.createdAt}
              description={selectedMenuBoard.description}
              isMine={userInformation?.id === selectedMenuBoard.userId._id}
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
const SectionWrapper = render.div("flex flex-col gap-14 px-20 py-32");

const TitleWrapper = render.div("flex items-center justify-between");

const Title = render.extend(RaisingText, "text-black");

const EditButton = render.extend(Button, "w-61 h-18 font-12-m flex items-center justify-center rounded-[100px]");

const MenuboardEmptyContainer = render.div("flex flex-col items-center justify-center");

const MenuBoardEmptyDescription = render.extend(RaisingText, "text-black pt-8 pb-4");

const MenuBoardEmptyCaption = render.extend(RaisingText, "text-gray-70 pb-16");

const MenuBoardSubmitButton = render.button(
  "flex w-fit items-center justify-center gap-2 rounded-[100px] bg-bright-orange px-32 py-10 font-16-m text-orange cursor-pointer border-none shadow-none outline-none",
);

const MenuBoardContainer = render.div("flex flex-col gap-10");

const MenuBoardImageContainer = render.div("flex gap-10 w-full rounded-[8px] overflow-x-auto");

const MenuBoardImage = render.img("w-110 h-110 object-cover rounded-[8px] cursor-pointer");

const ButtonText = render.span("text-inherit");

const MenuBoardAllArrowRight = render.extend(IconArrowRight, "pl-2");
