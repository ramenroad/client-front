import { useCallback, useRef, useState } from "react";
import { compressImage, convertHeicToJpeg, validateImageFile } from "../../util/image";

interface UseImageUploadOptions {
  maxCount?: number;
  onError?: (error: string) => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const { maxCount = 10, onError } = options;

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImages = useCallback(
    async (files: FileList): Promise<File[]> => {
      const fileArray = Array.from(files);
      const processedImages: File[] = [];

      for (const file of fileArray) {
        // 이미지 검증
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          onError?.(validation.error || "유효하지 않은 파일입니다.");
          continue;
        }

        // HEIC 파일 변환
        let processedFile = await convertHeicToJpeg(file);

        // 모바일 최적화를 위한 이미지 압축 (1MB 이상일 때만)
        if (processedFile.size > 1024 * 1024) {
          processedFile = await compressImage(processedFile, 800, 0.8);
        }

        processedImages.push(processedFile);
      }

      return processedImages;
    },
    [onError],
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const currentCount = selectedImages.length;
      const availableSlots = maxCount - currentCount;

      if (files.length > availableSlots) {
        onError?.(`이미지는 최대 ${maxCount}개까지 업로드 가능합니다.`);
        return;
      }

      try {
        setIsUploading(true);
        const processedImages = await processImages(files);
        setSelectedImages((prev) => [...prev, ...processedImages]);
      } catch (error) {
        console.error("이미지 처리 중 오류:", error);
        onError?.("이미지 처리에 실패했습니다. 다른 이미지를 선택해주세요.");
      } finally {
        setIsUploading(false);
      }

      // input 값 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [selectedImages.length, maxCount, processImages, onError],
  );

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearImages = useCallback(() => {
    setSelectedImages([]);
  }, []);

  return {
    selectedImages,
    isUploading,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    handleImageClick,
    clearImages,
  };
};
