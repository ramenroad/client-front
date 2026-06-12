import { Suspense, lazy, type LazyExoticComponent, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RouteLoader } from './RouteLoader'

type LazyRouteComponent = LazyExoticComponent<() => ReactNode>

const AppBarLayout = lazy(() => import('@/widgets/layouts/app-bar-layout'))
const MapLayout = lazy(() => import('@/widgets/layouts/map-layout'))
const WithoutAppBarLayout = lazy(() => import('@/widgets/layouts/without-app-bar-layout'))

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
const ReviewPage = lazy(() => import('@/pages/review'))
const ReviewImagesPage = lazy(() => import('@/pages/review-images'))
const ReviewListPage = lazy(() => import('@/pages/review-list'))
const UserReviewsPage = lazy(() => import('@/pages/user-reviews'))
const WithdrawPage = lazy(() => import('@/pages/withdraw'))

const renderLazyRoute = (Component: LazyRouteComponent) => (
  <Suspense fallback={<RouteLoader />}>
    <Component />
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: renderLazyRoute(AppBarLayout),
    children: [
      {
        path: '',
        element: renderLazyRoute(HomePage),
      },
      {
        path: 'location/:location',
        element: renderLazyRoute(RamenyaByRegionPage),
      },
      {
        path: 'detail/:id',
        element: renderLazyRoute(RamenyaDetailPage),
      },
      {
        path: 'genre/:genre',
        element: renderLazyRoute(RamenyaByGenrePage),
      },
      {
        path: 'banner',
        element: renderLazyRoute(BannerPage),
      },
      {
        path: 'group/:id',
        element: renderLazyRoute(GroupPage),
      },
      {
        path: 'mypage',
        element: renderLazyRoute(MyProfilePage),
      },
      {
        path: 'my-activity',
        element: renderLazyRoute(MyActivityPage),
      },
      {
        path: 'my-search',
        element: renderLazyRoute(MySearchPage),
      },
      {
        path: 'information',
        element: renderLazyRoute(MyInformationPage),
      },
      {
        path: 'user-review/:id',
        element: renderLazyRoute(UserReviewsPage),
      },
      {
        path: '/review/list/:id',
        element: renderLazyRoute(ReviewListPage),
      },
    ],
  },
  {
    path: '/',
    element: renderLazyRoute(WithoutAppBarLayout),
    children: [
      {
        path: 'register',
        element: renderLazyRoute(RegisterNicknamePage),
      },
      {
        path: 'menu-board-submit/:id',
        element: renderLazyRoute(MenuBoardSubmitPage),
      },
      {
        path: 'menu-board-edit/:id',
        element: renderLazyRoute(MenuBoardSubmitPage),
      },
    ],
  },
  {
    path: 'map',
    element: renderLazyRoute(MapLayout),
    children: [
      {
        path: '',
        element: renderLazyRoute(MapSearchPage),
      },
    ],
  },
  {
    path: 'login',
    element: renderLazyRoute(LoginPage),
  },
  {
    path: 'community',
    element: renderLazyRoute(CommunityPage),
  },
  {
    path: 'community/notifications',
    element: renderLazyRoute(CommunityNotificationsPage),
  },
  {
    path: 'community/write',
    element: renderLazyRoute(CommunityWritePage),
  },
  {
    path: 'community/write/:id',
    element: renderLazyRoute(CommunityWritePage),
  },
  {
    path: 'community/:id',
    element: renderLazyRoute(CommunityDetailPage),
  },
  {
    path: 'oauth/:id',
    element: renderLazyRoute(OAuthCallbackPage),
  },
  {
    path: '/review/:mode/:id',
    element: renderLazyRoute(ReviewPage),
  },
  {
    path: '/images/:id',
    element: renderLazyRoute(ReviewImagesPage),
  },
  {
    path: '/menu-board-images/:id',
    element: renderLazyRoute(MenuBoardImagesPage),
  },
  {
    path: 'withdraw',
    element: renderLazyRoute(WithdrawPage),
  },
  {
    path: 'notice',
    element: renderLazyRoute(NoticePage),
  },
  {
    path: 'notice/:id',
    element: renderLazyRoute(NoticeDetailPage),
  },
  {
    path: 'patch-note',
    element: renderLazyRoute(PatchNotePage),
  },
  {
    path: 'patch-note/:id',
    element: renderLazyRoute(NoticeDetailPage),
  },
  {
    path: 'inquiry',
    element: renderLazyRoute(InquiryPage),
  },
  {
    path: 'policy',
    element: renderLazyRoute(PolicyPage),
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
