import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./main-page";
import LocationPage from "./location-page";
import DetailPage from "./detail-page";
import GenrePage from "./genre-page";
import { BannerPage } from "./banner-page";
import GroupPage from "./group-page";
import LoginPage from "./login-page";
import LoginCallbackPage from "./login-callback";
import RegisterPage from "./register-page";
import MyPage from "./my-page";
import AppBarLayout from "../components/layout/AppBarLayout";
import WithoutAppBarLayout from "../components/layout/WithoutAppBarLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppBarLayout />,
    children: [
      {
        path: "",
        element: <MainPage />,
      },
      {
        path: "location/:location",
        element: <LocationPage />,
      },
      {
        path: "detail/:id",
        element: <DetailPage />,
      },
      {
        path: "genre/:genre",
        element: <GenrePage />,
      },
      {
        path: "banner",
        element: <BannerPage />,
      },
      {
        path: "group",
        element: <GroupPage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
  {
    path: "/",
    element: <WithoutAppBarLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "oauth/:id",
        element: <LoginCallbackPage />,
      },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
