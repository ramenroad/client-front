// sign in 및 sign out이 들어갈거라 네이밍을 이렇게 지었습니다.

import { useMutation } from "@tanstack/react-query";
import { oAuthLogin, signOut } from "../../api/auth";
import { useSignInStore } from "../../states/sign-in";
import { queryClient } from "../../core/queryClient";
import { useNavigate } from "react-router-dom";
import { queryKeys } from "../queries/queryKeys";
import { useToast } from "../../components/toast/ToastProvider";
import { setUserInformation } from "../../store/location/useUserInformationStore";
import { jwtDecode } from "jwt-decode";
import { UserInformation } from "../../types/user";

export const useAuthMutation = () => {
  const navigate = useNavigate();
  const { setTokens } = useSignInStore();
  const { clearTokens } = useSignInStore();
  const { openToast } = useToast();

  const login = useMutation({
    mutationFn: async ({ id, code }: { id: string; code: string }) => {
      return await oAuthLogin(id, code);
    },
    onSuccess: (data) => {
      openToast("로그인 성공");
      sessionStorage.setItem("isAuthenticated", "true");

      const decodedToken: UserInformation = jwtDecode(data.accessToken);

      setUserInformation({
        id: decodedToken.id,
        email: decodedToken.email,
        nickname: decodedToken.nickname,
      });

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
      clearTokens();
      queryClient.setQueryData(["user", "information"], null);
      navigate("/");
      openToast("로그아웃 완료");
    },
  });

  return { login, logout };
};
