import { instanceWithNoVersioning } from "..";

export const oAuthLogin = async (id: string, code: string) => {
  const response = await instanceWithNoVersioning.post(`/auth/signin/${id}`, {
    authorizationCode: code,
  });

  return response.data;
};
