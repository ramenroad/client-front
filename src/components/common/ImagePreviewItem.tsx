import { memo, useCallback, useEffect, useState } from "react";
import tw from "twin.macro";
import { IconImageDelete } from "../Icon";

interface ImagePreviewItemProps {
  file: File | string;
  index: number;
  onRemove: (index: number) => void;
}

export const ImagePreviewItem = memo(({ file, index, onRemove }: ImagePreviewItemProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // 이미지 URL 생성 및 관리
  useEffect(() => {
    if (file instanceof File) {
      try {
        const url = URL.createObjectURL(file);
        setImageUrl(url);

        // cleanup 함수
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error("URL 생성 실패:", error);
        setHasError(true);
      }
    } else {
      setImageUrl(file);
    }
  }, [file]);

  const handleRemove = useCallback(() => {
    if (isRemoving) return;

    setIsRemoving(true);

    // URL 즉시 정리
    if (imageUrl && imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }

    onRemove(index);
  }, [index, onRemove, isRemoving, imageUrl]);

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
        <ErrorImagePlaceholder>
          <div>이미지 로드 실패</div>
          <div style={{ fontSize: "10px", marginTop: "4px" }}>삭제 가능</div>
        </ErrorImagePlaceholder>
      )}

      <StyledIconImageDelete onClick={handleRemove} />
    </ImagePreviewContainer>
  );
});

const ImagePreviewContainer = tw.div`
  relative
  w-96 h-96
  rounded-7
  flex items-center justify-center
  border-solid border-1 border-border
`;

const ImagePreview = tw.img`
  w-96 h-96
  object-cover
  rounded-7
`;

const ErrorImagePlaceholder = tw.div`
  w-full h-full
  flex flex-col items-center justify-center
  text-gray-400 text-12
`;

const StyledIconImageDelete = tw(IconImageDelete)`
  absolute top-[-8px] right-[-8px]
  cursor-pointer
`;
