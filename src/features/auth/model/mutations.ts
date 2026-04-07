import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { oAuthLogin, signOut, withdrawUser } from "@/entities/viewer/api";
import {
  clearUserInformation,
  setUserInformation,
  type UserInformation,
  useSignInStore,
} from "@/entities/viewer/model";
import { queryClient } from "@/shared/api/query-client";
import { usePageMemorize } from "@/shared/lib/usePageMemorize";
import { queryKeys } from "@/shared/model/query-keys";
import { useToast } from "@/shared/ui/toast";

export const useAuthMutation = () => {
  const navigate = useNavigate();
  const { setTokens } = useSignInStore();
  const { clearTokens } = useSignInStore();
  const { openToast } = useToast();
  const { getStoredPageData } = usePageMemorize();

  const add = useMutation({
    mutationFn: async ({ id, code }: { id: string; code: string }) => {
      return await oAuthLogin(id, code);
    },
    onSuccess: (data) => {
      openToast("로그인 성공 !");

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
        return;
      }

      navigate(getStoredPageData()?.pathname ?? "/");
    },
  });

  const remove = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      clearTokens();
      clearUserInformation();
      queryClient.setQueryData(queryKeys.user.information.queryKey, null);
      navigate("/");
      openToast("로그아웃 완료");
    },
  });

  const removeAccount = useMutation({
    mutationFn: withdrawUser,
    onSuccess: () => {
      clearTokens();
      clearUserInformation();
      queryClient.setQueryData(queryKeys.user.information.queryKey, null);
    },
  });

  return { add, remove, removeAccount };
};
