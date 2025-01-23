import { instance } from "../index";
import { Banner } from "../../types";

export const getBanner = async () => {
  const response = await instance.get<Banner>("/banner");
  return response.data;
};
