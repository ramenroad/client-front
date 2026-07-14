// 액티비티 레지스트리 — 컴포넌트 모듈이 아니라 "이름 → 화면" 매핑 테이블이라 fast-refresh 규칙이 맞지 않는다
// (구 app/router/index.tsx도 같은 이유로 이 규칙을 껐다).
/* eslint-disable react-refresh/only-export-components */
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { ActivityComponentType } from '@stackflow/react'
import type { ActivityName } from '@/shared/navigation'
import { ReviewFormFeature } from '@/features/review-form'
import { Screen } from './Screen'

/**
 * 액티비티 컴포넌트 맵 — 라우트 테이블(ACTIVITY_ROUTES)의 모든 키를 채워야 한다(타입이 강제).
 * 각 페이지를 스크린 래퍼로 감싸고, 청크는 지연 로드한다(구 라우터의 lazy + Suspense와 동일).
 */
const activity = (name: ActivityName, Page: ComponentType | LazyExoticComponent<ComponentType>) => {
  const Activity: ActivityComponentType<ActivityName> = () => (
    <Screen name={name}>
      <Page />
    </Screen>
  )

  Activity.displayName = `${name}Activity`

  return Activity
}

const BannerPage = lazy(() => import('@/pages/banner'))
const CommunityDetailPage = lazy(() => import('@/pages/community-detail'))
const CommunityNotificationsPage = lazy(() => import('@/pages/community-notifications'))
const CommunityPage = lazy(() => import('@/pages/community'))
const CommunityWritePage = lazy(() => import('@/pages/community-write'))
const GroupPage = lazy(() => import('@/pages/group'))
const HomePage = lazy(() => import('@/pages/home'))
const InquiryPage = lazy(() => import('@/pages/inquiry'))
const LoginPage = lazy(() => import('@/pages/login'))
const MapSearchPage = lazy(() => import('@/pages/map-search'))
const MenuBoardImagesPage = lazy(() => import('@/pages/menu-board-images'))
const MenuBoardSubmitPage = lazy(() => import('@/pages/menu-board-submit'))
const MyActivityPage = lazy(() => import('@/pages/my-activity'))
const MyCalendarPage = lazy(() => import('@/pages/my-calendar'))
const MyInformationPage = lazy(() => import('@/pages/my-information'))
const MyProfilePage = lazy(() => import('@/pages/my-profile'))
const MySearchPage = lazy(() => import('@/pages/my-search'))
const NoticeDetailPage = lazy(() => import('@/pages/notice-detail'))
const NoticePage = lazy(() => import('@/pages/notice'))
const OAuthCallbackPage = lazy(() => import('@/pages/oauth-callback'))
const PatchNotePage = lazy(() => import('@/pages/patch-note'))
const PolicyPage = lazy(() => import('@/pages/policy'))
const RamenyaByGenrePage = lazy(() => import('@/pages/ramenya-by-genre'))
const RamenyaByRegionPage = lazy(() => import('@/pages/ramenya-by-region'))
const RamenyaDetailPage = lazy(() => import('@/pages/ramenya-detail'))
const RegisterNicknamePage = lazy(() => import('@/pages/register-nickname'))
const ReviewImagesPage = lazy(() => import('@/pages/review-images'))
const ReviewListPage = lazy(() => import('@/pages/review-list'))
const UserReviewsPage = lazy(() => import('@/pages/user-reviews'))
const WithdrawPage = lazy(() => import('@/pages/withdraw'))

// 리뷰 작성/수정은 구 '/review/:mode/:id' 한 라우트를 모드별 액티비티로 쪼갠 것 —
// mode를 런타임에 검증하고 틀리면 홈으로 되돌리던 가드(구 pages/review의 <Navigate/>)가 필요 없어졌다.
const ReviewCreatePage = () => <ReviewFormFeature mode="create" />
const ReviewEditPage = () => <ReviewFormFeature mode="edit" />

export const activityComponents = {
  Home: activity('Home', HomePage),
  RamenyaByRegion: activity('RamenyaByRegion', RamenyaByRegionPage),
  RamenyaDetail: activity('RamenyaDetail', RamenyaDetailPage),
  RamenyaByGenre: activity('RamenyaByGenre', RamenyaByGenrePage),
  Banner: activity('Banner', BannerPage),
  Group: activity('Group', GroupPage),

  MapSearch: activity('MapSearch', MapSearchPage),

  Community: activity('Community', CommunityPage),
  CommunityNotifications: activity('CommunityNotifications', CommunityNotificationsPage),
  CommunityDetail: activity('CommunityDetail', CommunityDetailPage),
  CommunityWrite: activity('CommunityWrite', CommunityWritePage),
  CommunityEdit: activity('CommunityEdit', CommunityWritePage),

  MyProfile: activity('MyProfile', MyProfilePage),
  MyActivity: activity('MyActivity', MyActivityPage),
  MySearch: activity('MySearch', MySearchPage),
  MyInformation: activity('MyInformation', MyInformationPage),
  UserReviews: activity('UserReviews', UserReviewsPage),
  ReviewList: activity('ReviewList', ReviewListPage),

  MyCalendar: activity('MyCalendar', MyCalendarPage),

  Register: activity('Register', RegisterNicknamePage),
  MenuBoardSubmit: activity('MenuBoardSubmit', MenuBoardSubmitPage),
  MenuBoardEdit: activity('MenuBoardEdit', MenuBoardSubmitPage),

  Login: activity('Login', LoginPage),
  OAuthCallback: activity('OAuthCallback', OAuthCallbackPage),
  ReviewCreate: activity('ReviewCreate', ReviewCreatePage),
  ReviewEdit: activity('ReviewEdit', ReviewEditPage),
  ReviewImages: activity('ReviewImages', ReviewImagesPage),
  MenuBoardImages: activity('MenuBoardImages', MenuBoardImagesPage),
  Withdraw: activity('Withdraw', WithdrawPage),
  Notice: activity('Notice', NoticePage),
  NoticeDetail: activity('NoticeDetail', NoticeDetailPage),
  PatchNote: activity('PatchNote', PatchNotePage),
  PatchNoteDetail: activity('PatchNoteDetail', NoticeDetailPage),
  Inquiry: activity('Inquiry', InquiryPage),
  Policy: activity('Policy', PolicyPage),
} satisfies Record<ActivityName, ActivityComponentType<ActivityName>>
