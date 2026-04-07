import { useParams } from "react-router-dom";
import TopBar from "@/shared/ui/top-bar";
import { IconShare } from "@/shared/ui/icon";
import { UserReviewsContent, UserReviewsShareModal, useUserReviewsPage } from "@/widgets/user-reviews";

const UserReviewPage = () => {
  const { id: userId } = useParams();
  const {
    userMyPage,
    reviews,
    isMine,
    isPrivate,
    isSharePopupOpen,
    observerRef,
    openSharePopup,
    closeSharePopup,
    handleReviewVisibilityChange,
    handleShare,
    navigateHome,
  } = useUserReviewsPage(userId);

  return (
    <>
      <TopBar title="작성한 리뷰" icon={<IconShare />} onIconClick={openSharePopup} />
      <UserReviewsContent
        userMyPage={userMyPage}
        reviews={reviews}
        isMine={isMine}
        isPrivate={isPrivate}
        observerRef={observerRef}
        onReviewVisibilityChange={handleReviewVisibilityChange}
        onNavigateHome={navigateHome}
      />
      <UserReviewsShareModal isOpen={isSharePopupOpen} onClose={closeSharePopup} onShare={handleShare} />
    </>
  );
};

export default UserReviewPage;
