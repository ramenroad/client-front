import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./main-page";
import LocationPage from "./location-page";
import DetailPage from "./detail-page";
import GenrePage from "./genre-page";
import { BannerPage } from "./banner-page";
import GroupPage from "./group-page";

const router = createBrowserRouter([
  {
    path: "*",
    element: <MainPage />,
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
