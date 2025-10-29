import { instance } from "..";

export const postMenuBoard = async (data: FormData) => {
  const response = await instance.post("/ramenya/menu-board", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
