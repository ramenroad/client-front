import { useMutation } from "@tanstack/react-query";
import { deleteMenuBoard, postMenuBoard } from "@/entities/menu-board/api";

export const useMenuBoardMutation = () => {
  const add = useMutation({
    mutationFn: postMenuBoard,
  });

  const remove = useMutation({
    mutationFn: deleteMenuBoard,
  });

  return { add, remove };
};
