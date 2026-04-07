import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMenuBoardMutation } from "@/features/menu-board/model";
import { useImageUpload } from "@/shared/lib/use-image-upload";
import { Button } from "@/shared/ui/button";
import { UploadLoadingOverlay } from "@/shared/ui/image-upload";
import TopBar from "@/shared/ui/top-bar";
import { useToast } from "@/shared/ui/toast";
import render from "@/shared/ui/render";
import {
  MenuBoardDescriptionSection,
  MenuBoardGuideSection,
  MenuBoardPhotoUploadSection,
  MenuBoardSubmitTopLabel,
} from "@/widgets/menu-board/submit";

const MAX_MENU_BOARD_IMAGES = 5;

export const MenuBoardSubmitPage = () => {
  const { id } = useParams();
  const { openToast } = useToast();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<(File | string)[]>([]);
  const [description, setDescription] = useState("");
  const { add } = useMenuBoardMutation();

  const { fileInputRef, isUploading: isImageUploading, handleImageClick, handleImageUpload, handleRemoveImage } =
    useImageUpload({
      images: selectedImages,
      maxImages: MAX_MENU_BOARD_IMAGES,
      onImagesChange: setSelectedImages,
      onLimitExceeded: (maxImages) => openToast(`이미지는 최대 ${maxImages}개까지 업로드 가능합니다.`),
      onUploadError: () => openToast("이미지 변환에 실패했습니다. 다른 이미지를 선택해주세요."),
    });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      openToast("메뉴판 등록에 실패했습니다.");
      return;
    }

    const formData = new FormData();

    selectedImages
      .filter((image): image is File => image instanceof File)
      .forEach((image) => {
        formData.append("menuBoardImages", image);
      });

    formData.append("ramenyaId", id);
    formData.append("description", description);

    add.mutate(formData, {
      onSuccess: () => {
        openToast("메뉴판 등록 성공");
        navigate(-1);
      },
      onError: () => {
        openToast("메뉴판 등록에 실패했습니다.");
      },
    });
  };

  return (
    <>
      {isImageUploading && <UploadLoadingOverlay />}
      <TopBar title="메뉴판 제보하기" />

      <Form onSubmit={handleSubmit}>
        <MenuBoardSubmitTopLabel />

        <MenuBoardPhotoUploadSection
          images={selectedImages}
          maxImages={MAX_MENU_BOARD_IMAGES}
          fileInputRef={fileInputRef}
          onImageAddClick={handleImageClick}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />

        <MenuBoardDescriptionSection description={description} onDescriptionChange={setDescription} />

        <MenuBoardGuideSection />

        <ButtonWrapper>
          <Button type="submit" variant="primary" disabled={selectedImages.length === 0 || description.length === 0}>
            등록하기
          </Button>
        </ButtonWrapper>
      </Form>
    </>
  );
};

const Form = render.form("flex w-full flex-col box-border");

const ButtonWrapper = render.div("w-full box-border px-20 pb-20");
