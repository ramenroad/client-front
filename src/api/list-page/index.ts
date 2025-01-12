import axios from "axios";
import { Ramenya } from "../../types";

const instance = axios.create({
  baseURL: "https://ramenroad.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getRamenyaList = async (location: string) => {
  const response = await instance.get<Ramenya[]>(`/ramenya/all`, {
    params: { region: location },
  });
  return response.data;
};
