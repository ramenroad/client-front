export type ReviewFormMode = "create" | "edit";

export type ReviewFormImage = File | string;

export interface ReviewFormValues {
  ramenyaId: string;
  rating: number;
  review: string;
  menus: string;
  reviewImages: ReviewFormImage[];
}

export interface ReviewFormPageCopy {
  title: string;
  submit: string;
  submitting: string;
  successToast: string;
  errorToast: string;
  backConfirmText: string;
}
