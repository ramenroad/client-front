import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./main-page";

const router = createBrowserRouter([

  {
    path: "*",
    element: (
  
        <MainPage />
    
    ),
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
