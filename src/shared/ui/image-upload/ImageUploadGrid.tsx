import { memo, useCallback, useEffect, useMemo, useState, type ChangeEvent, type RefObject } from "react";
import { IconAdd, IconImageDelete } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

interface ImageUploadGridProps {
  images: (File | string)[];
  maxImages: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAddClick: () => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  inputAccept?: string;
  addButtonAriaLabel?: string;
}

interface ImagePreviewItemProps {
  image: File | string;
  index: number;
  onRemove: (index: number) => void;
}

const ImagePreviewItem = memo(({ image, index, onRemove }: ImagePreviewItemProps) => {
  const [hasError, setHasError] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const imageUrl = useMemo(() => (image instanceof File ? URL.createObjectURL(image) : image), [image]);

  useEffect(() => {
    if (!(image instanceof File)) {
      return;
    }

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [image, imageUrl]);

  const handleRemove = useCallback(() => {
    if (isRemoving) {
      return;
    }

    setIsRemoving(true);

    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }

    onRemove(index);
  }, [imageUrl, index, isRemoving, onRemove]);

  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setHasError(false);
  }, []);

  return (
    <ImagePreviewContainer>
      {imageUrl && !hasError ? (
        <ImagePreview
          src={imageUrl}
          alt={`업로드 이미지 ${index + 1}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <ErrorPlaceholder>
          <ErrorTitle>이미지 로드 실패</ErrorTitle>
          <ErrorCaption>삭제 가능</ErrorCaption>
        </ErrorPlaceholder>
      )}

      <RemoveButton type="button" aria-label={`업로드 이미지 ${index + 1} 삭제`} onClick={handleRemove}>
        <IconImageDelete />
      </RemoveButton>
    </ImagePreviewContainer>
  );
});

export const ImageUploadGrid = ({
  images,
  maxImages,
  fileInputRef,
  onAddClick,
  onImageUpload,
  onRemoveImage,
  inputAccept = "image/*",
  addButtonAriaLabel = "이미지 추가",
}: ImageUploadGridProps) => {
  return (
    <Wrapper>
      <Grid>
        {images.map((image, index) => (
          <ImagePreviewItem
            key={`${index}-${image instanceof File ? image.name : image}`}
            image={image}
            index={index}
            onRemove={onRemoveImage}
          />
        ))}
        {images.length < maxImages && (
          <AddButton type="button" onClick={onAddClick} aria-label={addButtonAriaLabel}>
            <IconAdd />
          </AddButton>
        )}
        <HiddenFileInput type="file" ref={fileInputRef} onChange={onImageUpload} accept={inputAccept} multiple />
      </Grid>
    </Wrapper>
  );
};

const Wrapper = render.div("flex flex-col gap-12");

const Grid = render.div("flex flex-row flex-wrap gap-12");

const HiddenFileInput = render.input("hidden");

const ImagePreviewContainer = render.div(
  "relative w-96 h-96 rounded-[7px] flex items-center justify-center border border-solid border-border overflow-hidden",
);

const ImagePreview = render.img("w-full h-full object-cover rounded-[7px]");

const ErrorPlaceholder = render.div("w-full h-full flex flex-col items-center justify-center bg-gray-100 text-center");

const ErrorTitle = render.div("font-12-r text-gray-400");

const ErrorCaption = render.div("mt-4 text-[10px] text-gray-400");

const RemoveButton = render.button("absolute top-[-8px] right-[-8px] border-none bg-transparent p-0 cursor-pointer");

const AddButton = render.button(
  "flex items-center justify-center w-96 h-96 rounded-[8px] bg-border border border-solid border-gray-200 border-dashed cursor-pointer",
);
