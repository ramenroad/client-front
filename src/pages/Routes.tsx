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

const router = createBrowserRouter([
  {
    path: "*",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/oauth/:id",
    element: <LoginCallbackPage />,
  },
  {
    path: "/location/:location",
    element: <LocationPage />,
  },
  {
    path: "/detail/:id",
    element: <DetailPage />,
  },
  {
    path: "/genre/:genre",
    element: <GenrePage />,
  },
  {
    path: "/banner",
    element: <BannerPage />,
  },
  {
    path: "/group",
    element: <GroupPage />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
