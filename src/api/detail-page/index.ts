import { instance } from "../index";
import { RemenyaDetail } from "../../types";

export const getRamenyaDetail = async (id: string) => {
  const response = await instance.get<RemenyaDetail>(`/ramenya/${id}`);
  console.log(response.data);
  return response.data;
};
