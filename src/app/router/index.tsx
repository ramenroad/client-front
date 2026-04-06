import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BannerPage from "@/pages/banner";
import GroupPage from "@/pages/group";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import MapSearchPage from "@/pages/map-search";
import MenuBoardImagesPage from "@/pages/menu-board-images";
import MenuBoardSubmitPage from "@/pages/menu-board-submit";
import MyInformationPage from "@/pages/my-information";
import MyProfilePage from "@/pages/my-profile";
import OAuthCallbackPage from "@/pages/oauth-callback";
import RamenyaByGenrePage from "@/pages/ramenya-by-genre";
import RamenyaByRegionPage from "@/pages/ramenya-by-region";
import RamenyaDetailPage from "@/pages/ramenya-detail";
import RegisterNicknamePage from "@/pages/register-nickname";
import ReviewCreatePage from "@/pages/review-create";
import ReviewEditPage from "@/pages/review-edit";
import ReviewImagesPage from "@/pages/review-images";
import ReviewListPage from "@/pages/review-list";
import UserReviewsPage from "@/pages/user-reviews";
import WithdrawPage from "@/pages/withdraw";
import AppBarLayout from "@/widgets/layouts/app-bar-layout";
import MapLayout from "@/widgets/layouts/map-layout";
import WithoutAppBarLayout from "@/widgets/layouts/without-app-bar-layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppBarLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "location/:location",
        element: <RamenyaByRegionPage />,
      },
      {
        path: "detail/:id",
        element: <RamenyaDetailPage />,
      },
      {
        path: "genre/:genre",
        element: <RamenyaByGenrePage />,
      },
      {
        path: "banner",
        element: <BannerPage />,
      },
      {
        path: "group/:id",
        element: <GroupPage />,
      },
      {
        path: "mypage",
        element: <MyProfilePage />,
      },
      {
        path: "information",
        element: <MyInformationPage />,
      },
      {
        path: "user-review/:id",
        element: <UserReviewsPage />,
      },
      {
        path: "/review/list/:id",
        element: <ReviewListPage />,
      },
    ],
  },
  {
    path: "/",
    element: <WithoutAppBarLayout />,
    children: [
      {
        path: "register",
        element: <RegisterNicknamePage />,
      },
      {
        path: "menu-board-submit/:id",
        element: <MenuBoardSubmitPage />,
      },
      {
        path: "menu-board-edit/:id",
        element: <MenuBoardSubmitPage />,
      },
    ],
  },
  {
    path: "map",
    element: <MapLayout />,
    children: [
      {
        path: "",
        element: <MapSearchPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "oauth/:id",
    element: <OAuthCallbackPage />,
  },
  {
    path: "/review/create/:id",
    element: <ReviewCreatePage />,
  },
  {
    path: "/review/edit/:id",
    element: <ReviewEditPage />,
  },
  {
    path: "/images/:id",
    element: <ReviewImagesPage />,
  },
  {
    path: "/menu-board-images/:id",
    element: <MenuBoardImagesPage />,
  },
  {
    path: "withdraw",
    element: <WithdrawPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
