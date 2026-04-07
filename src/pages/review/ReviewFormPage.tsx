import styled from "@emotion/styled";
import { Controller, useForm } from "react-hook-form";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import heic2any from "heic2any";
import { useRamenyaDetailQuery } from "@/entities/ramenya/model";
import {
  type Review,
  useRamenyaReviewDetailQuery,
  useRamenyaReviewEditMutation,
  useRamenyaReviewMutation,
} from "@/entities/review/model";
import { useSignInStore } from "@/entities/viewer/model";
import { useModal } from "@/shared/lib/use-modal";
import { IconAdd, IconImageDelete, IconStar } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import TopBar from "@/shared/ui/top-bar";
import { useToast } from "@/shared/ui/toast";
import loadingAnimation from "../../assets/lotties/loading.json";
import ReviewGuide from "./ReviewGuide.tsx";
import render from "@/shared/ui/render";

export type ReviewFormMode = "create" | "edit";

interface ReviewFormPageProps {
  mode: ReviewFormMode;
}

const MAX_REVIEW_IMAGES = 10;
const MIN_REVIEW_LENGTH = 20;

const EMPTY_REVIEW_FORM: Review = {
  ramenyaId: "",
  rating: 0,
  review: "",
  reviewImages: [],
  menus: "",
};

const getCreateDirtyBaseline = (ramenyaId: string): Review => ({
  ...EMPTY_REVIEW_FORM,
  ramenyaId,
});

const areReviewImagesEqual = (initialImages: (File | string)[] = [], currentImages: (File | string)[] = []) => {
  if (initialImages.length !== currentImages.length) {
    return false;
  }

  return initialImages.every((image, index) => {
    const currentImage = currentImages[index];

    if (typeof image === "string" && typeof currentImage === "string") {
      return image === currentImage;
    }

    if (image instanceof File && currentImage instanceof File) {
      return image === currentImage;
    }

    return false;
  });
};

const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

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
            return;
          }

          resolve(file);
        },
        "image/jpeg",
        quality,
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

