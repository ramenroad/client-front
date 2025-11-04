import { useMutation } from "@tanstack/react-query";
import { deleteMenuBoard, postMenuBoard } from "../../api/menu-board";

export const useMenuBoardMutation = () => {
  const addMenuBoard = useMutation({
    mutationFn: postMenuBoard,
  });

  const removeMenuBoard = useMutation({
    mutationFn: deleteMenuBoard,
  });

  return { addMenuBoard, removeMenuBoard };
};
