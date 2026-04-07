import type { ReviewFormMode, ReviewFormPageCopy } from "./types";

export const MAX_REVIEW_IMAGES = 10;
export const MIN_REVIEW_LENGTH = 20;
export const MAX_REVIEW_LENGTH = 1000;

export const REVIEW_FORM_COPY: Record<ReviewFormMode, ReviewFormPageCopy> = {
  create: {
    title: "리뷰 작성하기",
    submit: "등록하기",
    submitting: "등록중...",
    successToast: "리뷰가 등록되었습니다.",
    errorToast: "리뷰 등록에 실패했습니다.",
    backConfirmText: "리뷰 작성을 멈추고 뒤로 갈까요?",
  },
  edit: {
    title: "리뷰 수정하기",
    submit: "수정하기",
    submitting: "수정중...",
    successToast: "리뷰가 수정되었습니다.",
    errorToast: "리뷰 수정에 실패했습니다.",
    backConfirmText: "리뷰 수정을 멈추고 뒤로 갈까요?",
  },
};
