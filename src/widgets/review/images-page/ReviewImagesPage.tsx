import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRamenyaReviewImagesQuery } from "@/entities/review/model";
import { useRamenyaDetailQuery } from "@/entities/ramenya/model";
import { useModal } from "@/shared/lib/useModal";
import { Modal } from "@/shared/ui/modal";
import { ImagePopup } from "@/shared/ui/image-popup";
import TopBar from "@/shared/ui/top-bar";
import render from "@/shared/ui/render";

export const ReviewImagesPage = () => {
  const { id } = useParams();
  const { ramenyaReviewImagesQuery } = useRamenyaReviewImagesQuery(id!);
  const { ramenyaDetailQuery } = useRamenyaDetailQuery(id!);
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Wrapper>
      <Header>
        <TopBar title={ramenyaDetailQuery.data?.name ?? "이미지"} />
      </Header>
      <ImageContainer>
        {ramenyaReviewImagesQuery.data?.ramenyaReviewImagesUrls?.map((image: string, index: number) => (
          <Image key={`${image}-${index}`} src={image} onClick={() => {
            setSelectedImageIndex(index);
            openImagePopup();
          }} />
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

const Image = render.img("aspect-square w-full cursor-pointer object-cover");
