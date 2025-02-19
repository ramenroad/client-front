import { instance } from "../index";
import { Ramenya, Region } from "../../types";

export const getRamenyaListByRegion = async (location: string) => {
  const response = await instance.get<Ramenya[]>(`/ramenya/all`, {
    params: { region: location },
  });
  return response.data;
};

export const getRamenyaListByGenre = async (genre: string) => {
  const response = await instance.get<Ramenya[]>("/ramenya/all", {
    params: { genre },
    paramsSerializer: {
      encode: (param: string) => encodeURIComponent(param),
    },
  });
  return response.data;
};

export const getRegions = async () => {
  const response = await instance.get<Region>("/ramenya/regions");
  return response.data;
};
