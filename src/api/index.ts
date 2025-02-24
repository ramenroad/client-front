import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

export const instance = axios.create({
  baseURL: isProduction
    ? "https://ramenroad.com/api/v1"
    : "http://localhost:3000/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const instanceWithNoVersioning = axios.create({
  baseURL: isProduction
    ? "https://ramenroad.com/api/"
    : "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
