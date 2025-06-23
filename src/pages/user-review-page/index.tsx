import tw from "twin.macro";
import { RamenroadText } from "../../components/common/RamenroadText";
import TopBar from "../../components/common/TopBar";
import { useMyReviewQuery, useUserReviewQuery } from "../../hooks/queries/useRamenyaReviewQuery";
import { Line } from "../../components/common/Line";
import { UserReviewCard } from "../../components/review/UserReviewCard";
import { useParams } from "react-router-dom";
import { useIntersectionObserver } from "../../hooks/common/useIntersectionObserver";
import { useUserInformationQuery } from "../../hooks/queries/useUserInformationQuery";
import { Toggle } from "../../components/common/Toggle";
import { useUserMyPageQuery } from "../../hooks/queries/useUserMyPageQuery";
import { useUserMyPageMutation } from "../../hooks/mutation/useUserMyPageMutation";
import { queryClient } from "../../core/queryClient";
import { queryKeys } from "../../hooks/queries/queryKeys";
import { useEffect, useMemo, useState } from "react";
import { IconClose, IconKakao, IconMore, IconShare } from "../../components/Icon";
import { Modal } from "../../components/common/Modal";
import { useToast } from "../../components/ToastProvider";

const { Kakao } = window as any;

const UserReviewPage = () => {
  const { id: userId } = useParams();
  const { userInformationQuery } = useUserInformationQuery();
  const { userReviewQuery } = useUserReviewQuery(userId);
  const { userMyPageQuery } = useUserMyPageQuery(userId);

  const { openToast } = useToast();

  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  const my = useMemo(() => {
    return userInformationQuery.data?._id === userId;
  }, [userInformationQuery.data?._id, userId]);

  const { updateUserMyPageMutation } = useUserMyPageMutation();
  const { myReviewQuery } = useMyReviewQuery(my);

  const ref = useIntersectionObserver({
    onIntersect: userReviewQuery.fetchNextPage,
  });

  const handleReviewToggle = (isPublic: boolean) => {
    updateUserMyPageMutation.mutate(isPublic, {
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
        title: "라멘로드",
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
        title: "라멘로드",
        description: `${userMyPageQuery.data?.nickname}님의 페이지를 확인해보세요!`,
        imageUrl: userMyPageQuery.data?.profileImageUrl || "",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  };

  useEffect(() => {
    console.log("my", my);
  }, [my]);

  useEffect(() => {
    if (!Kakao.isInitialized()) {
      Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
    }
  }, []);

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
            <RamenroadText size={18} weight="m">
              총 작성 리뷰 {userMyPageQuery.data?.reviewCount || 0}개
            </RamenroadText>
            <ReviewToggleWrapper>
              <ReviewToggleText size={12} weight="m">
                리뷰 공개
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
        {my
          ? myReviewQuery.data?.pages.map((page) =>
              page.reviews.map((review) => (
                <>
                  <UserReviewCard key={review._id} review={review} editable mypage />
                  <Line />
                </>
              )),
            )
          : userReviewQuery.data?.pages.map((page) =>
              page.reviews.map((review) => (
                <>
                  <UserReviewCard key={review._id} review={review} editable={false} mypage />
                  <Line />
                </>
              )),
            )}
        <div ref={ref} />
      </PageWrapper>
      {isSharePopupOpen && (
        <Modal isOpen={isSharePopupOpen} onClose={() => setIsSharePopupOpen(false)}>
          <ModalContent>
            <ModalHeader>
              <RamenroadText size={16} weight="sb">
                공유하기
              </RamenroadText>
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
                  다른 옵션
                </ShareOptionText>
              </ShareOption>
            </ModalShareContent>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

const ModalContent = tw.div`
  flex flex-col gap-24 w-320 pt-20 pb-16
  items-center
  justify-center
  bg-white
  rounded-12
`;

const ModalHeader = tw.div`
  relative flex justify-center items-center w-full
`;

const ModalCloseButton = tw(IconClose)`
  absolute right-20 top-4 cursor-pointer
`;

const ModalShareContent = tw.div`
  flex gap-30 w-full justify-center items-center
`;

const ShareOption = tw.div`
  flex flex-col gap-10 items-center
  cursor-pointer
`;

const URLShareOptionText = tw(RamenroadText)`
  text-white
`;

const KakaoBackground = tw.div`
  w-60 h-60 rounded-full bg-[#FAE100]
  flex justify-center items-center
`;

const URLCopyBackground = tw.div`
  w-60 h-60 rounded-full bg-[#B7BEC7]
  flex justify-center items-center
`;

const MoreBackground = tw.div`
  w-60 h-60 rounded-full bg-[#D8DDE5]
  flex justify-center items-center
`;

const ShareOptionText = tw(RamenroadText)`
  text-14 text-gray-70
`;

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
            <RamenroadText size={14} weight="m">
              {props.monthlyReviewCount}
            </RamenroadText>
          </UserInformationCardContentRightSectionSubName>
        </UserInformationCardContentRightSection>
      </UserInformationCardContent>
      <UserInformationDetailContent>
        {/* 평균 별점 | 리뷰 */}
        <UserInformationDetailContentSection>
          <UserInformationDetailWrapper>
            <RamenroadText size={20} weight="sb">
              {props.avgReviewRating}
            </RamenroadText>
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
            <RamenroadText size={20} weight="sb">
              {props.reviewCount}
            </RamenroadText>
            <DetailTitle size={14} weight="r">
              리뷰
            </DetailTitle>
          </UserInformationDetailWrapper>
        </UserInformationDetailContentSection>
      </UserInformationDetailContent>
    </UserInformationCardWrapper>
  );
};

const UserInformationCardWrapper = tw.section`
  px-20 pt-20 pb-30 flex flex-col gap-24
`;

const UserInformationCardContent = tw.section`
  flex flex-row gap-12 items-center
`;

const UserInformationCardContentLeftSection = tw.section`
  w-64 h-64 rounded-full overflow-hidden
`;

const UserInformationCardContentLeftSectionImage = tw.img`
  w-full h-full object-cover
`;

const UserInformationCardContentRightSection = tw.section`
  flex flex-col gap-2
`;

const UserInformationCardContentRightSectionName = tw.section`
  text-18 font-medium
`;

const UserInformationCardContentRightSectionSubName = tw.section`
  text-14 text-gray-500
`;

const UserInformationDetailContent = tw.section`
  w-full h-75 bg-[#F9F9F9] flex rounded-8
`;

const DetailTitle = tw(RamenroadText)`
  text-gray-500
`;

const UserInformationDetailWrapper = tw.section`
  flex flex-col gap-4 items-center
`;

const UserInformationDetailContentSection = tw.section`
  flex gap-4 items-center justify-center
  w-full
`;

const LineWrapper = tw.section`
  py-22
`;

const BoldLine = tw(Line)`
  h-8
`;

const ReviewToggleText = tw(RamenroadText)`
  text-filter-text
`;

const PageWrapper = tw.section`
  flex flex-col
  box-border w-full
`;

const ReviewResultWrapper = tw.section`
  p-20
`;

const ReviewResultWrapperHeader = tw.section`
  flex flex-row justify-between items-center
`;

const ReviewToggleWrapper = tw.section`
  flex flex-row gap-4 items-center
`;

export default UserReviewPage;
