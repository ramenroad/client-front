import { Review } from "../../types";
import { instance } from "../index";


export const postReview = async (data: Review) => {
  const response = await instance.post("/review", data);
  return response.data;
};
