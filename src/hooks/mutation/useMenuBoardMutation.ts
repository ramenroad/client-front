import { useMutation } from "@tanstack/react-query";
import { postMenuBoard } from "../../api/menu-board";

export const useMenuBoardMutation = () => {
  const addMenuBoard = useMutation({
    mutationFn: postMenuBoard,
  });

  return { addMenuBoard };
};
