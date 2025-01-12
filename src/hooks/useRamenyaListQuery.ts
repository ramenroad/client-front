import {
  getRamenyaListByRegion,
  getRamenyaListByGenre,
} from "../api/list-page";
import { useQuery } from "@tanstack/react-query";

type QueryType = "region" | "genre";

interface QueryParams {
  type: QueryType;
  value: string;
}

export const useRamenyaListQuery = ({ type, value }: QueryParams) => {
  return useQuery({
    queryKey: [
      type === "region" ? "ramenyaListByRegion" : "ramenyaListByGenre",
      value,
    ],
    queryFn: () =>
      type === "region"
        ? getRamenyaListByRegion(value)
        : getRamenyaListByGenre(value),
    enabled: !!value,
  });
};
