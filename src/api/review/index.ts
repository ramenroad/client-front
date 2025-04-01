import { Review } from "../../types";
import { instanceWithNoVersioning } from "../index";


export const postReview = async (data: Review) => {
  const response = await instanceWithNoVersioning.post("/review", data);
  return response.data;
};
