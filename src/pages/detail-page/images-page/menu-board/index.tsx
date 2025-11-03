import React from "react";
import { useParams } from "react-router-dom";
import tw from "twin.macro";
import { useEffect } from "react";
import { useRamenyaDetailQuery } from "../../../../hooks/queries/useRamenyaDetailQuery";
import { useModal } from "../../../../hooks/common/useModal";
import TopBar from "../../../../components/top-bar";
import { Modal } from "../../../../components/common/Modal";
import { ImagePopup } from "../../../../components/popup/ImagePopup";
import { MenuBoard } from "../../../../types";

export const MenuBoardImagesPage = () => {
  const { id } = useParams();
  const ramenyaDetailQuery = useRamenyaDetailQuery(id!);
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenImagePopup = (index: number) => {
    setSelectedImageIndex(index);
    openImagePopup();
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
          />
        )}
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
