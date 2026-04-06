import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocationStore } from "@/entities/location/model";
import { checkBusinessStatus } from "@/entities/ramenya/lib";
import {
  getRamenyaDetail,
  getRamenyaListByGenre,
  getRamenyaListByRegion,
  getRamenyaListWithGeolocation,
  getRamenyaListWithSearch,
  getRamenyaSearchAutoComplete,
  getRegions,
  type GetRamenyaListWithGeolocationParams,
  type GetRamenyaListWithSearchParams,
} from "@/entities/ramenya/api";
import { calculateDistanceValue } from "@/shared/lib/number";
import { queryKeys } from "@/shared/model/query-keys";
import { OpenStatus } from "./constants";
import { type FilterOptions, SortType } from "./filter";

type QueryType = "region" | "genre";

interface QueryParams {
  type: QueryType;
  value: string;
  filterOptions?: FilterOptions;
}

export const useRamenyaDetailQuery = (id?: string) => {
  const ramenyaDetailQuery = useQuery({
    ...queryKeys.ramenya.detail(id!),
    queryFn: () => getRamenyaDetail(id!),
    enabled: !!id,
  });

  return { ramenyaDetailQuery };
};

export const useRamenyaListQuery = ({ type, value, filterOptions }: QueryParams) => {
  const { current } = useLocationStore();

  const ramenyaListQuery = useQuery({
    ...queryKeys.ramenya.list({ type, value }),
    queryFn: () => (type === "region" ? getRamenyaListByRegion(value) : getRamenyaListByGenre(value)),
    select: (data) => {
      if (!filterOptions) {
        return data;
      }

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
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return filtered;
    },
    enabled: !!value,
  });

  return { ramenyaListQuery };
};

export const useRegionsQuery = () => {
  const regionsQuery = useQuery({
    ...queryKeys.ramenya.regions,
    queryFn: getRegions,
  });

  return { regionsQuery };
};

export const useRamenyaListWithGeolocationQuery = ({
  latitude,
  longitude,
  radius,
  filterOptions,
}: GetRamenyaListWithGeolocationParams & {
  filterOptions?: FilterOptions;
}) => {
  const ramenyaListWithGeolocationQuery = useQuery({
    ...queryKeys.ramenya.listWithGeolocation(latitude, longitude, radius),
    queryFn: () => getRamenyaListWithGeolocation({ latitude, longitude, radius }),
    select: (data) => {
      let filtered = data.ramenyas;

      if (!filterOptions) {
        return filtered;
      }

      if (filterOptions.isOpen) {
        filtered = filtered.filter((ramenya) => checkBusinessStatus(ramenya.businessHours).status === OpenStatus.OPEN);
      }

      if (filterOptions.genre.length > 0) {
        filtered = filtered.filter((ramenya) =>
          filterOptions.genre.every((selectedGenre) => ramenya.genre.includes(selectedGenre)),
        );
      }

      if (filterOptions.sort === SortType.DISTANCE) {
        return [...filtered].sort(
          (a, b) =>
            calculateDistanceValue(
              {
                latitude: latitude ?? 0,
                longitude: longitude ?? 0,
              },
              {
                latitude: a.latitude,
                longitude: a.longitude,
              },
            ) -
            calculateDistanceValue(
              {
                latitude: latitude ?? 0,
                longitude: longitude ?? 0,
              },
              {
                latitude: b.latitude,
                longitude: b.longitude,
              },
            ),
        );
      }

      if (filterOptions.sort === SortType.RATING) {
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return filtered ?? [];
    },
    enabled: !!latitude && !!longitude && !!radius,
  });

  return { ramenyaListWithGeolocationQuery };
};

export const useRamenyaListWithSearchQuery = ({
  latitude,
  longitude,
  radius,
  keyword,
  filterOptions,
  nearby,
}: GetRamenyaListWithSearchParams & { filterOptions?: FilterOptions; nearby: boolean }) => {
  const queryClient = useQueryClient();

  const ramenyaListWithSearchQuery = useQuery({
    ...queryKeys.ramenya.listWithSearch(keyword, nearby, latitude, longitude),
    queryFn: async () => {
      const data = await getRamenyaListWithSearch({ keyword, latitude, longitude, radius, inLocation: true, nearby });
      queryClient.refetchQueries(queryKeys.search.history);
      return data;
    },
    select: (data) => {
      if (!filterOptions) {
        return data;
      }

      let filtered = data;

      if (filterOptions.isOpen) {
        filtered = filtered.filter((ramenya) => checkBusinessStatus(ramenya.businessHours).status === OpenStatus.OPEN);
      }

      if (filterOptions.genre.length > 0) {
        filtered = filtered.filter((ramenya) =>
          filterOptions.genre.every((selectedGenre) => ramenya.genre.includes(selectedGenre)),
        );
      }

      if (filterOptions.sort === SortType.DISTANCE) {
        return [...filtered].sort(
          (a, b) =>
            calculateDistanceValue(
              { latitude: latitude ?? 0, longitude: longitude ?? 0 },
              { latitude: a.latitude, longitude: a.longitude },
            ) -
            calculateDistanceValue(
              { latitude: latitude ?? 0, longitude: longitude ?? 0 },
              { latitude: b.latitude, longitude: b.longitude },
            ),
        );
      }

      if (filterOptions.sort === SortType.RATING) {
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return filtered ?? [];
    },
    enabled: !!keyword,
  });

  return { ramenyaListWithSearchQuery };
};

export const useRamenyaSearchAutoCompleteQuery = ({ query }: { query?: string }) => {
  const ramenyaSearchAutoCompleteQuery = useQuery({
    ...queryKeys.ramenya.searchAutoComplete(query ?? ""),
    queryFn: () => getRamenyaSearchAutoComplete({ query: query! }),
    enabled: !!query && query.length > 0,
  });

  return { ramenyaSearchAutoCompleteQuery };
};
