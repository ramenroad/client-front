import TopBar from "../../components/top-bar/index.tsx";
import tw from "twin.macro";
import { IconStarLarge, IconAdd, IconClose } from "../../components/Icon/index.tsx";
import styled from "@emotion/styled";
import { createRef, useState, useEffect, useCallback, memo, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Review } from "../../types";
import {
  useRamenyaReviewDetailQuery,
  useRamenyaReviewEditMutation,
} from "../../hooks/queries/useRamenyaReviewQuery.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/common/Modal";
import { css } from "@emotion/react";
import { useSignInStore } from "../../states/sign-in";
import { useModal } from "../../hooks/common/useModal";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lotties/loading.json";
import { useRamenyaDetailQuery } from "../../hooks/queries/useRamenyaDetailQuery.ts";
import heic2any from "heic2any";
import { useToast } from "../../components/toast/ToastProvider.tsx";

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

// 이미지 미리보기 컴포넌트 - 간단하고 안정적인 버전
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

        <ImageRemoveButton
          onClick={handleRemove}
          type="button"
          disabled={isRemoving}
          style={{
            backgroundColor: hasError ? "#ff5454" : "white",
            color: hasError ? "white" : "#585858",
          }}
        >
          <IconClose width={9} height={9} color={hasError ? "white" : "#585858"} />
        </ImageRemoveButton>
      </ImagePreviewContainer>
    );
  },
);

