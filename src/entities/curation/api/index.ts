import { instance, instanceWithNoVersioning } from "@/shared/api/http";
import type { Banner, RamenyaGroup } from "../model/types";

export const getBanner = async () => {
  const response = await instanceWithNoVersioning.get<Banner>("/banner");
  return response.data;
};

export const getRamenyaGroup = async () => {
  const response = await instance.get<RamenyaGroup[]>("/ramenya/group/all");
  return response.data;
};
