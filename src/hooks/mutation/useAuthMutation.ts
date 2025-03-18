// sign in 및 sign out이 들어갈거라 네이밍을 이렇게 지었습니다.

import { useMutation } from "@tanstack/react-query";
import { oAuthLogin } from "../../api/auth";
import { useSignInStore } from "../../states/sign-in";
import { queryClient } from "../../core/queryClient";
import { useNavigate } from "react-router-dom";

export const useAuthMutation = () => {
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: async ({ id, code }: { id: string; code: string }) => {
      return await oAuthLogin(id, code);
    },
    onSuccess: (data) => {
      sessionStorage.setItem("isAuthenticated", "true");
      useSignInStore.getState().setTokens(data);
      console.log(data);
      console.log(useSignInStore.getState());
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/register");
    },
  });

  return { login };
};
