import { ReviewType, type UserReview } from "@/entities/review/model";
import { MIN_REVIEW_LENGTH } from "./constants";
import type { ReviewFormImage, ReviewFormMode, ReviewFormValues } from "./types";

export const EMPTY_REVIEW_FORM: ReviewFormValues = {
  ramenyaId: "",
  rating: 0,
  review: "",
  reviewImages: [],
  menus: "",
};

export const getCreateReviewFormValues = (ramenyaId: string, initialRating: number): ReviewFormValues => ({
  ...EMPTY_REVIEW_FORM,
  ramenyaId,
  rating: initialRating,
});

export const getCreateDirtyBaseline = (ramenyaId: string): ReviewFormValues => ({
  ...EMPTY_REVIEW_FORM,
  ramenyaId,
});

export const getEditReviewFormValues = (
  reviewDetail?: UserReview<ReviewType.MYPAGE> | null,
): ReviewFormValues | null => {
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
};

export const areReviewImagesEqual = (initialImages: ReviewFormImage[] = [], currentImages: ReviewFormImage[] = []) => {
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

export const getSelectedMenus = (menus?: string) =>
  menus
    ? menus
        .split(",")
        .map((menu) => menu.trim())
        .filter(Boolean)
    : [];

export const getMenuList = (sourceMenus: string[] = [], selectedMenus: string[] = []) => {
  return [...new Set([...sourceMenus, ...selectedMenus])];
};

export const isReviewFormValid = ({
  rating,
  menus,
  review,
}: Pick<ReviewFormValues, "rating" | "menus" | "review">) => {
  return rating > 0 && getSelectedMenus(menus).length > 0 && review.trim().length >= MIN_REVIEW_LENGTH;
};

const appendReviewImages = (formData: FormData, reviewImages: ReviewFormImage[], mode: ReviewFormMode) => {
  if (mode === "edit") {
    const existingImages: string[] = [];
    const newImages: File[] = [];

    reviewImages.forEach((image) => {
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
    return;
  }

  reviewImages.forEach((image) => {
    if (image instanceof File) {
      formData.append("reviewImages", image);
    }
  });
};

export const createReviewFormData = (values: ReviewFormValues, mode: ReviewFormMode) => {
  const formData = new FormData();

  formData.append("ramenyaId", values.ramenyaId);
  formData.append("rating", values.rating.toString());
  formData.append("review", values.review);
  formData.append("menus", values.menus);

  appendReviewImages(formData, values.reviewImages, mode);

  return formData;
};
