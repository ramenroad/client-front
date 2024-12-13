import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./main-page";
import ProtectedRoute from "../components/ProtectedRoute";

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
