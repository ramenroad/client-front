import { Navigate } from "react-router-dom";
import { useSignInStore } from "../states/sign-in";
import tw from "twin.macro";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isSignIn = useSignInStore((state) => state.isSignIn);
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  if (!isSignIn || !isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = tw.div`
  flex
`;

export default ProtectedRoute;
