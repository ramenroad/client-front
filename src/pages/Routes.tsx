import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./main-page";
import LocationPage from "./location-page";
import DetailPage from "./detail-page";

const router = createBrowserRouter([

  {
    path: "*",
    element: (
  
        <MainPage />
    
    ),
  },
  {
    path: "/location/:location",
    element: <LocationPage />,
  },
  {
    path: "/detail/:id",
    element: <DetailPage />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
