import { instance } from "../index";
import { RamenyaGroup } from "../../types";

export const getRamenyaGroup = async () => {
  const response = await instance.get<RamenyaGroup[]>(`/ramenya/group/all`);
  return response.data;
};
