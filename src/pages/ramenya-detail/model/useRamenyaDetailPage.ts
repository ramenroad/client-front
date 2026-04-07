import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRamenyaDetailQuery, WEEKDAYS_ORDER, type WeekdaysOrderType } from "@/entities/ramenya/model";
import { useRamenyaReviewImagesQuery, useRamenyaReviewQuery } from "@/entities/review/model";
import { useSignInStore, useUserInformationQuery } from "@/entities/viewer/model";
import { openUrl } from "@/shared/lib/browser";
import { useMobileState } from "@/shared/lib/use-mobile-state";
import { useModal } from "@/shared/lib/use-modal";

type BusinessHour = {
  day: string;
  isOpen: boolean;
  operatingTime: string;
  breakTime?: string;
};

const getCurrentDayIndex = () => {
  const dayIndex = new Date().getDay();
  const dayMapping = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return dayMapping[dayIndex];
};

export const useRamenyaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useMobileState();
  const { ramenyaDetailQuery } = useRamenyaDetailQuery(id!);
  const { ramenyaReviewQuery } = useRamenyaReviewQuery(id!);
  const { ramenyaReviewImagesQuery } = useRamenyaReviewImagesQuery(id!);
  const { userInformationQuery } = useUserInformationQuery();
  const { isOpen: isLoginModalOpen, open: openLoginModal, close: closeLoginModal } = useModal();
  const { isOpen: isImagePopupOpen, open: openImagePopup, close: closeImagePopup } = useModal();
  const { isSignIn } = useSignInStore();
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const sortBusinessHoursByCurrentDay = (businessHours: BusinessHour[]) => {
    const today = getCurrentDayIndex();
    const todayIndex = WEEKDAYS_ORDER.indexOf(today as WeekdaysOrderType);
    const reorderedDays = [...WEEKDAYS_ORDER.slice(todayIndex), ...WEEKDAYS_ORDER.slice(0, todayIndex)];

    return [...businessHours].sort((a, b) => {
      const aIndex = reorderedDays.indexOf(a.day as WeekdaysOrderType);
      const bIndex = reorderedDays.indexOf(b.day as WeekdaysOrderType);
      return aIndex - bIndex;
    });
  };

  const todayBusinessHour = useMemo(() => {
    const today = getCurrentDayIndex();
    return ramenyaDetailQuery.data?.businessHours.find((hour) => hour.day.toLowerCase() === today);
  }, [ramenyaDetailQuery.data?.businessHours]);

  const mapButtons = useMemo(
    () => [
      {
        type: "naver" as const,
        url: ramenyaDetailQuery.data?.naverMapUrl,
        label: "네이버 지도 바로가기",
      },
      {
        type: "kakao" as const,
        url: ramenyaDetailQuery.data?.kakaoMapUrl,
        label: "카카오맵 바로가기",
      },
      {
        type: "google" as const,
        url: ramenyaDetailQuery.data?.googleMapUrl,
        label: "구글맵 바로가기",
      },
    ],
    [
      ramenyaDetailQuery.data?.googleMapUrl,
      ramenyaDetailQuery.data?.kakaoMapUrl,
      ramenyaDetailQuery.data?.naverMapUrl,
    ],
  );

  const handleNavigateReviewCreatePage = (rating = 0) => {
    if (!isSignIn) {
      openLoginModal();
      return;
    }

    navigate(`/review/create/${id}?rating=${rating}`);
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    handleNavigateReviewCreatePage(rating);
  };

  const handleLoginConfirm = () => {
    closeLoginModal();
    navigate("/login");
  };

  const handleOpenImagePopup = (index: number, images: string[]) => {
    setSelectedImageIndex(index);
    setSelectedImages(images);
    openImagePopup();
  };

  const handleNavigateImagesPage = () => {
    navigate(`/images/${id}`);
  };

  const handleOpenMapURL = (url: string) => {
    openUrl(url, { target: isMobile ? "_self" : "_blank" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return {
    id,
    isSignIn,
    isTimeExpanded,
    setIsTimeExpanded,
    selectedImageIndex,
    setSelectedImageIndex,
    selectedImages,
    selectedRating,
    isLoginModalOpen,
    closeLoginModal,
    isImagePopupOpen,
    closeImagePopup,
    ramenyaDetailQuery,
    ramenyaReviewQuery,
    ramenyaReviewImagesQuery,
    userInformationQuery,
    todayBusinessHour,
    mapButtons,
    sortBusinessHoursByCurrentDay,
    handleStarClick,
    handleLoginConfirm,
    handleOpenImagePopup,
    handleNavigateImagesPage,
    handleNavigateReviewCreatePage,
    handleOpenMapURL,
  };
};