export const EditReviewPage = () => {
  const { id: reviewId } = useParams();
  const { mutate: editReview, isPending: isSubmitting } = useRamenyaReviewEditMutation(reviewId!);
  const { openToast } = useToast();
  const { reviewDetailQuery } = useRamenyaReviewDetailQuery(reviewId!);
  const reviewDetail = reviewDetailQuery.data;

  const { data: ramenyaDetail } = useRamenyaDetailQuery(reviewDetail?.ramenyaId?._id);

  const navigate = useNavigate();
  const { isOpen: isBackModalOpen, open: openBackModal, close: closeBackModal } = useModal();
  const { isOpen: isLoginModalOpen, open: openLoginModal, close: closeLoginModal } = useModal();
  const { isSignIn } = useSignInStore();

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [customMenuInput, setCustomMenuInput] = useState("");
  const [menuList, setMenuList] = useState(reviewDetail?.menus?.map((menu) => menu) || []);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const fileInputRef = createRef<HTMLInputElement>();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<Review>({
    defaultValues: {
      ramenyaId: reviewDetail?.ramenyaId._id || "",
      rating: reviewDetail?.rating || 0,
      review: reviewDetail?.review || "",
      reviewImages: [],
      menus: reviewDetail?.menus?.join(",") || "",
    },
    mode: "onChange",
  });

  const formValues = watch();

  const handleStarClick = (index: number) => {
    setValue("rating", index, { shouldValidate: true });
  };

  const handleMenuClick = (menu: string) => {
    if (selectedMenus.includes(menu)) {
      setSelectedMenus(selectedMenus.filter((item) => item !== menu));
    } else {
      if (selectedMenus.length < 2) {
        setSelectedMenus([...selectedMenus, menu]);
      }
    }
  };

  const handleAddCustomMenu = () => {
    if (customMenuInput.trim() !== "" && !menuList.includes(customMenuInput)) {
      setMenuList([...menuList, customMenuInput]);
      if (selectedMenus.length < 2) {
        setSelectedMenus([...selectedMenus, customMenuInput]);
      }
      setCustomMenuInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddCustomMenu();
    }
  };

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const currentImages = formValues.reviewImages || [];

      if (currentImages.length + files.length > 5) {
        openToast("이미지는 최대 5개까지 업로드 가능합니다.");
        return;
      }

      // 모바일 브라우저에서는 역순으로 업로드
      const fileArray = Array.from(files);
      const newImages: (File | string)[] = [];

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

        setValue("reviewImages", [...currentImages, ...newImages], {
          shouldValidate: true,
        });
      } catch (error) {
        console.error("이미지 변환 중 오류:", error);
        openToast("이미지 변환에 실패했습니다. 다른 이미지를 선택해주세요.");
      } finally {
        setIsImageUploading(false);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [formValues.reviewImages, setValue],
  );

  const handleImageClick = () => {
    if ((formValues.reviewImages?.length ?? 0) < 5) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = useCallback(
    (index: number) => {
      // 현재 값을 안전하게 가져와서 업데이트
      const currentImages = formValues.reviewImages || [];

      // 유효성 검사
      if (index < 0 || index >= currentImages.length) {
        console.warn("잘못된 이미지 인덱스:", index);
        return;
      }

      // 새로운 이미지 배열 생성
      const newImages = [...currentImages];
      newImages.splice(index, 1);

      // react-hook-form에 업데이트
      setValue("reviewImages", newImages, { shouldValidate: true });
    },
    [formValues.reviewImages, setValue],
  );

  const onSubmit = async (values: Review) => {
    if (!isSignIn) {
      openLoginModal();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ramenyaId", values.ramenyaId);
      formData.append("rating", values.rating.toString());
      formData.append("review", values.review);
      formData.append("menus", values.menus);

      // 기존 이미지와 새로운 이미지를 구분하여 처리
      const existingImages: string[] = [];
      const newImages: File[] = [];

      if (values.reviewImages) {
        values.reviewImages.forEach((image) => {
          if (image instanceof File) {
            newImages.push(image);
          } else if (typeof image === "string") {
            existingImages.push(image);
          }
        });
      }

      // 기존 이미지는 쉼표로 구분된 문자열로 전송
      formData.append("reviewImageUrls", existingImages.join(","));

      // 새로운 이미지는 각각 파일로 전송
      newImages.forEach((image) => {
        formData.append("reviewImages", image);
      });

      await editReview(formData, {
        onSuccess: () => {
          openToast("리뷰가 수정되었습니다.");
          navigate(-1);
        },
        onError: (error) => {
          console.error("리뷰 수정 중 에러 발생:", error);
          openToast("리뷰 수정에 실패했습니다.");
        },
      });
    } catch (error) {
      console.error("리뷰 수정 중 에러 발생:", error);
      openToast("리뷰 수정에 실패했습니다.");
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      openBackModal();
    } else {
      navigate(-1);
    }
  };

  const handleConfirmBack = () => {
    closeBackModal();
    navigate(-1);
  };

  const handleCancelBack = () => {
    closeBackModal();
  };

  const handleLoginConfirm = () => {
    closeLoginModal();
    navigate("/login");
  };

  const isFormValid =
    formValues.rating > 0 &&
    (formValues.menus ? formValues.menus.split(",").filter(Boolean).length > 0 : false) &&
    formValues.review.trim().length >= 10;

  useEffect(() => {
    if (!reviewId) {
      navigate(-1);
      return;
    }
  }, [reviewId, navigate]);

  useEffect(() => {
    if (reviewDetailQuery.isError) {
      openToast("리뷰 정보를 불러오는데 실패했습니다.");
      navigate(-1);
    }
  }, [reviewDetailQuery.isError, navigate, openToast]);

  useEffect(() => {
    if (ramenyaDetail?.menus) {
      setMenuList([...new Set([...(ramenyaDetail?.menus ?? []), ...(reviewDetail?.menus ?? [])])]);
    }
  }, [reviewDetail?.menus, ramenyaDetail?.menus]);

  useEffect(() => {
    if (!reviewDetail) return;

    const hasChanges =
      isDirty ||
      (formValues.reviewImages?.length ?? 0) > 0 ||
      formValues.rating > 0 ||
      (formValues.menus ? formValues.menus.split(",").filter(Boolean).length > 0 : false) ||
      formValues.review.trim().length > 0;

    setIsFormDirty(hasChanges);
  }, [isDirty, formValues.reviewImages, formValues.rating, formValues.menus, formValues.review, reviewDetail]);

  useEffect(() => {
    setValue("menus", selectedMenus.join(","), { shouldValidate: true });
  }, [selectedMenus, setValue]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (reviewDetail && reviewDetailQuery.isSuccess) {
      reset({
        ramenyaId: reviewDetail.ramenyaId._id,
        rating: reviewDetail.rating,
        review: reviewDetail.review,
        menus: Array.isArray(reviewDetail.menus) ? reviewDetail.menus.join(",") : reviewDetail.menus,
        reviewImages: reviewDetail.reviewImageUrls || [],
      });
      setSelectedMenus(reviewDetail.menus ?? []);
    }
  }, [reviewDetail, reset, reviewDetailQuery.isSuccess]);

  const isLoading = reviewDetailQuery.isLoading;

  return (
    <Wrapper>
      {(isSubmitting || isImageUploading) && (
        <LoadingOverlay>
          <OptimizedLottie />
        </LoadingOverlay>
      )}
      <Header>
        <TopBar title="리뷰 수정하기" onBackClick={handleBackClick} />
      </Header>
      {isLoading ? (
        <LoadingWrapper>
          <LoadingText>로딩중...</LoadingText>
        </LoadingWrapper>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ContentsWrapper>
            <StarWrapper>
              <StarTitle>라멘은 만족하셨나요?</StarTitle>
              <StarContainer>
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <StarButton key={starIndex} onClick={() => handleStarClick(starIndex)} type="button">
                    <IconStarLarge color={starIndex <= formValues.rating ? "#FFCC00" : "#E1E1E1"} />
                  </StarButton>
                ))}
              </StarContainer>
              {errors.rating && <ErrorMessage>별점을 선택해주세요</ErrorMessage>}
            </StarWrapper>
            <Divider />

            <MenuWrapper>
              <MenuTitleBox>
                <MenuTitle>어떤 메뉴를 드셨나요?</MenuTitle>
                <MenuSubTitle>최대 2개 선택 가능</MenuSubTitle>
              </MenuTitleBox>
              <MenuTabContainer>
                {menuList.map((menu, index) => (
                  <MenuTab key={index} selected={selectedMenus.includes(menu)} onClick={() => handleMenuClick(menu)}>
                    {menu}
                  </MenuTab>
                ))}
              </MenuTabContainer>
              {errors.menus && <ErrorMessage>메뉴를 선택해주세요</ErrorMessage>}
            </MenuWrapper>

            <MenuAddWrapper>
              <MenuAddTitle>찾으시는 메뉴가 없나요? 직접 추가해주세요</MenuAddTitle>
              <MenuInputContainer>
                <MenuInput
                  value={customMenuInput}
                  onChange={(e) => setCustomMenuInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="메뉴명을 입력해주세요"
                />
                <MenuAddButton onClick={handleAddCustomMenu} type="button">
                  추가
                </MenuAddButton>
              </MenuInputContainer>
            </MenuAddWrapper>

            <ReviewDescriptionWrapper>
              <ReviewDescriptionTitle>어떤 점이 좋았나요?</ReviewDescriptionTitle>
              <Controller
                name="review"
                control={control}
                rules={{ required: true, minLength: 10 }}
                render={({ field }) => (
                  <ReviewTextAreaContainer>
                    <ReviewDescriptionTextarea {...field} placeholder="최소 10자 이상 입력해주세요" />
                    <CharacterCount>
                      <TypedCount>{field.value.length}</TypedCount>/300
                    </CharacterCount>
                  </ReviewTextAreaContainer>
                )}
              />
            </ReviewDescriptionWrapper>

            <ImageUploadWrapper>
              <ImageUploadHeader>
                <ImageUploadTitleBox>
                  <ImageUploadTitle>사진 첨부</ImageUploadTitle>
                  <ImageCountBox>
                    <ImageAdded>{formValues.reviewImages?.length}</ImageAdded>
                    <ImageAddedText>/</ImageAddedText>
                    <ImageMax>5</ImageMax>
                  </ImageCountBox>
                </ImageUploadTitleBox>
                <ImageUploadSubTitle>라멘과 무관한 사진을 첨부한 리뷰는 무통보 삭제됩니다</ImageUploadSubTitle>
              </ImageUploadHeader>

              <ImageUploadContent>
                <ImageUploadContentImage>
                  {formValues.reviewImages?.map((image, index) => (
                    <ImagePreviewItem
                      key={`${index}-${image instanceof File ? image.name : image}`}
                      file={image}
                      index={index}
                      onRemove={handleRemoveImage}
                    />
                  ))}
                  {(formValues.reviewImages?.length ?? 0) < 5 && (
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
            </ImageUploadWrapper>

            <AddReviewButton active={isFormValid} disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "수정중..." : "수정하기"}
            </AddReviewButton>
          </ContentsWrapper>
        </form>
      )}

      <Modal isOpen={isBackModalOpen} onClose={handleCancelBack}>
        <ModalContent>
          <ModalText>리뷰 수정을 멈추고 뒤로 갈까요?</ModalText>
          <ModalButtonBox>
            <ModalCancelButton onClick={handleCancelBack}>취소</ModalCancelButton>
            <ModalConfirmButton onClick={handleConfirmBack}>확인</ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>로그인이 필요해요</ModalTitle>
            <ModalText>로그인 하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton onClick={closeLoginModal}>취소</ModalCancelButton>
            <ModalConfirmButton onClick={handleLoginConfirm}>확인</ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

