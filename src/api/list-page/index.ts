import { instance } from "../index";
import { Ramenya } from "../../types";

export const getRamenyaList = async (location: string) => {
  const response = await instance.get<Ramenya[]>(`/ramenya/all`, {
    params: { region: location },
  });
  return response.data;
};
