import axios from "axios";
import { type QueryClient } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/model/query-keys";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface HttpAuthAdapter {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  refreshTokens: (refreshToken: string) => Promise<AuthTokens>;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
  onUnauthorized: () => void;
}

let authAdapter: HttpAuthAdapter | null = null;
let refreshPromise: Promise<AuthTokens> | null = null;

const shouldSkipTokenRefresh = (url?: string) => {
  if (!url) {
    return true;
  }

  return url.includes("/refresh") || url.includes("/auth/signin");
};

export const initializeHttpAuth = (adapter: HttpAuthAdapter) => {
  authAdapter = adapter;
};

export const createAxiosInstance = (client: QueryClient, versioning = true) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}${versioning ? "/v1" : "/"}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    if (config.headers.Authorization) {
      return config;
    }

    const accessToken = authAdapter?.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (shouldSkipTokenRefresh(originalRequest.url) && error.response?.status === 401) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!authAdapter) {
          return Promise.reject(error);
        }

        const refreshToken = authAdapter.getRefreshToken();
        if (!refreshToken) {
          authAdapter.clearTokens();
          authAdapter.onUnauthorized();
          return Promise.reject(error);
        }

        try {
          refreshPromise ??= authAdapter.refreshTokens(refreshToken);
          const tokens = await refreshPromise;
          authAdapter.setTokens(tokens);
          client.invalidateQueries({ ...queryKeys.user.information });

          refreshPromise = null;

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${tokens.accessToken}`,
          };
          return instance(originalRequest);
        } catch (refreshError) {
          refreshPromise = null;
          authAdapter.clearTokens();
          client.invalidateQueries({ ...queryKeys.user.information });
          authAdapter.onUnauthorized();
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
