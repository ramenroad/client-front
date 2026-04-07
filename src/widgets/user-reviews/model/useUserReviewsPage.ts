import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RefObject } from "react";
import { useMyReviewQuery, useUserReviewQuery, type UserReview, ReviewType } from "@/entities/review/model";
import { useUserInformationQuery, useUserMyPageQuery } from "@/entities/viewer/model";
import { useUserMyPageMutation } from "@/features/profile/model";
import { useIntersectionObserver } from "@/shared/lib/use-intersection-observer";
import { useToast } from "@/shared/ui/toast";
import { queryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/model/query-keys";

interface KakaoShareApi {
  isInitialized: () => boolean;
  init: (appKey: string) => void;
  Share: {
    sendDefault: (payload: {
      objectType: string;
      content: {
        title: string;
        description: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      };
    }) => void;
  };
}

type ReviewItem = UserReview<ReviewType.MYPAGE> | UserReview<ReviewType.USER>;

const getKakaoApi = () => (window as unknown as Window & { Kakao?: KakaoShareApi }).Kakao;

export const useUserReviewsPage = (userId?: string) => {
  const navigate = useNavigate();
  const { openToast } = useToast();
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  const { userInformationQuery } = useUserInformationQuery();
  const { userReviewQuery } = useUserReviewQuery(userId);
  const { userMyPageQuery } = useUserMyPageQuery(userId);
  const { update } = useUserMyPageMutation();

  const isMine = userInformationQuery.data?._id === userId;
  const { myReviewQuery } = useMyReviewQuery(isMine);

  const reviews = useMemo<ReviewItem[]>(() => {
    const queryData = isMine ? myReviewQuery.data : userReviewQuery.data;
    return queryData?.pages.flatMap((page) => page.reviews) ?? [];
  }, [isMine, myReviewQuery.data, userReviewQuery.data]);

  const observerRef = useIntersectionObserver({
    onIntersect: () => {
      if (isMine) {
        if (myReviewQuery.hasNextPage && !myReviewQuery.isFetchingNextPage) {
          myReviewQuery.fetchNextPage();
        }
        return;
      }

      if (!userReviewQuery.isError && userReviewQuery.hasNextPage && !userReviewQuery.isFetchingNextPage) {
        userReviewQuery.fetchNextPage();
      }
    },
  }) as RefObject<HTMLDivElement>;

  useEffect(() => {
    const kakao = getKakaoApi();

    if (kakao && !kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
    }
  }, []);

  const handleReviewVisibilityChange = (isPublic: boolean) => {
    if (!userId) {
      return;
    }

    update.mutate(isPublic, {
      onSuccess: () => {
        queryClient.invalidateQueries({ ...queryKeys.userMyPage.user(userId) });
      },
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      openToast("주소가 복사되었습니다");
    } catch {
      openToast("주소 복사에 실패했습니다.");
    }
  };

  const handleShareMore = async () => {
    if (!navigator.share) {
      openToast("공유 기능을 지원하지 않는 브라우저입니다");
      return;
    }

    await navigator.share({
      title: "라이징",
      text: `${userMyPageQuery.data?.nickname}님의 페이지를 확인해보세요!`,
      url: window.location.href,
    });
  };

  const handleShareKakao = () => {
    const kakao = getKakaoApi();

    if (!kakao?.isInitialized()) {
      openToast("카카오 공유를 사용할 수 없습니다.");
      return;
    }

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "라이징",
        description: `${userMyPageQuery.data?.nickname ?? ""}`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  };

  const handleShare = async (type: "kakao" | "url" | "more") => {
    if (type === "kakao") {
      handleShareKakao();
      return;
    }

    if (type === "url") {
      await handleCopyLink();
      return;
    }

    try {
      await handleShareMore();
    } catch {
      openToast("공유를 완료하지 못했습니다.");
    }
  };

  return {
    userMyPage: userMyPageQuery.data,
    reviews,
    isMine,
    isPrivate: !isMine && userReviewQuery.isError,
    isSharePopupOpen,
    observerRef,
    openSharePopup: () => setIsSharePopupOpen(true),
    closeSharePopup: () => setIsSharePopupOpen(false),
    handleReviewVisibilityChange,
    handleShare,
    navigateHome: () => navigate("/"),
  };
};
