import axios from "axios";

export const instance = axios.create({
  //baseURL: "https://ramenroad.com/api/v1",
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