const LoadingOverlay = tw.div`
    fixed
    top-0 left-0 right-0 bottom-0
    bg-[#000000]/20
    flex flex-col justify-start items-center
    pt-[40vh]
    z-10
`;

const LottieWrapper = tw.div`
`;

const Wrapper = tw.div`
    flex 
    flex-col 
    w-full
    pb-40
`;

const Header = tw.div`
`;

const ContentsWrapper = tw.div`
    flex 
    flex-col
    px-20
`;

const StarWrapper = tw.div`
    flex flex-col
    items-center
    pt-20
    pb-32
    gap-12
`;

const StarTitle = tw.div`
    font-16-m text-black
`;

const StarContainer = tw.div`
    flex gap-8 items-center
`;

const Divider = tw.div`
    w-full h-1 bg-divider
`;

const MenuWrapper = tw.div`
    flex flex-col mt-32 gap-12
`;

const MenuTitleBox = tw.div`
    flex items-center
    gap-4
`;

const MenuTitle = tw.div`
    font-16-m text-black
`;

const MenuSubTitle = tw.div`
    font-12-r text-gray-400
`;

const MenuTabContainer = tw.div`
    flex flex-wrap gap-8
`;

interface MenuTabProps {
  selected: boolean;
}

const MenuTab = styled.div<MenuTabProps>(({ selected }) => [
  tw`
    flex w-fit h-29 box-border
    items-center
    bg-white
    border-solid border-1 border-gray-400
    font-14-m text-gray-400
    py-4 px-12 rounded-50
    cursor-pointer
    `,
  selected &&
    tw`
        border-orange
        text-orange
    `,
]);

