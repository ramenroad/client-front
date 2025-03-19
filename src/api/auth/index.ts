import { instanceWithNoVersioning } from "..";

export const oAuthLogin = async (id: string, code: string) => {
  const response = await instanceWithNoVersioning.post(`/auth/signin/${id}`, {
    authorizationCode: code,
  });

  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  instanceWithNoVersioning.defaults.headers.common["Authorization"] =
    `Bearer ${refreshToken}`;
  const response = await instanceWithNoVersioning.post("/auth/refresh");

  return response.data;
};
