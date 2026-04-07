import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRamenyaDetailQuery } from "@/entities/ramenya/model";
import { useRamenyaReviewDetailQuery } from "@/entities/review/model";
import { useSignInStore } from "@/entities/viewer/model";
import { useImageUpload } from "@/shared/lib/use-image-upload";
import { useModal } from "@/shared/lib/use-modal";
import { useToast } from "@/shared/ui/toast";
import { MAX_REVIEW_IMAGES, REVIEW_FORM_COPY } from "./constants";
import { useReviewFormMutation } from "./mutations";
import type { ReviewFormMode, ReviewFormValues } from "./types";
import {
  EMPTY_REVIEW_FORM,
  areReviewImagesEqual,
  getCreateDirtyBaseline,
  getCreateReviewFormValues,
  getEditReviewFormValues,
  getMenuList,
  getSelectedMenus,
  isReviewFormValid,
} from "./utils";

interface UseReviewFormOptions {
  mode: ReviewFormMode;
}

export const useReviewForm = ({ mode }: UseReviewFormOptions) => {
  const isEditMode = mode === "edit";
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSignIn } = useSignInStore();
  const { openToast } = useToast();
  const backModal = useModal();
  const loginModal = useModal();

  const initialRatingValue = Number.parseFloat(searchParams.get("rating") ?? "0");
  const initialRating = Number.isNaN(initialRatingValue) ? 0 : initialRatingValue;
  const pageCopy = REVIEW_FORM_COPY[mode];

  const { ramenyaDetailQuery } = useRamenyaDetailQuery(isEditMode ? undefined : routeId);
  const { reviewDetailQuery } = useRamenyaReviewDetailQuery(isEditMode ? (routeId ?? "") : "");
  const reviewDetail = reviewDetailQuery.data;

  const createDefaultValues = useMemo(
    () => getCreateReviewFormValues(routeId ?? "", initialRating),
    [initialRating, routeId],
  );
  const editDefaultValues = useMemo(() => getEditReviewFormValues(reviewDetail), [reviewDetail]);
  const dirtyBaseline = useMemo(
    () => (isEditMode ? editDefaultValues : getCreateDirtyBaseline(routeId ?? "")),
    [editDefaultValues, isEditMode, routeId],
  );

  const submitMutation = useReviewFormMutation({ mode, reviewId: routeId });

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm<ReviewFormValues>({
    defaultValues: isEditMode ? EMPTY_REVIEW_FORM : createDefaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    register("rating", {
      validate: (value) => value > 0 || "별점을 선택해주세요",
    });
    register("menus", {
      validate: (value) => getSelectedMenus(value).length > 0 || "메뉴를 선택해주세요",
    });
  }, [register]);

  const [watchedRamenyaId, watchedRating, watchedReview, watchedReviewImages, watchedMenus] = useWatch({
    control,
    name: ["ramenyaId", "rating", "review", "reviewImages", "menus"],
  });
  const currentReviewImages = useMemo(() => watchedReviewImages ?? [], [watchedReviewImages]);
  const [customMenuInput, setCustomMenuInput] = useState("");

  const sourceMenus = isEditMode ? reviewDetail?.menus : ramenyaDetailQuery.data?.menus;
  const selectedMenus = useMemo(() => getSelectedMenus(watchedMenus), [watchedMenus]);
  const menuList = useMemo(() => getMenuList(sourceMenus, selectedMenus), [selectedMenus, sourceMenus]);

  const handleReviewImagesChange = useCallback(
    (images: (File | string)[]) => {
      setValue("reviewImages", images, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const { fileInputRef, isUploading: isImageUploading, handleImageClick, handleImageUpload, handleRemoveImage } =
    useImageUpload({
      images: currentReviewImages,
      maxImages: MAX_REVIEW_IMAGES,
      onImagesChange: handleReviewImagesChange,
      onLimitExceeded: (maxImages) => openToast(`이미지는 최대 ${maxImages}개까지 업로드 가능합니다.`),
      onUploadError: () => openToast("이미지 변환에 실패했습니다. 다른 이미지를 선택해주세요."),
    });

  const handleStarClick = useCallback(
    (starIndex: number, isHalf = false) => {
      const rating = isHalf ? starIndex - 0.5 : starIndex;

      setValue("rating", rating, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const handleMenuClick = useCallback(
    (menu: string) => {
      const nextSelectedMenus = selectedMenus.includes(menu)
        ? selectedMenus.filter((item) => item !== menu)
        : selectedMenus.length >= 2
          ? selectedMenus
          : [...selectedMenus, menu];

      setValue("menus", nextSelectedMenus.join(","), {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [selectedMenus, setValue],
  );

  const handleAddCustomMenu = useCallback(() => {
    const trimmedMenu = customMenuInput.trim();

    if (!trimmedMenu) {
      return;
    }

    const nextSelectedMenus =
      selectedMenus.includes(trimmedMenu) || selectedMenus.length >= 2 ? selectedMenus : [...selectedMenus, trimmedMenu];

    setValue("menus", nextSelectedMenus.join(","), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setCustomMenuInput("");
  }, [customMenuInput, selectedMenus, setValue]);

  const handleCustomMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.nativeEvent.isComposing) {
        event.preventDefault();
        handleAddCustomMenu();
      }
    },
    [handleAddCustomMenu],
  );

  const isLoading = isEditMode ? reviewDetailQuery.isLoading : ramenyaDetailQuery.isLoading;
  const isSubmitting = submitMutation.isPending;
  const isFormValid = useMemo(
    () =>
      isReviewFormValid({
        rating: watchedRating ?? 0,
        menus: watchedMenus ?? "",
        review: watchedReview ?? "",
      }),
    [watchedMenus, watchedRating, watchedReview],
  );
  const isFormDirty = useMemo(() => {
    if (!dirtyBaseline) {
      return false;
    }

    return (
      dirtyBaseline.ramenyaId !== watchedRamenyaId ||
      dirtyBaseline.rating !== watchedRating ||
      dirtyBaseline.review !== watchedReview ||
      dirtyBaseline.menus !== watchedMenus ||
      !areReviewImagesEqual(dirtyBaseline.reviewImages, currentReviewImages)
    );
  }, [currentReviewImages, dirtyBaseline, watchedMenus, watchedRamenyaId, watchedRating, watchedReview]);

  const handleBackClick = useCallback(() => {
    if (isFormDirty) {
      backModal.open();
      return;
    }

    navigate(-1);
  }, [backModal, isFormDirty, navigate]);

  const handleConfirmBack = useCallback(() => {
    backModal.close();
    navigate(-1);
  }, [backModal, navigate]);

  const handleCancelBack = useCallback(() => {
    backModal.close();
  }, [backModal]);

  const handleLoginConfirm = useCallback(() => {
    loginModal.close();
    navigate("/login");
  }, [loginModal, navigate]);

  const handleSubmitReview = handleSubmit(async (values) => {
    if (!isSignIn) {
      loginModal.open();
      return;
    }

    try {
      await submitMutation.mutateAsync(values);
      openToast(pageCopy.successToast);
      navigate(-1);
    } catch (error) {
      console.error(isEditMode ? "리뷰 수정 중 에러 발생:" : "리뷰 등록 중 에러 발생:", error);
      openToast(pageCopy.errorToast);
    }
  });

  useEffect(() => {
    if (!routeId) {
      navigate(-1);
    }
  }, [navigate, routeId]);

  useEffect(() => {
    if (!isEditMode) {
      reset(createDefaultValues);
    }
  }, [createDefaultValues, isEditMode, reset]);

  useEffect(() => {
    if (!isEditMode || !editDefaultValues) {
      return;
    }

    reset(editDefaultValues);
  }, [editDefaultValues, isEditMode, reset]);

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
    window.scrollTo(0, 0);
  }, []);

  return {
    backModal,
    control,
    currentReviewImages,
    customMenuInput,
    errors,
    fileInputRef,
    handleBackClick,
    handleCancelBack,
    handleConfirmBack,
    handleAddCustomMenu,
    handleCustomMenuKeyDown,
    handleImageClick,
    handleImageUpload,
    handleLoginConfirm,
    handleMenuClick,
    handleRemoveImage,
    handleStarClick,
    handleSubmitReview,
    isFormValid,
    isImageUploading,
    isLoading,
    isSubmitting,
    loginModal,
    menuList,
    pageCopy,
    selectedMenus,
    setCustomMenuInput,
    watchedRating: watchedRating ?? 0,
  };
};
