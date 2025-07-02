import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { useSignInStore } from "../states/sign-in";
import { refreshToken } from "./auth";

export const createAxiosInstance = (queryClient: QueryClient, versioning: boolean = true) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}${versioning ? "/v1" : "/"}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request 인터셉터 추가
  instance.interceptors.request.use((config) => {
    const accessToken = useSignInStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response 인터셉터
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // refreshToken API 호출에서는 재시도하지 않도록 체크
      if (originalRequest.url?.includes("/refresh") && error.response?.status === 401) {
        console.log("refreshToken API 호출에서 401 에러 발생");
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          useSignInStore.setState({ ...useSignInStore.getState(), accessToken: null, isSignIn: false });
          const tokens = await refreshToken(useSignInStore.getState().refreshToken as string);

          useSignInStore.getState().setTokens(tokens);
          queryClient.invalidateQueries({ queryKey: ["auth"] });

          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          useSignInStore.getState().clearTokens();
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

const queryClient = new QueryClient();
export const instance = createAxiosInstance(queryClient);
export const instanceWithNoVersioning = createAxiosInstance(queryClient, false);
