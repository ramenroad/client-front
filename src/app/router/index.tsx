import { Suspense, lazy, type LazyExoticComponent, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouteLoader } from "./RouteLoader";

type LazyRouteComponent = LazyExoticComponent<() => ReactNode>;

const AppBarLayout = lazy(() => import("@/widgets/layouts/app-bar-layout"));
const MapLayout = lazy(() => import("@/widgets/layouts/map-layout"));
const WithoutAppBarLayout = lazy(() => import("@/widgets/layouts/without-app-bar-layout"));

const BannerPage = lazy(() => import("@/pages/banner"));
const GroupPage = lazy(() => import("@/pages/group"));
const HomePage = lazy(() => import("@/pages/home"));
const LoginPage = lazy(() => import("@/pages/login"));
const MapSearchPage = lazy(() => import("@/pages/map-search"));
const MenuBoardImagesPage = lazy(() => import("@/pages/menu-board-images"));
const MenuBoardSubmitPage = lazy(() => import("@/pages/menu-board-submit"));
const MyInformationPage = lazy(() => import("@/pages/my-information"));
const MyProfilePage = lazy(() => import("@/pages/my-profile"));
const OAuthCallbackPage = lazy(() => import("@/pages/oauth-callback"));
const RamenyaByGenrePage = lazy(() => import("@/pages/ramenya-by-genre"));
const RamenyaByRegionPage = lazy(() => import("@/pages/ramenya-by-region"));
const RamenyaDetailPage = lazy(() => import("@/pages/ramenya-detail"));
const RegisterNicknamePage = lazy(() => import("@/pages/register-nickname"));
const ReviewPage = lazy(() => import("@/pages/review"));
const ReviewImagesPage = lazy(() => import("@/pages/review-images"));
const ReviewListPage = lazy(() => import("@/pages/review-list"));
const UserReviewsPage = lazy(() => import("@/pages/user-reviews"));
const WithdrawPage = lazy(() => import("@/pages/withdraw"));

const renderLazyRoute = (Component: LazyRouteComponent) => (
  <Suspense fallback={<RouteLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: renderLazyRoute(AppBarLayout),
    children: [
      {
        path: "",
        element: renderLazyRoute(HomePage),
      },
      {
        path: "location/:location",
        element: renderLazyRoute(RamenyaByRegionPage),
      },
      {
        path: "detail/:id",
        element: renderLazyRoute(RamenyaDetailPage),
      },
      {
        path: "genre/:genre",
        element: renderLazyRoute(RamenyaByGenrePage),
      },
      {
        path: "banner",
        element: renderLazyRoute(BannerPage),
      },
      {
        path: "group/:id",
        element: renderLazyRoute(GroupPage),
      },
      {
        path: "mypage",
        element: renderLazyRoute(MyProfilePage),
      },
      {
        path: "information",
        element: renderLazyRoute(MyInformationPage),
      },
      {
        path: "user-review/:id",
        element: renderLazyRoute(UserReviewsPage),
      },
      {
        path: "/review/list/:id",
        element: renderLazyRoute(ReviewListPage),
      },
    ],
  },
  {
    path: "/",
    element: renderLazyRoute(WithoutAppBarLayout),
    children: [
      {
        path: "register",
        element: renderLazyRoute(RegisterNicknamePage),
      },
      {
        path: "menu-board-submit/:id",
        element: renderLazyRoute(MenuBoardSubmitPage),
      },
      {
        path: "menu-board-edit/:id",
        element: renderLazyRoute(MenuBoardSubmitPage),
      },
    ],
  },
  {
    path: "map",
    element: renderLazyRoute(MapLayout),
    children: [
      {
        path: "",
        element: renderLazyRoute(MapSearchPage),
      },
    ],
  },
  {
    path: "login",
    element: renderLazyRoute(LoginPage),
  },
  {
    path: "oauth/:id",
    element: renderLazyRoute(OAuthCallbackPage),
  },
  {
    path: "/review/:mode/:id",
    element: renderLazyRoute(ReviewPage),
  },
  {
    path: "/images/:id",
    element: renderLazyRoute(ReviewImagesPage),
  },
  {
    path: "/menu-board-images/:id",
    element: renderLazyRoute(MenuBoardImagesPage),
  },
  {
    path: "withdraw",
    element: renderLazyRoute(WithdrawPage),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
