import { useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/entities/location/model";
import { checkBusinessStatus } from "@/entities/ramenya/lib";
import {
  getRamenyaDetail,
  getRamenyaList,
  getRamenyaListWithGeolocation,
  getRamenyaListWithSearch,
  getRamenyaSearchAutoComplete,
  getRegions,
  type GetRamenyaListWithGeolocationParams,
  type GetRamenyaListWithSearchParams,
  type RamenyaListFilterType,
} from "@/entities/ramenya/api";
import { calculateDistanceValue, type Coordinate } from "@/shared/lib/number";
import { queryKeys } from "@/shared/model/query-keys";
import type { Ramenya } from "./types";
import { OpenStatus } from "./constants";
import { type FilterOptions, SortType } from "./filter";

type QueryType = RamenyaListFilterType;

interface QueryParams {
  type: QueryType;
  value: string;
  filterOptions?: FilterOptions;
}

const hasValidCoordinate = (coordinate?: Partial<Coordinate> | null): coordinate is Coordinate => {
  return coordinate?.latitude !== undefined && coordinate?.longitude !== undefined;
};

const matchesOpenFilter = (ramenya: Ramenya) => {
  return checkBusinessStatus(ramenya.businessHours).status === OpenStatus.OPEN;
};

const matchesGenreFilter = (ramenya: Ramenya, genres: string[]) => {
  return genres.every((selectedGenre) => ramenya.genre.includes(selectedGenre));
};

const filterRamenyas = (ramenyas: Ramenya[], filterOptions?: FilterOptions) => {
  if (!filterOptions) {
    return ramenyas;
  }

  let filtered = ramenyas;

  if (filterOptions.isOpen) {
    filtered = filtered.filter(matchesOpenFilter);
  }

  if (filterOptions.genre.length > 0) {
    filtered = filtered.filter((ramenya) => matchesGenreFilter(ramenya, filterOptions.genre));
  }

  return filtered;
};

const sortByDistance = (ramenyas: Ramenya[], currentCoordinate: Coordinate) => {
  return [...ramenyas].sort(
    (a, b) =>
      calculateDistanceValue(currentCoordinate, {
        latitude: a.latitude,
        longitude: a.longitude,
      }) -
      calculateDistanceValue(currentCoordinate, {
        latitude: b.latitude,
        longitude: b.longitude,
      }),
  );
};

const sortRamenyas = (ramenyas: Ramenya[], filterOptions?: FilterOptions, currentCoordinate?: Coordinate | null) => {
  if (!filterOptions) {
    return ramenyas;
  }

  if (filterOptions.sort === SortType.DISTANCE) {
    return currentCoordinate ? sortByDistance(ramenyas, currentCoordinate) : ramenyas;
  }

  if (filterOptions.sort === SortType.RATING) {
    return [...ramenyas].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return ramenyas;
};

const selectRamenyaList = ({
  ramenyas,
  filterOptions,
  currentCoordinate,
}: {
  ramenyas: Ramenya[];
  filterOptions?: FilterOptions;
  currentCoordinate?: Coordinate | null;
}) => {
  const filtered = filterRamenyas(ramenyas, filterOptions);

  return sortRamenyas(filtered, filterOptions, currentCoordinate);
};

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
  const currentCoordinate = hasValidCoordinate(current) && current.latitude !== 0 && current.longitude !== 0 ? current : null;

  const ramenyaListQuery = useQuery({
    ...queryKeys.ramenya.list({ type, value }),
    queryFn: () => getRamenyaList({ type, value }),
    select: (ramenyas) => selectRamenyaList({ ramenyas, filterOptions, currentCoordinate }),
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
  const currentCoordinate: Coordinate = {
    latitude: latitude ?? 0,
    longitude: longitude ?? 0,
  };

  const ramenyaListWithGeolocationQuery = useQuery({
    ...queryKeys.ramenya.listWithGeolocation(latitude, longitude, radius),
    queryFn: () => getRamenyaListWithGeolocation({ latitude, longitude, radius }),
    select: ({ ramenyas }) => selectRamenyaList({ ramenyas, filterOptions, currentCoordinate }),
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
  const currentCoordinate: Coordinate = {
    latitude: latitude ?? 0,
    longitude: longitude ?? 0,
  };

  const ramenyaListWithSearchQuery = useQuery({
    ...queryKeys.ramenya.listWithSearch(keyword, nearby, latitude, longitude),
    queryFn: () => getRamenyaListWithSearch({ keyword, latitude, longitude, radius, inLocation: true, nearby }),
    select: (ramenyas) => selectRamenyaList({ ramenyas, filterOptions, currentCoordinate }),
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
