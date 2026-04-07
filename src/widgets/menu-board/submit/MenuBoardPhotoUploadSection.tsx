import { type ChangeEvent, type RefObject } from "react";
import { Line } from "@/shared/ui/line";
import { RaisingText } from "@/shared/ui/text";
import { ImageUploadGrid } from "@/shared/ui/image-upload";
import render from "@/shared/ui/render";

interface MenuBoardPhotoUploadSectionProps {
  images: (File | string)[];
  maxImages: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageAddClick: () => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export const MenuBoardPhotoUploadSection = ({
  images,
  maxImages,
  fileInputRef,
  onImageAddClick,
  onImageUpload,
  onRemoveImage,
}: MenuBoardPhotoUploadSectionProps) => {
  return (
    <Section>
      <Header>
        <TitleRow>
          <Title size={16} weight="m">
            사진 첨부
          </Title>
          <RaisingText size={16} weight="r">
            {images.length}
          </RaisingText>
          <Count size={16} weight="r">
            /{maxImages}
          </Count>
        </TitleRow>
        <Caption size={12} weight="r">
          JPG, JPEG, PNG, Webp 형식만 업로드 할 수 있습니다.
        </Caption>
      </Header>

      <ImageArea>
        <ImageUploadGrid
          images={images}
          maxImages={maxImages}
          fileInputRef={fileInputRef}
          onAddClick={onImageAddClick}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          addButtonAriaLabel="메뉴판 이미지 추가"
        />
      </ImageArea>

      <LineWrapper>
        <Line />
      </LineWrapper>
    </Section>
  );
};

const Section = render.div("box-border w-full p-20");

const Header = render.div("flex flex-col justify-center");

const TitleRow = render.div("pr-8");

const Title = render.extend(RaisingText, "pr-8");

const Count = render.extend(RaisingText, "text-filter-text");

const Caption = render.extend(RaisingText, "text-gray-500");

const ImageArea = render.div("mt-16");

const LineWrapper = render.div("pt-20");
