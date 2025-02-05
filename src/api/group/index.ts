import { instance } from "../index";
import { RamenyaGroup, RamenyaGroupDetail } from "../../types";

export const getRamenyaGroup = async () => {
  const response = await instance.get<RamenyaGroup[]>(`/ramenya/group`);
  return response.data;
};

export const getRamenyaGroupDetail = async (id: string) => {
  const response = await instance.get<RamenyaGroupDetail>(`/ramenya/group/${id}`);
  return response.data;
};
    