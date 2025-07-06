import { instance } from "../index";

export interface GetRamenyaListWithGeolocationParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export const getRamenyaListWithGeolocation = async ({
  latitude,
  longitude,
  radius,
}: GetRamenyaListWithGeolocationParams) => {
  const response = await instance.get(`/ramenya/nearby`, {
    params: {
      latitude,
      longitude,
      radius,
    },
  });

  return response.data;
};
