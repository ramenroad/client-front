import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminPage from "./AdminPage";
import SignInPage from "./sign-in";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <div>main</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: <></>,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
