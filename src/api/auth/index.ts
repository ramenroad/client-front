import { instanceWithNoVersioning } from "..";

export interface oAuthLoginResponse {
  type: "signup" | "signin";
  accessToken: string;
  refreshToken: string;
}

export const oAuthLogin = async (id: string, code: string) => {
  const response = await instanceWithNoVersioning.post<oAuthLoginResponse>(`/auth/signin/${id}`, {
    authorizationCode: code,
    ...(id === "naver" ? { state: "ramenroad" } : {}),
  });

  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  instanceWithNoVersioning.defaults.headers.common["Authorization"] = `Bearer ${refreshToken}`;
  const response = await instanceWithNoVersioning.post("/auth/refresh");

  return response.data;
};

export const getUserInformation = async () => {
  const response = await instanceWithNoVersioning.get<{
    _id: string;
    nickname: string;
    email: string;
    profileImageUrl: string;
  }>("/mypage");

  return response.data;
};

export const updateUserNickname = async (nickname: string) => {
  const response = await instanceWithNoVersioning.patch("/mypage/nickname", {
    nickname,
  });

  return response.data;
};

export const updateUserImage = async (formData: FormData) => {
  const response = await instanceWithNoVersioning.patch("/mypage/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const signOut = async () => {
  const response = await instanceWithNoVersioning.post("/auth/signout");

  return response.data;
};

export const withdrawUser = async () => {
  const response = await instanceWithNoVersioning.post("/auth/withdrawal");

  return response.data;
};
