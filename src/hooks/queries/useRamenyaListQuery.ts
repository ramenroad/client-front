import { getRamenyaListByRegion, getRamenyaListByGenre, getRegions } from "../../api/list-page";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { FilterOptions, SortType } from "../../types/filter";
import { checkBusinessStatus } from "../../util";
import { useLocationStore } from "../../store/location/useLocationStore";
import { calculateDistanceValue } from "../../util/number";
type QueryType = "region" | "genre";

interface QueryParams {
  type: QueryType;
  value: string;
  filterOptions?: FilterOptions;
}

export const useRamenyaListQuery = ({ type, value, filterOptions }: QueryParams) => {
  const { current } = useLocationStore();

  const ramenyaListQuery = useQuery({
    ...queryKeys.ramenya.list({ type, value }),
    queryFn: () => (type === "region" ? getRamenyaListByRegion(value) : getRamenyaListByGenre(value)),
    select: (data) => {
      if (!filterOptions) return data;

      let filtered = data;
      if (filterOptions.isOpen) {
        filtered = filtered.filter((ramenya) => checkBusinessStatus(ramenya.businessHours).status === OpenStatus.OPEN);
      }

      if (filterOptions.genre.length > 0) {
        filtered = filtered.filter((ramenya) =>
          filterOptions.genre.every((selectedGenre) => ramenya.genre.includes(selectedGenre)),
        );
      }

      if (current.latitude !== 0 && current.longitude !== 0 && filterOptions.sort === SortType.DISTANCE) {
        if (current.latitude === 0 || current.longitude === 0) {
          return filtered;
        }

        return [...filtered].sort(
          (a, b) =>
            calculateDistanceValue(current, {
              latitude: a.latitude,
              longitude: a.longitude,
            }) -
            calculateDistanceValue(current, {
              latitude: b.latitude,
              longitude: b.longitude,
            }),
        );
      }

      if (filterOptions.sort === SortType.RATING) {
        return [...filtered].sort((a, b) => a.rating - b.rating);
      }

      return filtered;
    },
    enabled: !!value,
  });

  return { ramenyaListQuery };
};

export const useRegionsQuery = () => {
  return useQuery({
    ...queryKeys.ramenya.regions,
    queryFn: getRegions,
  });
};
