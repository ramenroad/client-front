import { instanceWithNoVersioning } from "../index";
import { Banner } from "../../types";

export const getBanner = async () => {
  const response = await instanceWithNoVersioning.get<Banner>("/banner");
  return response.data;
};
