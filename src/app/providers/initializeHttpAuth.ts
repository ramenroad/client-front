import { refreshToken } from "@/entities/viewer/api";
import { clearUserInformation, useSignInStore } from "@/entities/viewer/model";
import { queryClient } from "@/shared/api/query-client";
import { initializeHttpAuth } from "@/shared/api/http";
import { queryKeys } from "@/shared/model/query-keys";

initializeHttpAuth({
  getAccessToken: () => useSignInStore.getState().accessToken,
  getRefreshToken: () => useSignInStore.getState().refreshToken,
  refreshTokens: refreshToken,
  setTokens: (tokens) => {
    useSignInStore.getState().setTokens(tokens);
  },
  clearTokens: () => {
    useSignInStore.getState().clearTokens();
    clearUserInformation();
    queryClient.setQueryData(queryKeys.user.information.queryKey, null);
  },
  onUnauthorized: () => {
    window.location.href = "/login";
  },
});
