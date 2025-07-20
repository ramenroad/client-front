import { useMutation } from "@tanstack/react-query";
import { removeSearchHistory } from "../../api/map";
import { queryClient } from "../../core/queryClient";
import { queryKeys } from "../queries/queryKeys";

export const useRemoveSearchHistoryMutation = () => {
  const remove = useMutation({
    mutationFn: removeSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.search.history);
    },
  });

  return { remove };
};
