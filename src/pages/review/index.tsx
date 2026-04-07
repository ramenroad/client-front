import { Navigate, useParams } from "react-router-dom";
import { ReviewFormPage, type ReviewFormMode } from "./ReviewFormPage";

const REVIEW_FORM_MODES: ReviewFormMode[] = ["create", "edit"];

const isReviewFormMode = (mode: string | undefined): mode is ReviewFormMode => {
  return !!mode && REVIEW_FORM_MODES.includes(mode as ReviewFormMode);
};

const ReviewPage = () => {
  const { mode } = useParams();

  if (!isReviewFormMode(mode)) {
    return <Navigate to="/" replace />;
  }

  return <ReviewFormPage mode={mode} />;
};

export default ReviewPage;
