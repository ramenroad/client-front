import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSearchHistory, removeSearchHistory } from "@/entities/ramenya/api";
import { useRamenyaListWithSearchQuery } from "@/entities/ramenya/model";
import type { FilterOptions } from "@/entities/ramenya/model";
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

interface UseMapSearchResultsQueryParams {
  keyword?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  filterOptions?: FilterOptions;
  nearby: boolean;
}

export const useMapSearchResultsQuery = ({
  keyword,
  latitude,
  longitude,
  radius,
  filterOptions,
  nearby,
}: UseMapSearchResultsQueryParams) => {
  const { isSignIn } = useSignInStore();
  const { ramenyaListWithSearchQuery } = useRamenyaListWithSearchQuery({
    keyword,
    latitude,
    longitude,
    radius,
    filterOptions,
    nearby,
  });

  useEffect(() => {
    if (!isSignIn || !keyword || !ramenyaListWithSearchQuery.isSuccess) {
      return;
    }

    queryClient.invalidateQueries({ ...queryKeys.search.history });
  }, [isSignIn, keyword, ramenyaListWithSearchQuery.dataUpdatedAt, ramenyaListWithSearchQuery.isSuccess]);

  return { ramenyaListWithSearchQuery };
};
