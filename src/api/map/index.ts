import { Ramenya } from "../../types";
import { instance } from "../index";

export interface GetRamenyaListWithGeolocationParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface GetRamenyaListWithGeolocationResponse {
  ramenyas: Ramenya[];
}

export const getRamenyaListWithGeolocation = async ({
  latitude,
  longitude,
  radius,
}: GetRamenyaListWithGeolocationParams) => {
  const response = await instance.get<GetRamenyaListWithGeolocationResponse>(`/ramenya/nearby`, {
    params: {
      latitude,
      longitude,
      radius,
    },
  });

  return response.data;
};
