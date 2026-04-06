import axios from "axios";
import { type QueryClient } from "@tanstack/react-query";
import { refreshToken } from "@/entities/viewer/api";
import { useSignInStore } from "@/entities/viewer/model";
import { executeMutation } from "@/shared/api/execute-mutation";
import { queryClient } from "@/shared/api/query-client";

export const createAxiosInstance = (client: QueryClient, versioning = true) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}${versioning ? "/v1" : "/"}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const accessToken = useSignInStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest.url?.includes("/refresh") && error.response?.status === 401) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          useSignInStore.setState({ ...useSignInStore.getState(), accessToken: null, isSignIn: false });

          const tokens = await executeMutation(refreshToken, useSignInStore.getState().refreshToken as string, {
            mutationKey: ["auth", "refresh"],
            retry: 0,
          });

          useSignInStore.getState().setTokens(tokens);
          client.invalidateQueries({ queryKey: ["auth"] });

          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          useSignInStore.getState().clearTokens();
          client.invalidateQueries({ queryKey: ["auth"] });
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const instance = createAxiosInstance(queryClient);
export const instanceWithNoVersioning = createAxiosInstance(queryClient, false);
