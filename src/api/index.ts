import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

const isProduction = process.env.NODE_ENV === "production";

export const createAxiosInstance = (queryClient: QueryClient) => {
  const instance = axios.create({
    baseURL: isProduction
      ? "https://ramenroad.com/api/v1"
      : "http://localhost:3000/v1",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request 인터셉터 추가
  instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
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
      if (
        originalRequest.url?.includes("/refresh") &&
        error.response?.status === 401
      ) {
        console.log("refreshToken API 호출에서 401 에러 발생");
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("401 에러 발생");

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const response = await instance.post("/auth/refresh", {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          queryClient.invalidateQueries({ queryKey: ["auth"] });

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const instance = createAxiosInstance(new QueryClient());

export const instanceWithNoVersioning = axios.create({
  baseURL: isProduction
    ? "https://ramenroad.com/api/"
    : "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
