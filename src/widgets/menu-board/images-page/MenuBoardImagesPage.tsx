import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useRamenyaDetailQuery } from "@/entities/ramenya/model";
import type { MenuBoard } from "@/entities/menu-board/model";
import { MenuBoardDetail } from "@/entities/menu-board/ui";
import { useUserInformationStore } from "@/entities/viewer/model";
import { useMenuBoardMutation } from "@/features/menu-board/model";
import { useModal } from "@/shared/lib/use-modal";
import { queryKeys } from "@/shared/model/query-keys";
import { Modal } from "@/shared/ui/modal";
import { ImagePopup } from "@/shared/ui/image-popup";
import TopBar from "@/shared/ui/top-bar";
import { useToast } from "@/shared/ui/toast";
import render from "@/shared/ui/render";
import {
  ModalButtonBox,
  ModalCancelButton,
  ModalConfirmButton,
  ModalContent,
  ModalText,
  ModalTextBox,
  ModalTitle,
} from "@/widgets/ramenya/detail/commonStyles";

export const MenuBoardImagesPage = () => {
  const { id } = useParams();
  const { ramenyaDetailQuery } = useRamenyaDetailQuery(id!);
  const queryClient = useQueryClient();
  const { openToast } = useToast();
  const { remove } = useMenuBoardMutation();
  const { userInformation } = useUserInformationStore();
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isRemoveMenuBoardModalOpen, setIsRemoveMenuBoardModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveMenuBoard = () => {
    const selectedMenuBoard = selectedImageIndex !== null ? ramenyaDetailQuery.data?.menuBoard[selectedImageIndex] : undefined;

    if (!selectedMenuBoard || !id) {
      return;
    }

    remove.mutate(
      { menuBoardId: selectedMenuBoard._id, ramenyaId: id },
      {
        onSuccess: () => {
          openToast("메뉴판 삭제 성공");
          queryClient.invalidateQueries({ ...queryKeys.ramenya.detail(id) });
          setSelectedImageIndex((currentIndex) => {
            if (currentIndex === null) {
              return null;
            }

            return currentIndex === 0 ? 0 : currentIndex - 1;
          });
          setIsRemoveMenuBoardModalOpen(false);
        },
        onError: () => {
          openToast("메뉴판 삭제에 실패했습니다.");
        },
      },
    );
  };

  return (
    <Wrapper>
      <Header>
        <TopBar title="메뉴판" />
      </Header>
      <ImageContainer>
        {ramenyaDetailQuery.data?.menuBoard?.map((menu, index) => (
          <Image key={menu._id} src={menu.imageUrl} onClick={() => {
            setSelectedImageIndex(index);
            openImagePopup();
          }} />
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
            title={ramenyaDetailQuery.data.name}
          >
            <MenuBoardDetail
              profileImage={ramenyaDetailQuery.data.menuBoard[selectedImageIndex].userId.profileImageUrl}
              nickname={ramenyaDetailQuery.data.menuBoard[selectedImageIndex].userId.nickname}
              createdAt={ramenyaDetailQuery.data.menuBoard[selectedImageIndex].createdAt}
              description={ramenyaDetailQuery.data.menuBoard[selectedImageIndex].description}
              isMine={ramenyaDetailQuery.data.menuBoard[selectedImageIndex].userId._id === userInformation?.id}
              onDelete={() => setIsRemoveMenuBoardModalOpen(true)}
            />
          </ImagePopup>
        )}
      </Modal>

      <Modal isOpen={isRemoveMenuBoardModalOpen} onClose={() => setIsRemoveMenuBoardModalOpen(false)}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>메뉴판 삭제</ModalTitle>
            <ModalText>메뉴판을 삭제하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton onClick={() => setIsRemoveMenuBoardModalOpen(false)}>취소</ModalCancelButton>
            <ModalConfirmButton onClick={handleRemoveMenuBoard}>확인</ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = render.div("flex flex-col pb-40");

const Header = render.div("flex flex-col w-full max-w-390");

const ImageContainer = render.div("grid grid-cols-3 gap-1");

const Image = render.img("aspect-square w-full cursor-pointer object-cover");
