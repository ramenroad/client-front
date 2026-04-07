import React from "react";
import { useParams } from "react-router-dom";
import TopBar from "@/shared/ui/top-bar";
import { useRamenyaReviewImagesQuery } from "@/entities/review/model";
import { useRamenyaDetailQuery } from "@/entities/ramenya/model";
import { useEffect } from "react";
import { useModal } from "@/shared/lib/use-modal";
import { Modal } from "@/shared/ui/modal";
import { ImagePopup } from "@/shared/ui/image-popup";
import render from "@/shared/ui/render";

export const ImagesPage = () => {
  const { id } = useParams();
  const { ramenyaReviewImagesQuery } = useRamenyaReviewImagesQuery(id!);
  const { ramenyaDetailQuery } = useRamenyaDetailQuery(id!);
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
        <TopBar title={ramenyaDetailQuery.data?.name ?? "이미지"} />
      </Header>
      <ImageContainer>
        {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.map((image: string, index: number) => (
          <Image key={index} src={image} onClick={() => handleOpenImagePopup(index)} style={{ cursor: "pointer" }} />
        ))}
      </ImageContainer>

      <Modal isOpen={isImagePopupOpen} onClose={closeImagePopup}>
        {selectedImageIndex !== null && ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls && (
          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeImagePopup}
            images={ramenyaReviewImagesQuery.data.ramenyaReviewImagesUrls}
            selectedIndex={selectedImageIndex}
            onIndexChange={setSelectedImageIndex}
            title={ramenyaDetailQuery.data?.name}
          />
        )}
      </Modal>
    </Wrapper>
  );
};

const Wrapper = render.div("flex flex-col pb-40");

const Header = render.div("flex flex-col w-full max-w-390");

const ImageContainer = render.div("grid grid-cols-3 gap-1");

const Image = render.img("w-full aspect-square object-cover");
