import {
  getRamenyaListByRegion,
  getRamenyaListByGenre,
} from "../../api/list-page";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
type QueryType = "region" | "genre";

interface QueryParams {
  type: QueryType;
  value: string;
}

export const useRamenyaListQuery = ({ type, value }: QueryParams) => {
  return useQuery({
    ...queryKeys.ramenya.list({ type, value }),
    queryFn: () =>
      type === "region"
        ? getRamenyaListByRegion(value)
        : getRamenyaListByGenre(value),
    enabled: !!value,
  });
};