const MenuAddWrapper = tw.div`
    flex flex-col mt-20 gap-12
`;

const MenuAddTitle = tw.div`
    font-14-r text-black
`;

const MenuInputContainer = tw.div`
    flex items-center gap-4
    
`;

const MenuInput = tw.input`
    flex-1 h-44 rounded-8 
    bg-border box-border
    px-12 py-10
    font-16-r
    border-solid border-1 border-transparent
    outline-none
    text-black
    focus-within:(border-orange)
`;

const MenuAddButton = tw.button`
    w-67 h-43 rounded-8 text-black
    px-10 py-8 bg-white
    border-solid border-1 border-gray-100
`;

const ReviewDescriptionWrapper = tw.div`
    flex flex-col mt-32 gap-12
    relative
`;

const ReviewDescriptionTitle = tw.div`
    font-16-m text-black
`;

const ReviewTextAreaContainer = tw.div`
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

const ReviewDescriptionTextarea = styled.textarea(() => [
  tw`
    flex h-214 w-full
    bg-transparent
    border-none
    font-16-r
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

const CharacterCount = tw.div`
    absolute bottom-14 right-12
    font-14-r text-gray-400
`;

const TypedCount = tw.span`
    font-14-r text-black
`;

const ImageUploadWrapper = tw.div`
    flex flex-col mt-32 gap-12
`;

