// sign in 및 sign out이 들어갈거라 네이밍을 이렇게 지었습니다.

import { useMutation } from "@tanstack/react-query";
import { oAuthLogin } from "../../api/auth";

export const useAuthMutation = () => {
  const login = useMutation({
    mutationFn: async ({ id, code }: { id: string; code: string }) => {
      return await oAuthLogin(id, code);
    },
  });

  return { login };
};
