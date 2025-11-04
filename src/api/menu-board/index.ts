import { instance } from "..";

export const postMenuBoard = async (data: FormData) => {
  const response = await instance.post("/ramenya/menu-board", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

interface DeleteMenuBoardProps {
  menuBoardId: string;
  ramenyaId: string;
}

export const deleteMenuBoard = async ({ menuBoardId, ramenyaId }: DeleteMenuBoardProps) => {
  const response = await instance.delete(`/ramenya/menu-board`, {
    data: {
      menuBoardId,
      ramenyaId,
    },
  });
  return response.data;
};