const convertHeicToJpeg = async (file: File): Promise<File> => {
  if (!file.type.includes("heic") && !file.name.toLowerCase().endsWith(".heic")) {
    return file;
  }

  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const fileName = file.name.replace(/\.heic$/i, ".jpg");
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

    return new File([blob], fileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("HEIC 변환 실패:", error);
    throw new Error("HEIC 파일 변환에 실패했습니다.");
  }
};

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const OptimizedLottie = memo(() => {
  const [shouldRender, setShouldRender] = useState(true);
  const isMobile = useMemo(() => isMobileDevice(), []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 3000);

    return () => clearTimeout(timer);
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

const ImagePreviewItem = memo(
  ({ file, index, onRemove }: { file: File | string; index: number; onRemove: (index: number) => void }) => {
    const [imageUrl, setImageUrl] = useState("");
    const [hasError, setHasError] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
      if (file instanceof File) {
        try {
          const url = URL.createObjectURL(file);
          setImageUrl(url);

          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (error) {
          console.error("URL 생성 실패:", error);
          setHasError(true);
          return;
        }
      }

      setImageUrl(file);
    }, [file]);

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

export const ReviewFormPage = ({ mode }: ReviewFormPageProps) => {
  const isEditMode = mode === "edit";
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSignIn } = useSignInStore();
  const { openToast } = useToast();
  const { isOpen: isBackModalOpen, open: openBackModal, close: closeBackModal } = useModal();
  const { isOpen: isLoginModalOpen, open: openLoginModal, close: closeLoginModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialRatingValue = Number.parseFloat(searchParams.get("rating") ?? "0");
  const initialRating = Number.isNaN(initialRatingValue) ? 0 : initialRatingValue;

  const { add } = useRamenyaReviewMutation();
  const { update } = useRamenyaReviewEditMutation(routeId ?? "");
  const { mutateAsync: createReview, isPending: isCreating } = add;
  const { mutateAsync: editReview, isPending: isEditing } = update;

  const { ramenyaDetailQuery } = useRamenyaDetailQuery(isEditMode ? undefined : routeId);
  const { reviewDetailQuery } = useRamenyaReviewDetailQuery(isEditMode ? (routeId ?? "") : "");
  const reviewDetail = reviewDetailQuery.data;

  const createDefaultValues = useMemo<Review>(
    () => ({
      ramenyaId: routeId ?? "",
      rating: initialRating,
      review: "",
      reviewImages: [],
      menus: "",
    }),
    [initialRating, routeId],
  );

  const editDefaultValues = useMemo<Review | null>(() => {
    if (!reviewDetail) {
      return null;
    }

    return {
      ramenyaId: reviewDetail.ramenyaId._id,
      rating: reviewDetail.rating,
      review: reviewDetail.review,
      reviewImages: reviewDetail.reviewImageUrls ?? [],
      menus: reviewDetail.menus?.join(",") ?? "",
    };
  }, [reviewDetail]);

  const dirtyBaseline = useMemo<Review | null>(() => {
    if (isEditMode) {
      return editDefaultValues;
    }

    return getCreateDirtyBaseline(routeId ?? "");
  }, [editDefaultValues, isEditMode, routeId]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<Review>({
    defaultValues: isEditMode ? EMPTY_REVIEW_FORM : createDefaultValues,
    mode: "onChange",
  });

  const formValues = watch();
  const currentReviewImages = formValues.reviewImages ?? [];

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [customMenuInput, setCustomMenuInput] = useState("");
  const [menuList, setMenuList] = useState<string[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const pageCopy = isEditMode
    ? {
        title: "리뷰 수정하기",
        submit: "수정하기",
        submitting: "수정중...",
        successToast: "리뷰가 수정되었습니다.",
        errorToast: "리뷰 수정에 실패했습니다.",
        backConfirmText: "리뷰 수정을 멈추고 뒤로 갈까요?",
      }
    : {
        title: "리뷰 작성하기",
        submit: "등록하기",
        submitting: "등록중...",
        successToast: "리뷰가 등록되었습니다.",
        errorToast: "리뷰 등록에 실패했습니다.",
        backConfirmText: "리뷰 작성을 멈추고 뒤로 갈까요?",
      };

  const isLoading = isEditMode ? reviewDetailQuery.isLoading : ramenyaDetailQuery.isLoading;
  const isSubmitting = isEditMode ? isEditing : isCreating;
  const sourceMenus = isEditMode ? reviewDetail?.menus : ramenyaDetailQuery.data?.menus;

  const handleStarClick = (starIndex: number, isHalf: boolean = false) => {
    const rating = isHalf ? starIndex - 0.5 : starIndex;
    setValue("rating", rating, { shouldValidate: true, shouldDirty: true });
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenus((prev) => {
      if (prev.includes(menu)) {
        return prev.filter((item) => item !== menu);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, menu];
    });
  };

  const handleAddCustomMenu = () => {
    const trimmedMenu = customMenuInput.trim();

    if (!trimmedMenu) {
      return;
    }

    setMenuList((prev) => (prev.includes(trimmedMenu) ? prev : [...prev, trimmedMenu]));
    setSelectedMenus((prev) => {
      if (prev.includes(trimmedMenu) || prev.length >= 2) {
        return prev;
      }

      return [...prev, trimmedMenu];
    });
    setCustomMenuInput("");
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleAddCustomMenu();
    }
  };

  const handleImageUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files) {
        return;
      }

      if (currentReviewImages.length + files.length > MAX_REVIEW_IMAGES) {
        openToast(`이미지는 최대 ${MAX_REVIEW_IMAGES}개까지 업로드 가능합니다.`);
        return;
      }

      const fileArray = Array.from(files);
      const newImages: File[] = [];

      try {
        setIsImageUploading(true);

        for (const file of fileArray) {
          if (currentReviewImages.length + newImages.length >= MAX_REVIEW_IMAGES) {
            break;
          }

          let convertedFile = await convertHeicToJpeg(file);

          if (convertedFile.size > 1024 * 1024) {
            convertedFile = await compressImage(convertedFile, 800, 0.8);
          }

          newImages.push(convertedFile);
        }

        setValue("reviewImages", [...currentReviewImages, ...newImages], {
          shouldValidate: true,
          shouldDirty: true,
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
    [currentReviewImages, openToast, setValue],
  );

  const handleImageClick = () => {
    if (currentReviewImages.length < MAX_REVIEW_IMAGES) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = useCallback(
    (index: number) => {
      if (index < 0 || index >= currentReviewImages.length) {
        console.warn("잘못된 이미지 인덱스:", index);
        return;
      }

      const nextImages = [...currentReviewImages];
      nextImages.splice(index, 1);

      setValue("reviewImages", nextImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [currentReviewImages, setValue],
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

      if (isEditMode) {
        const existingImages: string[] = [];
        const newImages: File[] = [];

        values.reviewImages?.forEach((image) => {
          if (image instanceof File) {
            newImages.push(image);
            return;
          }

          existingImages.push(image);
        });

        formData.append("reviewImageUrls", existingImages.join(","));
        newImages.forEach((image) => {
          formData.append("reviewImages", image);
        });

        await editReview(formData);
      } else {
        values.reviewImages?.forEach((image) => {
          if (image instanceof File) {
            formData.append("reviewImages", image);
          }
        });

        await createReview(formData);
      }

      openToast(pageCopy.successToast);
      navigate(-1);
    } catch (error) {
      console.error(isEditMode ? "리뷰 수정 중 에러 발생:" : "리뷰 등록 중 에러 발생:", error);
      openToast(pageCopy.errorToast);
    }
  };

  const handleBackClick = () => {
    if (isFormDirty) {
      openBackModal();
      return;
    }

    navigate(-1);
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
    formValues.review.trim().length >= MIN_REVIEW_LENGTH;

  useEffect(() => {
    if (!routeId) {
      navigate(-1);
    }
  }, [navigate, routeId]);

  useEffect(() => {
    if (!isEditMode) {
      reset(createDefaultValues);
      setSelectedMenus([]);
    }
  }, [createDefaultValues, isEditMode, reset]);

  useEffect(() => {
    if (!isEditMode || !editDefaultValues) {
      return;
    }

    reset(editDefaultValues);
    setSelectedMenus(reviewDetail?.menus ?? []);
  }, [editDefaultValues, isEditMode, reset, reviewDetail?.menus]);

  useEffect(() => {
    if (sourceMenus) {
      setMenuList([...new Set(sourceMenus)]);
      return;
    }

    setMenuList([]);
  }, [sourceMenus]);

  useEffect(() => {
    if (isEditMode) {
      if (reviewDetailQuery.isError) {
        openToast("리뷰 정보를 불러오는데 실패했습니다.");
        navigate(-1);
      }

      return;
    }

    if (ramenyaDetailQuery.isError) {
      openToast("라멘집 정보를 불러오는데 실패했습니다.");
    }
  }, [isEditMode, navigate, openToast, ramenyaDetailQuery.isError, reviewDetailQuery.isError]);

  useEffect(() => {
    if (!dirtyBaseline) {
      setIsFormDirty(false);
      return;
    }

    const hasChanges =
      dirtyBaseline.ramenyaId !== formValues.ramenyaId ||
      dirtyBaseline.rating !== formValues.rating ||
      dirtyBaseline.review !== formValues.review ||
      dirtyBaseline.menus !== formValues.menus ||
      !areReviewImagesEqual(dirtyBaseline.reviewImages, currentReviewImages);

    setIsFormDirty(hasChanges);
  }, [
    currentReviewImages,
    dirtyBaseline,
    formValues.menus,
    formValues.ramenyaId,
    formValues.rating,
    formValues.review,
  ]);

  useEffect(() => {
    setValue("menus", selectedMenus.join(","), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [selectedMenus, setValue]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Wrapper>
      {(isSubmitting || isImageUploading) && (
        <LoadingOverlay>
          <OptimizedLottie />
        </LoadingOverlay>
      )}
      <Header>
        <TopBar title={pageCopy.title} onBackClick={handleBackClick} />
      </Header>
      <ReviewGuide />
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
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const currentRating = formValues.rating || 0;
                  const isFullStar = starIndex <= currentRating;
                  const isHalfStar = starIndex - 0.5 <= currentRating && currentRating < starIndex;

                  return (
                    <StarButtonContainer key={starIndex}>
                      {isHalfStar ? (
                        <IconStar isHalf={true} inactive={!isFullStar} size={36} />
                      ) : (
                        <IconStar inactive={!isFullStar} size={36} />
                      )}

                      <StarButtonLeft
                        onClick={() => handleStarClick(starIndex, true)}
                        type="button"
                        aria-label={`${starIndex - 0.5}점`}
                      />
                      <StarButtonRight
                        onClick={() => handleStarClick(starIndex, false)}
                        type="button"
                        aria-label={`${starIndex}점`}
                      />
                    </StarButtonContainer>
                  );
                })}
              </StarContainer>
              {errors.rating && <ErrorMessage>별점을 선택해주세요</ErrorMessage>}
            </StarWrapper>

            <Divider />

            <MenuWrapper>
              <MenuTitleBox>
                <MenuTitle>어떤 메뉴를 드셨나요?</MenuTitle>
                <MenuSubTitle>최대 2개 선택 가능</MenuSubTitle>
              </MenuTitleBox>
              {menuList.length > 0 && (
                <MenuTabContainer>
                  {menuList.map((menu, index) => (
                    <MenuTab
                      key={`${menu}-${index}`}
                      selected={selectedMenus.includes(menu)}
                      onClick={() => handleMenuClick(menu)}
                    >
                      {menu}
                    </MenuTab>
                  ))}
                </MenuTabContainer>
              )}
              {errors.menus && <ErrorMessage>메뉴를 선택해주세요</ErrorMessage>}
            </MenuWrapper>

            <MenuAddWrapper>
              <MenuInputContainer>
                <MenuInput
                  value={customMenuInput}
                  onChange={(event) => setCustomMenuInput(event.target.value)}
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
                rules={{ required: true, minLength: MIN_REVIEW_LENGTH }}
                render={({ field }) => (
                  <ReviewTextAreaContainer>
                    <ReviewDescriptionTextarea {...field} placeholder="최소 20자 이상 입력해주세요" maxLength={1000} />
                    <CharacterCount>
                      <TypedCount>{field.value?.length ?? 0}</TypedCount>/1000
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
                    <ImageAdded>{currentReviewImages.length}</ImageAdded>
                    <ImageAddedText>/</ImageAddedText>
                    <ImageMax>{MAX_REVIEW_IMAGES}</ImageMax>
                  </ImageCountBox>
                </ImageUploadTitleBox>
                <ImageUploadSubTitle>라멘과 무관한 사진을 첨부한 리뷰는 무통보 삭제됩니다</ImageUploadSubTitle>
              </ImageUploadHeader>

              <ImageUploadContent>
                <ImageUploadContentImage>
                  {currentReviewImages.map((image, index) => (
                    <ImagePreviewItem
                      key={`${index}-${image instanceof File ? image.name : image}`}
                      file={image}
                      index={index}
                      onRemove={handleRemoveImage}
                    />
                  ))}
                  {currentReviewImages.length < MAX_REVIEW_IMAGES && (
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
              {isSubmitting ? pageCopy.submitting : pageCopy.submit}
            </AddReviewButton>
          </ContentsWrapper>
        </form>
      )}

      <Modal isOpen={isBackModalOpen} onClose={handleCancelBack}>
        <ModalContent>
          <ModalText>{pageCopy.backConfirmText}</ModalText>
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

const LoadingOverlay = render.div(
  "fixed top-0 left-0 right-0 bottom-0 bg-[#000000]/20 flex flex-col justify-start items-center pt-[40vh] z-10",
);

const LottieWrapper = render.div("");

const Wrapper = render.div("flex flex-col w-full pb-40");

const Header = render.div("");

const ContentsWrapper = render.div("flex flex-col px-20");

const StarWrapper = render.div("flex flex-col items-center pt-20 pb-32 gap-12");

const StarTitle = render.div("font-16-m text-black");

const StarContainer = render.div("flex gap-8 items-center");

const StarButtonContainer = render.div("relative flex items-center justify-center");

const StarButtonLeft = render.button(
  "bg-transparent border-none cursor-pointer p-0 m-0 absolute left-0 w-1/2 h-full flex items-center justify-center",
);

const StarButtonRight = render.button(
  "bg-transparent border-none cursor-pointer p-0 m-0 absolute right-0 w-1/2 h-full flex items-center justify-center",
);

const Divider = render.div("w-full h-1 bg-divider");

const MenuWrapper = render.div("flex flex-col mt-32 gap-16");

const MenuTitleBox = render.div("flex items-center gap-4");

const MenuTitle = render.div("font-16-m text-black");

const MenuSubTitle = render.div("font-12-r text-gray-400");

const MenuTabContainer = render.div("flex flex-wrap gap-8");

interface MenuTabProps {
  selected: boolean;
}

const MenuTab = styled.div<MenuTabProps>(({ selected }) => [
  {
    display: "flex",
    width: "fit-content",
    height: "29px",
    boxSizing: "border-box",
    alignItems: "center",
    fontSize: "14px",
    lineHeight: "21px",
    fontWeight: 400,
    padding: "6px 12px",
    borderRadius: "50px",
    cursor: "pointer",
  },
  selected
    ? {
        backgroundColor: "#fff4eb",
        color: "#ff5e00",
      }
    : {
        backgroundColor: "#f6f6f6",
        color: "#a0a0a0",
      },
]);

const MenuAddWrapper = render.div("flex flex-col mt-16 gap-12");

const MenuInputContainer = render.div("flex items-center gap-4");

const MenuInput = render.input(
  "flex-1 h-44 rounded-[8px] bg-border box-border px-12 py-10 font-16-r border-solid border border-transparent outline-none text-black focus-within:(border-orange)",
);

const MenuAddButton = render.button(
  "w-67 h-43 rounded-[8px] text-black px-10 py-8 bg-white border-solid border border-gray-100",
);

const ReviewDescriptionWrapper = render.div("flex flex-col mt-36 gap-16 relative");

const ReviewDescriptionTitle = render.div("font-16-m text-black");

const ReviewTextAreaContainer = render.div(
  "flex flex-col gap-4 relative bg-border rounded-[8px] px-12 pt-10 pb-36 border-solid border border-transparent outline-none box-border focus-within:(border-orange)",
);

const ReviewDescriptionTextarea = styled.textarea({
  display: "flex",
  height: "214px",
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 400,
  fontFamily: '"Pretendard", sans-serif',
  resize: "none",
  outline: "none",
  color: "#111111",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#d9d9d9",
    borderRadius: "3px",
  },
});

const CharacterCount = render.div("absolute bottom-14 right-12 font-14-r text-gray-400");

const TypedCount = render.span("font-14-r text-black");

const ImageUploadWrapper = render.div("flex flex-col mt-36 gap-12");

const ImageUploadHeader = render.div("flex flex-col gap-2");

const ImageUploadTitleBox = render.div("flex items-center gap-8");

const ImageUploadTitle = render.div("font-16-m text-black");

const ImageCountBox = render.div("flex items-center");

const ImageAdded = render.div("font-16-m text-black");

const ImageAddedText = render.div("font-16-m text-black");

const ImageMax = render.div("font-16-m text-black");

const ImageUploadSubTitle = render.div("font-12-r text-gray-400");

const ImageUploadContent = render.div("flex flex-col gap-12");

const ImageUploadContentImage = render.div("flex flex-row flex-wrap gap-12");

const ImagePreviewContainer = render.div(
  "relative w-96 h-96 rounded-[7px] flex items-center justify-center border-solid border border-border",
);

const ImagePreview = render.img("w-full h-full object-cover rounded-[7px]");

const StyledIconImageDelete = render.extend(IconImageDelete, "absolute top-[-8px] right-[-8px] cursor-pointer");

const ImageAddButton = render.button(
  "flex items-center justify-center w-96 h-96 rounded-[8px] bg-border border-solid border border-gray-200 border-dashed cursor-pointer",
);

interface AddReviewButtonProps {
  active: boolean;
  disabled?: boolean;
}

const AddReviewButton = styled.button<AddReviewButtonProps>(({ active, disabled }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "32px",
  width: "100%",
  height: "48px",
  borderRadius: "8px",
  padding: "10px",
  backgroundColor: active && !disabled ? "#ff5e00" : "#cfcfcf",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: 500,
  color: "#ffffff",
  border: "none",
  boxSizing: "border-box",
  cursor: active && !disabled ? "pointer" : "not-allowed",
}));

const ErrorMessage = render.div("font-12-r text-red mt-4");

const ModalContent = render.div("flex flex-col gap-16 w-290 pt-32 items-center justify-center bg-white rounded-[12px]");

const ModalTextBox = render.div("flex flex-col");

const ModalTitle = render.div("font-16-sb text-gray-900 text-center");

const ModalText = render.div("font-16-r text-gray-900 text-center");

const ModalButtonBox = render.div("flex h-60 w-full");

const ModalCancelButton = render.button("w-full font-16-r text-black cursor-pointer border-none bg-transparent");

const ModalConfirmButton = render.button("w-full font-16-r text-orange cursor-pointer border-none bg-transparent");

const LoadingWrapper = render.div("flex items-center justify-center w-full h-full min-h-200");

const LoadingText = render.div("font-16-m text-gray-400");

const MobileLoadingText = render.div("font-16-m text-white text-center py-4");

const ErrorImagePlaceholder = render.div(
  "w-full h-full bg-gray-100 rounded-[8px] flex items-center justify-center font-12-r text-gray-400 text-center",
);
