import { useMutation, useQuery } from "@tanstack/react-query";
import { getSearchHistory, removeSearchHistory } from "@/entities/ramenya/api";
import { useSignInStore } from "@/entities/viewer/model";
import { queryClient } from "@/shared/api/query-client";
import { queryKeys } from "@/shared/model/query-keys";

export const useSearchHistoryQuery = () => {
  const searchHistoryQuery = useQuery({
    ...queryKeys.search.history,
    queryFn: getSearchHistory,
    enabled: !!useSignInStore.getState().isSignIn,
  });

  return { searchHistoryQuery };
};

export const useRemoveSearchHistoryMutation = () => {
  const remove = useMutation({
    mutationFn: removeSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.search.history);
    },
  });

  return { remove };
};
