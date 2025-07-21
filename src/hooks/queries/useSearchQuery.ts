import { useQuery } from "@tanstack/react-query";
import { getSearchHistory } from "../../api/map";
import { queryKeys } from "./queryKeys";
import { useSignInStore } from "../../states/sign-in";

export const useSearchHistoryQuery = () => {
  const searchHistoryQuery = useQuery({
    ...queryKeys.search.history,
    queryFn: getSearchHistory,
    enabled: !!useSignInStore.getState().isSignIn,
  });

  return { searchHistoryQuery };
};
