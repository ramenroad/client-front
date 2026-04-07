import { type ChangeEvent, type RefObject } from "react";
import { ImageUploadGrid } from "@/shared/ui/image-upload";
import render from "@/shared/ui/render";

interface ReviewImageSectionProps {
  images: (File | string)[];
  maxImages: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageAddClick: () => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export const ReviewImageSection = ({
  images,
  maxImages,
  fileInputRef,
  onImageAddClick,
  onImageUpload,
  onRemoveImage,
}: ReviewImageSectionProps) => {
  return (
    <Section>
      <Header>
        <TitleBox>
          <Title>사진 첨부</Title>
          <CountBox>
            <Count>{images.length}</Count>
            <CountDivider>/</CountDivider>
            <Count>{maxImages}</Count>
          </CountBox>
        </TitleBox>
        <Caption>라멘과 무관한 사진을 첨부한 리뷰는 무통보 삭제됩니다</Caption>
      </Header>

      <ImageUploadGrid
        images={images}
        maxImages={maxImages}
        fileInputRef={fileInputRef}
        onAddClick={onImageAddClick}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        addButtonAriaLabel="리뷰 이미지 추가"
      />
    </Section>
  );
};

const Section = render.div("mt-36 flex flex-col gap-12");

const Header = render.div("flex flex-col gap-2");

const TitleBox = render.div("flex items-center gap-8");

const Title = render.div("font-16-m text-black");

const CountBox = render.div("flex items-center");

const Count = render.div("font-16-m text-black");

const CountDivider = render.div("font-16-m text-black");

const Caption = render.div("font-12-r text-gray-400");
