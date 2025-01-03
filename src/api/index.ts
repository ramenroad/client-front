import axios from "axios";

export const instance = axios.create({
    //baseURL: "http://52.78.143.51/v1",
    baseURL: "http://localhost:3000/v1",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });