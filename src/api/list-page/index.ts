import axios from "axios";
import { Ramenya } from "../../types";

const instance = axios.create({
  baseURL: "http://52.78.143.51/v1",
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
