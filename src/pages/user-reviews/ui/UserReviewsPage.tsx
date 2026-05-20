import { IconShare } from '@/shared/ui/icon'
import TopBar from '@/shared/ui/top-bar'
import { useUserReviewsPage } from '../model/useUserReviewsPage'
import { UserReviewsContent } from './UserReviewsContent'
import { UserReviewsShareModal } from './UserReviewsShareModal'

const UserReviewsPage = () => {
  const {
    userInfo,
    reviews,
    isMine,
    isPrivate,
    isLoading,
    isSharePopupOpen,
    observerRef,
    openSharePopup,
    closeSharePopup,
    handleReviewVisibilityChange,
    handleShare,
    navigateHome,
  } = useUserReviewsPage()

  return (
    <>
      <TopBar title="작성한 리뷰" icon={<IconShare />} onIconClick={openSharePopup} />
      <UserReviewsContent
        userInfo={userInfo}
        reviews={reviews}
        isMine={isMine}
        isPrivate={isPrivate}
        isLoading={isLoading}
        observerRef={observerRef}
        onReviewVisibilityChange={handleReviewVisibilityChange}
        onNavigateHome={navigateHome}
      />
      <UserReviewsShareModal isOpen={isSharePopupOpen} onClose={closeSharePopup} onShare={handleShare} />
    </>
  )
}

export default UserReviewsPage