const ImageUploadHeader = tw.div`
    flex flex-col gap-2
`;

const ImageUploadTitleBox = tw.div`
    flex items-center gap-8
`;

const ImageUploadTitle = tw.div`
    font-16-m text-black
`;

const ImageCountBox = tw.div`
    flex items-center
`;

const ImageAdded = tw.div`
    font-16-m text-black
`;

const ImageAddedText = tw.div`
    font-16-m text-black
`;

const ImageMax = tw.div`
    font-16-m text-black
`;

const ImageUploadSubTitle = tw.div`
    font-12-r text-gray-400
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
    rounded-8
    overflow-visible
    border-solid border-1 border-gray-200
`;

const ImagePreview = tw.img`
    w-full h-full
    object-cover
    rounded-8
`;

const ImageRemoveButton = tw.button`
    absolute top-[-8px] right-[-8px]
    w-24 h-24
    flex items-center justify-center
    bg-white
    rounded-full
    cursor-pointer
    shadow-md
    border-solid border-1 border-gray-200
    z-10
`;

const ImageAddButton = tw.button`
    flex items-center justify-center
    w-96 h-96 rounded-8 bg-border
    border-solid border-1 border-gray-200
    border-dashed
    cursor-pointer
`;

interface AddReviewButtonProps {
  active: boolean;
  disabled?: boolean;
}

const AddReviewButton = styled.button<AddReviewButtonProps>(({ active, disabled }) => [
  tw`
    flex items-center justify-center
    mt-32
    w-full h-48 rounded-8 text-white
    px-10 py-10 bg-gray-200
    border-none box-border
    `,
  active && !disabled && tw`bg-orange cursor-pointer`,
  (!active || disabled) && tw`cursor-not-allowed`,
]);

const StarButton = tw.button`
    bg-transparent border-none cursor-pointer p-0 m-0
`;

const ErrorMessage = tw.div`
    font-12-r text-red
    mt-4
`;

const ModalContent = tw.div`
    flex flex-col gap-16 w-290 pt-32
    items-center
    justify-center
    bg-white
    rounded-12
`;

const ModalTextBox = tw.div`
    flex flex-col
`;

const ModalTitle = tw.div`
    font-16-sb text-gray-900
    text-center
`;

const ModalText = tw.div`
    font-16-r text-gray-900
    text-center
`;

const ModalButtonBox = tw.div`
    flex h-60 w-full
`;

const ModalCancelButton = tw.button`
    w-full
    font-16-r text-black
    cursor-pointer
    border-none
    bg-transparent
`;

const ModalConfirmButton = tw.button`
    w-full
    font-16-r text-orange
    cursor-pointer
    border-none
    bg-transparent
`;

const LoadingWrapper = tw.div`
    flex items-center justify-center
    w-full h-full
    min-h-200
`;

const LoadingText = tw.div`
    font-16-m text-gray-400
`;

const MobileLoadingText = tw.div`
    font-16-m text-white
    text-center
    py-4
`;

const ErrorImagePlaceholder = tw.div`
    w-full h-full
    bg-gray-100
    rounded-8
    flex items-center justify-center
    font-12-r text-gray-400
    text-center
`;
