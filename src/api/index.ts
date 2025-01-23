import axios from "axios";

export const instance = axios.create({
  baseURL: "https://ramenroad.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
