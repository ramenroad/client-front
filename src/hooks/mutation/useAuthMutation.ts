// sign in 및 sign out이 들어갈거라 네이밍을 이렇게 지었습니다.

import { useMutation } from "@tanstack/react-query";
import { oAuthLogin, signOut } from "../../api/auth";
import { useSignInStore } from "../../states/sign-in";
import { queryClient } from "../../core/queryClient";
import { useNavigate } from "react-router-dom";
import { queryKeys } from "../queries/queryKeys";

export const useAuthMutation = () => {
  const navigate = useNavigate();
  const { setTokens } = useSignInStore();
  const { clearTokens } = useSignInStore();

  const login = useMutation({
    mutationFn: async ({ id, code }: { id: string; code: string }) => {
      return await oAuthLogin(id, code);
    },
    onSuccess: (data) => {
      sessionStorage.setItem("isAuthenticated", "true");
      setTokens(data);
      queryClient.invalidateQueries({ ...queryKeys.user.information });
      if (data.type === "signup") {
        navigate("/register");
      } else {
        navigate("/");
      }
    },
  });

  const logout = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      sessionStorage.removeItem("isAuthenticated");
      queryClient.invalidateQueries({ ...queryKeys.user.information });
      clearTokens();
      navigate("/main");
    },
  });

  return { login, logout };
};
