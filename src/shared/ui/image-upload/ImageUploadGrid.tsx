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

interface CachedPreviewUrl {
  url: string;
  refCount: number;
  revokeTimer: number | null;
}

const previewUrlCache = new WeakMap<File, CachedPreviewUrl>();
const PREVIEW_URL_REVOKE_DELAY_MS = 1000;

const schedulePreviewUrlRevoke = (file: File, cachedUrl: CachedPreviewUrl) => {
  if (cachedUrl.revokeTimer !== null) {
    return;
  }

  cachedUrl.revokeTimer = window.setTimeout(() => {
    cachedUrl.revokeTimer = null;

    if (cachedUrl.refCount > 0) {
      return;
    }

    URL.revokeObjectURL(cachedUrl.url);
    previewUrlCache.delete(file);
  }, PREVIEW_URL_REVOKE_DELAY_MS);
};

const cancelPreviewUrlRevoke = (cachedUrl: CachedPreviewUrl) => {
  if (cachedUrl.revokeTimer === null) {
    return;
  }

  window.clearTimeout(cachedUrl.revokeTimer);
  cachedUrl.revokeTimer = null;
};

const getPreviewUrlCache = (file: File) => {
  const cachedUrl = previewUrlCache.get(file);

  if (cachedUrl) {
    return cachedUrl;
  }

  const nextCachedUrl: CachedPreviewUrl = {
    url: URL.createObjectURL(file),
    refCount: 0,
    revokeTimer: null,
  };

  previewUrlCache.set(file, nextCachedUrl);
  schedulePreviewUrlRevoke(file, nextCachedUrl);

  return nextCachedUrl;
};

const getPreviewUrl = (image: File | string) => {
  if (typeof image === "string") {
    return image;
  }

  return getPreviewUrlCache(image).url;
};

const retainPreviewUrl = (file: File) => {
  const cachedUrl = getPreviewUrlCache(file);

  cancelPreviewUrlRevoke(cachedUrl);
  cachedUrl.refCount += 1;

  return () => {
    cachedUrl.refCount = Math.max(0, cachedUrl.refCount - 1);

    if (cachedUrl.refCount === 0) {
      schedulePreviewUrlRevoke(file, cachedUrl);
    }
  };
};

const getImagePreviewKey = (image: File | string, index: number) => {
  if (typeof image === "string") {
    return `${index}-${image}`;
  }

  return `${index}-${image.name}-${image.size}-${image.lastModified}`;
};

const ImagePreviewItem = memo(({ image, index, onRemove }: ImagePreviewItemProps) => {
  const [hasError, setHasError] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const imageUrl = useMemo(() => getPreviewUrl(image), [image]);

  useEffect(() => {
    if (!(image instanceof File)) {
      return;
    }

    return retainPreviewUrl(image);
  }, [image]);

  const handleRemove = useCallback(() => {
    if (isRemoving) {
      return;
    }

    setIsRemoving(true);
    onRemove(index);
  }, [index, isRemoving, onRemove]);

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
            key={getImagePreviewKey(image, index)}
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
