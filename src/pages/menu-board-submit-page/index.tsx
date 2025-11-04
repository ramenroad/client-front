import tw from "twin.macro";
import TopBar from "../../components/top-bar";
import { RaisingText } from "../../components/common/RamenroadText";
import { useState, createRef, useCallback, memo, useMemo, useEffect } from "react";
import { IconAdd, IconImageDelete, IconMenuBoardRightImage, IconMenuBoardWrongImage } from "../../components/Icon";
import heic2any from "heic2any";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lotties/loading.json";
import { Line } from "../../components/common/Line";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Button } from "../../components/common/Button";
import MenuBoardImage1 from "../../assets/images/menu-board/menu-board-1.png";
import MenuBoardImage2 from "../../assets/images/menu-board/menu-board-2.png";
import { useNavigate, useParams } from "react-router-dom";
import { useMenuBoardMutation } from "../../hooks/mutation/useMenuBoardMutation";
import { useToast } from "../../components/toast/ToastProvider";

// 이미지 압축 및 리사이징 함수
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // 비율 유지하면서 리사이징
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // 모바일에서 성능 향상을 위한 최적화 설정
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality,
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// HEIC 파일을 JPEG로 변환하는 함수
const convertHeicToJpeg = async (file: File): Promise<File> => {
  // HEIC 파일이 아닌 경우 그대로 반환
  if (!file.type.includes("heic") && !file.name.toLowerCase().endsWith(".heic")) {
    return file;
  }

  try {
    // heic2any를 사용하여 HEIC를 JPEG로 변환
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    // 파일명에서 .heic 확장자를 .jpg로 변경
    const fileName = file.name.replace(/\.heic$/i, ".jpg");

    // Blob을 File로 변환
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    const convertedFile = new File([blob], fileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    return convertedFile;
  } catch (error) {
    console.error("HEIC 변환 실패:", error);
    throw new Error("HEIC 파일 변환에 실패했습니다.");
  }
};

// 모바일 디바이스 감지 함수
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 모바일 최적화된 Lottie 컴포넌트
const OptimizedLottie = memo(() => {
  const [shouldRender, setShouldRender] = useState(true);
  const isMobile = useMemo(() => isMobileDevice(), []);

  useEffect(() => {
    if (isMobile) {
      // 모바일에서는 3초 후 Lottie를 간단한 텍스트로 교체
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  if (!shouldRender && isMobile) {
    return <MobileLoadingText>처리중...</MobileLoadingText>;
  }

  return (
    <LottieWrapper>
      <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
    </LottieWrapper>
  );
});

// 이미지 미리보기 컴포넌트
const ImagePreviewItem = memo(
  ({ file, index, onRemove }: { file: File | string; index: number; onRemove: (index: number) => void }) => {
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
  },
);

export const MenuBoardSubmitPage = () => {
  const { id } = useParams();
  const { openToast } = useToast();

  const navigate = useNavigate();

  const [selectedImages, setSelectedImages] = useState<(File | string)[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [description, setDescription] = useState("");

  const fileInputRef = createRef<HTMLInputElement>();

  const { addMenuBoard } = useMenuBoardMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 로직을 여기에 추가할 수 있습니다

    if (!id) {
      openToast("메뉴판 등록에 실패했습니다.");
      return;
    }

    const formData = new FormData();

    // selectedImages에서 File 객체만 필터링하여 fileArray로 변환
    const fileArray: File[] = selectedImages.filter((image): image is File => image instanceof File);

    // 각 파일을 개별적으로 FormData에 추가 (백엔드에서 배열로 받음)
    fileArray.forEach((file) => {
      formData.append("menuBoardImages", file);
    });

    formData.append("ramenyaId", id);
    formData.append("description", description);

    addMenuBoard.mutate(formData, {
      onSuccess: () => {
        openToast("메뉴판 등록 성공");
        navigate(-1);
      },
      onError: () => {
        openToast("메뉴판 등록에 실패했습니다.");
      },
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const currentImages = selectedImages;

      if (currentImages.length + files.length > 5) {
        alert("이미지는 최대 5개까지 업로드 가능합니다.");
        return;
      }

      // 모바일 브라우저에서는 역순으로 업로드
      const fileArray = Array.from(files);
      const newImages: File[] = [];

      try {
        setIsImageUploading(true);

        for (const file of fileArray) {
          if (currentImages.length + newImages.length >= 5) break;

          // HEIC 파일 변환
          let convertedFile = await convertHeicToJpeg(file);

          // 모바일 최적화를 위한 이미지 압축 (1MB 이상일 때만)
          if (convertedFile.size > 1024 * 1024) {
            convertedFile = await compressImage(convertedFile, 800, 0.8);
          }

          newImages.push(convertedFile);
        }

        setSelectedImages([...currentImages, ...newImages]);
      } catch (error) {
        console.error("이미지 변환 중 오류:", error);
        alert("이미지 변환에 실패했습니다. 다른 이미지를 선택해주세요.");
      } finally {
        setIsImageUploading(false);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [fileInputRef, selectedImages],
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      // 현재 값을 안전하게 가져와서 업데이트
      const currentImages = selectedImages;

      // 유효성 검사
      if (index < 0 || index >= currentImages.length) {
        console.warn("잘못된 이미지 인덱스:", index);
        return;
      }

      // 새로운 이미지 배열 생성
      const newImages = [...currentImages];
      newImages.splice(index, 1);

      // 업데이트
      setSelectedImages(newImages);
    },
    [selectedImages],
  );

  return (
    <>
      {isImageUploading && (
        <LoadingOverlay>
          <OptimizedLottie />
        </LoadingOverlay>
      )}
      <TopBar title="메뉴판 제보하기" />

      <Container onSubmit={handleSubmit}>
        <TopLabel />

        <PhotoUploadSection
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          fileInputRef={fileInputRef}
          handleImageClick={handleImageClick}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
        />

        <DescriptionSection description={description} onDescriptionChange={setDescription} />

        <GuideSection />

        <ButtonWrapper>
          <Button type="submit" variant="primary" disabled={selectedImages.length === 0 || description.length === 0}>
            등록하기
          </Button>
        </ButtonWrapper>
      </Container>
    </>
  );
};

const ButtonWrapper = tw.div`
  box-border w-full
  pb-20 px-20
`;

const Container = tw.form`
  flex flex-col box-border
  w-full
`;

const TopLabel = () => {
  return (
    <TopLabelContainer>
      <HighlightedText size={14} weight="m">
        직접 촬영한{" "}
      </HighlightedText>
      <RaisingText size={14} weight="r">
        메뉴판/키오스크 사진을 등록해주세요
      </RaisingText>
    </TopLabelContainer>
  );
};

const TopLabelContainer = tw.div`
  w-full h-44 box-border
  bg-lightOrange
  px-20 py-12
  flex items-center gap-2
`;

const HighlightedText = tw(RaisingText)`
  text-orange  
`;

interface PhotoUploadSectionProps {
  selectedImages: (File | string)[];
  setSelectedImages: (images: (File | string)[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageClick: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}

const PhotoUploadSection = (props: PhotoUploadSectionProps) => {
  const { selectedImages, fileInputRef, handleImageClick, handleImageUpload, handleRemoveImage } = props;

  return (
    <PhotoUploadSectionContainer>
      <PhotoUploadSectionTitleContainer>
        <PhtotoUploadSectionTitleWrapper>
          <PhotoUploadSectionTitleText size={16} weight="m">
            사진 첨부
          </PhotoUploadSectionTitleText>

          <RaisingText size={16} weight="r">
            {selectedImages?.length ?? 0}
          </RaisingText>
          <PhotoUploadSectionTotalUploadableCount size={16} weight="r">
            /5
          </PhotoUploadSectionTotalUploadableCount>
        </PhtotoUploadSectionTitleWrapper>
        <PhotoUploadSectionCaption size={12} weight="r">
          JPG, JPEG, PNG, Webp 형식만 업로드 할 수 있습니다.
        </PhotoUploadSectionCaption>
      </PhotoUploadSectionTitleContainer>

      <PhotoUploadSectionImageContainer>
        <ImageUploadContent>
          <ImageUploadContentImage>
            {selectedImages?.map((image, index) => (
              <ImagePreviewItem
                key={`${index}-${image instanceof File ? image.name : image}`}
                file={image}
                index={index}
                onRemove={handleRemoveImage}
              />
            ))}
            {(selectedImages?.length ?? 0) < 5 && (
              <ImageAddButton onClick={handleImageClick} type="button">
                <IconAdd />
              </ImageAddButton>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              style={{ display: "none" }}
            />
          </ImageUploadContentImage>
        </ImageUploadContent>
      </PhotoUploadSectionImageContainer>

      <LineWrapper>
        <Line />
      </LineWrapper>
    </PhotoUploadSectionContainer>
  );
};

const LineWrapper = tw.div`
  pt-20
`;

const PhotoUploadSectionContainer = tw.div`
  w-full box-border
  p-20
`;

const PhotoUploadSectionTitleContainer = tw.div`
  flex justify-center flex-col
`;

const PhtotoUploadSectionTitleWrapper = tw.div`
  pr-8
`;

const PhotoUploadSectionTitleText = tw(RaisingText)`
  pr-8
`;

const PhotoUploadSectionTotalUploadableCount = tw(RaisingText)`
  text-filter-text
`;

const PhotoUploadSectionCaption = tw(RaisingText)`
  text-gray-500
`;

const PhotoUploadSectionImageContainer = tw.div`
  mt-16
`;

const ImageUploadContent = tw.div`
  flex flex-col gap-12
`;

const ImageUploadContentImage = tw.div`
  flex flex-row flex-wrap gap-12
`;

const ImagePreviewContainer = tw.div`
  relative
  w-96 h-96
  rounded-7
  flex items-center justify-center
  border-solid border-1 border-border
`;

const ImagePreview = tw.img`
  w-full h-full
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

const ImageAddButton = tw.button`
  flex items-center justify-center
  w-96 h-96 rounded-8 bg-border
  border-solid border-1 border-gray-200
  border-dashed
  cursor-pointer
`;

const LoadingOverlay = tw.div`
  fixed
  top-0 left-0 right-0 bottom-0
  bg-[#000000]/20
  flex flex-col justify-start items-center
  pt-[40vh]
  z-10
`;

const LottieWrapper = tw.div``;

const MobileLoadingText = tw.div`
  font-16-m text-white
  text-center
  py-4
`;

interface DescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

const DescriptionSection = (props: DescriptionSectionProps) => {
  const { description, onDescriptionChange } = props;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      onDescriptionChange(value);
    }
  };

  return (
    <DescriptionWrapper>
      <DescriptionTextAreaContainer>
        <DescriptionTextarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="(선택) 메뉴판에 대한 설명을 입력해 주세요.
이미지와 함께 게재됩니다."
          maxLength={50}
        />
        <CharacterCount>
          <TypedCount>{description.length}</TypedCount>/50
        </CharacterCount>
      </DescriptionTextAreaContainer>
    </DescriptionWrapper>
  );
};

const DescriptionWrapper = tw.div`
  flex flex-col gap-16
  box-border px-20
  relative
`;

const DescriptionTextAreaContainer = tw.div`
  flex flex-col gap-4 relative
  bg-border
  rounded-8
  px-12 pt-10
  pb-36
  border-solid border-1 border-transparent
  outline-none
  box-border
  focus-within:(border-orange)
`;

const DescriptionTextarea = styled.textarea(() => [
  tw`
    flex h-110 w-full
    bg-transparent
    border-none
    font-14-r
    font-pretendard
    resize-none
    outline-none
    text-black
  `,
  css`
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 3px;
    }
  `,
]);

// 글자 수 표시 스타일
const CharacterCount = tw.div`
  absolute bottom-14 right-12
  font-14-r text-gray-400
`;

const TypedCount = tw.span`
  font-14-r text-black
`;

const GuideSection = () => {
  return (
    <GuideSectionWrapper>
      <GuideSectionContainer>
        <GuideSectionTitle>메뉴판 제보 가이드</GuideSectionTitle>
        <GuideSectionContent>
          <GuideSectionHighlightedText>정면</GuideSectionHighlightedText>에서 촬영한 사진을 등록해 주세요
          <GuideSectionImageContainer>
            <GuideSectionImageOverlay>
              <GuideSectionImage src={MenuBoardImage1} alt="메뉴판 이미지" />
              <GuideSectionImageIcon status="right">
                <IconMenuBoardRightImage />
              </GuideSectionImageIcon>
            </GuideSectionImageOverlay>
            <GuideSectionImageOverlay>
              <GuideSectionImage src={MenuBoardImage2} alt="메뉴판 이미지" />
              <GuideSectionImageIcon status="wrong">
                <IconMenuBoardWrongImage />
              </GuideSectionImageIcon>
            </GuideSectionImageOverlay>
          </GuideSectionImageContainer>
        </GuideSectionContent>
      </GuideSectionContainer>

      <GuideCaption>제보하신 정보는 검수 후 게재됩니다. 감사합니다.</GuideCaption>
    </GuideSectionWrapper>
  );
};

const GuideSectionWrapper = tw.div`
  box-border w-full
  px-20 pt-20
`;

const GuideSectionContainer = tw.div`
  box-border w-full
  flex flex-col items-center
  rounded-8
  h-190
  pt-20 pb-27
  bg-border
`;

const GuideSectionTitle = tw.div`
  font-14-sb text-gray-800
`;

const GuideSectionContent = tw.div`
  font-14-m text-gray-800
`;

const GuideSectionImageContainer = tw.div`
  flex flex-row gap-20
  pt-16
`;

const GuideSectionImageOverlay = tw.div`
  relative
`;

const GuideSectionImageIcon = styled.div<{ status: "right" | "wrong" }>(({ status }) => [
  tw`
    absolute bottom-[2px] right-[-13px]
    rounded-full
    w-23 h-23
    flex items-center justify-center
  `,
  status === "right" && tw`bg-[#06B526]`,
  status === "wrong" && tw`bg-[#FF5234]`,
]);

const GuideSectionImage = tw.img`
  w-86 h-86
  object-cover
  rounded-4
`;

const GuideSectionHighlightedText = tw.span`
  text-[#06B526] font-14-m
`;

const GuideCaption = tw.div`
  text-gray-500 font-14-m
  pt-14 pb-73
`;
