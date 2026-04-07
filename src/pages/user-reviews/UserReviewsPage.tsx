import { RaisingText } from "@/shared/ui/text";
import TopBar from "@/shared/ui/top-bar";
import { useMyReviewQuery, useUserReviewQuery } from "@/entities/review/model";
import { Line } from "@/shared/ui/line";
import ReviewCard from "@/entities/review/ui";
import { useNavigate, useParams } from "react-router-dom";
import { useIntersectionObserver } from "@/shared/lib/use-intersection-observer";
import { useUserInformationQuery } from "@/entities/viewer/model";
import { Toggle } from "@/shared/ui/toggle";
import { useUserMyPageQuery } from "@/entities/viewer/model";
import { useUserMyPageMutation } from "@/features/profile/model";
import { queryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/model/query-keys";
import { useEffect, useMemo, useState } from "react";
import { IconClose, IconEmptyReview, IconKakao, IconLock, IconMore, IconShare } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import { useToast } from "@/shared/ui/toast";
import render from "@/shared/ui/render";

const { Kakao } = window as any;

const UserReviewPage = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const { userInformationQuery } = useUserInformationQuery();
  const { userReviewQuery } = useUserReviewQuery(userId);
  const { userMyPageQuery } = useUserMyPageQuery(userId);

  const { openToast } = useToast();

  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  const my = useMemo(() => {
    return userInformationQuery.data?._id === userId;
  }, [userInformationQuery.data?._id, userId]);

  const { update } = useUserMyPageMutation();
  const { myReviewQuery } = useMyReviewQuery(my);

  useEffect(() => {
    console.log("myReviewQuery", myReviewQuery.data);
  }, [myReviewQuery.data]);

  const ref = useIntersectionObserver({
    onIntersect: () => {
      if (my) {
        myReviewQuery.fetchNextPage();
      } else {
        if (!userReviewQuery.isError) {
          userReviewQuery.fetchNextPage();
        }
      }
    },
  });

  const handleReviewToggle = (isPublic: boolean) => {
    update.mutate(isPublic, {
      onSuccess: () => {
        queryClient.invalidateQueries({ ...queryKeys.userMyPage.user(userId!) });
      },
    });
  };

  const handleShare = (type: "kakao" | "url" | "more") => {
    if (type === "kakao") {
      handleShareKakao();
    } else if (type === "url") {
      handleCopyLink();
    } else if (type === "more") {
      handleShareMore();
    }
    // setIsSharePopupOpen(false);
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      openToast("주소가 복사되었습니다");
    } catch (error) {
      console.error("주소 복사에 실패했습니다:", error);
    }
  };

  const handleShareMore = () => {
    if (navigator.share) {
      navigator.share({
        title: "라이징",
        text: `${userMyPageQuery.data?.nickname}님의 페이지를 확인해보세요!`,
        url: window.location.href,
      });
    } else {
      openToast("공유 기능을 지원하지 않는 브라우저입니다");
    }
  };

  const handleShareKakao = () => {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "라이징",
        description: `${userMyPageQuery.data?.nickname}`,
        // imageUrl:
        //   userMyPageQuery.data?.profileImageUrl ??
        //   userMyPageQuery.data?.profileImageUrl ??
        //   "https://ramenroad.com/_favicon.svg",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  };

  useEffect(() => {
    if (!Kakao.isInitialized()) {
      Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
    }
  }, []);

  //

  return (
    <>
      <TopBar title="작성한 리뷰" icon={<IconShare />} onIconClick={() => setIsSharePopupOpen(true)} />
      <PageWrapper>
        <UserInformationCard
          userName={userMyPageQuery.data?.nickname || ""}
          profileImageUrl={userMyPageQuery.data?.profileImageUrl || ""}
          monthlyReviewCount={userMyPageQuery.data?.currentMonthReviewCount || 0}
          avgReviewRating={userMyPageQuery.data?.avgReviewRating.toFixed(1) || 0}
          reviewCount={userMyPageQuery.data?.reviewCount || 0}
        />
        <BoldLine />
        <ReviewResultWrapper>
          <ReviewResultWrapperHeader>
            <RaisingText size={18} weight="m">
              총 작성 리뷰 {userMyPageQuery.data?.reviewCount || 0}개
            </RaisingText>
            <ReviewToggleWrapper>
              <ReviewToggleText size={12} weight="m">
                리뷰 {userMyPageQuery.data?.isPublic ? "공개" : "비공개"}
              </ReviewToggleText>
              {my && (
                <Toggle
                  checked={userMyPageQuery.data?.isPublic || false}
                  onChange={handleReviewToggle}
                  onText="ON"
                  offText="OFF"
                />
              )}
            </ReviewToggleWrapper>
          </ReviewResultWrapperHeader>
        </ReviewResultWrapper>
        <Line />
        {my ? (
          myReviewQuery.data?.pages.flatMap((page) => page.reviews).length === 0 ? (
            <EmptyReviewOverlay />
          ) : (
            myReviewQuery.data?.pages.map((page) =>
              page.reviews?.map((review) => (
                <>
                  <ReviewCard key={review._id} review={review} editable mypage />
                  <Line />
                </>
              )),
            )
          )
        ) : userReviewQuery.isError ? (
          <UnavailableReviewOverlay>
            <IconLock />
            <PrivateReviewTitle size={16} weight="r">
              비공개 리뷰입니다
            </PrivateReviewTitle>
            <PrivateReviewDescription size={14} weight="r">
              다른 리뷰 보러 가보실래요?
            </PrivateReviewDescription>
            <RedirectButton onClick={() => navigate("/")}>
              <RaisingText size={16} weight="m">
                메인 화면으로 이동
              </RaisingText>
            </RedirectButton>
          </UnavailableReviewOverlay>
        ) : (
          userReviewQuery.data?.pages.map((page) =>
            page.reviews.map((review) => (
              <>
                <ReviewCard key={review._id} review={review} editable={false} mypage />
                <Line />
              </>
            )),
          )
        )}
        <div ref={ref} />
      </PageWrapper>
      {isSharePopupOpen && (
        <Modal isOpen={isSharePopupOpen} onClose={() => setIsSharePopupOpen(false)}>
          <ModalContent>
            <ModalHeader>
              <RaisingText size={16} weight="sb">
                공유하기
              </RaisingText>
              <ModalCloseButton onClick={() => setIsSharePopupOpen(false)} />
            </ModalHeader>
            <ModalShareContent>
              <ShareOption onClick={() => handleShare("kakao")}>
                <KakaoBackground>
                  <IconKakao />
                </KakaoBackground>
                <ShareOptionText size={12} weight="r">
                  카카오톡
                </ShareOptionText>
              </ShareOption>
              <ShareOption onClick={() => handleShare("url")}>
                <URLCopyBackground>
                  <URLShareOptionText size={12} weight="r">
                    URL
                  </URLShareOptionText>
                </URLCopyBackground>
                <ShareOptionText size={12} weight="r">
                  링크 복사
                </ShareOptionText>
              </ShareOption>
              <ShareOption onClick={() => handleShare("more")}>
                <MoreBackground>
                  <IconMore color="#FFFFFF" />
                </MoreBackground>
                <ShareOptionText size={12} weight="r">
                  더보기
                </ShareOptionText>
              </ShareOption>
            </ModalShareContent>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

const ModalContent = render.div(
  "flex flex-col gap-24 w-320 pt-16 pb-20 items-center justify-center bg-white rounded-[12px]",
);

const ModalHeader = render.div("relative flex justify-center items-center w-full");

const ModalCloseButton = render.extend(IconClose, "absolute right-20 top-4 cursor-pointer");

const ModalShareContent = render.div("flex gap-30 w-full justify-center items-center");

const ShareOption = render.div("flex flex-col gap-10 items-center cursor-pointer");

const URLShareOptionText = render.extend(RaisingText, "text-white font-14-sb");

const KakaoBackground = render.div("w-60 h-60 rounded-full bg-[#FAE100] flex justify-center items-center");

const URLCopyBackground = render.div("w-60 h-60 rounded-full bg-[#B7BEC7] flex justify-center items-center");

const MoreBackground = render.div("w-60 h-60 rounded-full bg-[#D8DDE5] flex justify-center items-center");

const ShareOptionText = render.extend(RaisingText, "text-[14px] text-gray-70");

const EmptyReviewOverlay = () => {
  return (
    <UnavailableReviewOverlay>
      <IconEmptyReview />
      <PrivateReviewTitle size={16} weight="r">
        등록된 리뷰가 없습니다
      </PrivateReviewTitle>
      <PrivateReviewDescription size={14} weight="r">
        방문하셨나요? 평가를 남겨보세요!
      </PrivateReviewDescription>
    </UnavailableReviewOverlay>
  );
};
interface UserInformationCardProps {
  userName: string;
  profileImageUrl: string;
  monthlyReviewCount: number;
  avgReviewRating: number | string;
  reviewCount: number;
}

const UserInformationCard = (props: UserInformationCardProps) => {
  return (
    <UserInformationCardWrapper>
      <UserInformationCardContent>
        <UserInformationCardContentLeftSection>
          <UserInformationCardContentLeftSectionImage src={props.profileImageUrl} />
        </UserInformationCardContentLeftSection>
        <UserInformationCardContentRightSection>
          <UserInformationCardContentRightSectionName>{props.userName}</UserInformationCardContentRightSectionName>
          <UserInformationCardContentRightSectionSubName>
            이번 달 작성 리뷰{" "}
            <RaisingText size={14} weight="m">
              {props.monthlyReviewCount}
            </RaisingText>
          </UserInformationCardContentRightSectionSubName>
        </UserInformationCardContentRightSection>
      </UserInformationCardContent>
      <UserInformationDetailContent>
        {/* 평균 별점 | 리뷰 */}
        <UserInformationDetailContentSection>
          <UserInformationDetailWrapper>
            <RaisingText size={20} weight="sb">
              {props.avgReviewRating}
            </RaisingText>
            <DetailTitle size={14} weight="r">
              평균 별점
            </DetailTitle>
          </UserInformationDetailWrapper>
        </UserInformationDetailContentSection>
        <LineWrapper>
          <Line vertical />
        </LineWrapper>
        <UserInformationDetailContentSection>
          <UserInformationDetailWrapper>
            <RaisingText size={20} weight="sb">
              {props.reviewCount}
            </RaisingText>
            <DetailTitle size={14} weight="r">
              리뷰
            </DetailTitle>
          </UserInformationDetailWrapper>
        </UserInformationDetailContentSection>
      </UserInformationDetailContent>
    </UserInformationCardWrapper>
  );
};

const UserInformationCardWrapper = render.section("px-20 pt-20 pb-30 flex flex-col gap-24");

const UserInformationCardContent = render.section("flex flex-row gap-12 items-center");

const UserInformationCardContentLeftSection = render.section("w-64 h-64 rounded-full overflow-hidden");

const UserInformationCardContentLeftSectionImage = render.img("w-full h-full object-cover");

const UserInformationCardContentRightSection = render.section("flex flex-col gap-2");

const UserInformationCardContentRightSectionName = render.section("text-[18px] font-medium");

const UserInformationCardContentRightSectionSubName = render.section("text-[14px] text-gray-500");

const UserInformationDetailContent = render.section("w-full h-75 bg-[#F9F9F9] flex rounded-[8px]");

const DetailTitle = render.extend(RaisingText, "text-gray-500");

const UserInformationDetailWrapper = render.section("flex flex-col items-center");

const UserInformationDetailContentSection = render.section("flex gap-4 items-center justify-center w-full");

const LineWrapper = render.section("py-22");

const BoldLine = render.extend(Line, "h-8");

const ReviewToggleText = render.extend(RaisingText, "text-filter-text");

const PageWrapper = render.section("flex flex-col box-border w-full");

const ReviewResultWrapper = render.section("px-20 pb-20 pt-24");

const ReviewResultWrapperHeader = render.section("flex flex-row justify-between items-center");

const ReviewToggleWrapper = render.section("flex flex-row gap-4 items-center");

export default UserReviewPage;

const PrivateReviewTitle = render.extend(RaisingText, "text-black mt-8");

const PrivateReviewDescription = render.extend(RaisingText, "text-gray-70 mt-4");

const UnavailableReviewOverlay = render.section("flex flex-col items-center justify-center h-450");

const RedirectButton = render.button(
  "w-176 h-44 bg-bright-orange rounded-[100px] text-orange border-none cursor-pointer mt-16",
);
