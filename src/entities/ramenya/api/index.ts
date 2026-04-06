import { instance, instanceWithNoVersioning } from "@/shared/api/http";
import type { BusinessHour, Ramenya, Region, RemenyaDetail } from "../model/types";

export const getRamenyaDetail = async (id: string) => {
  const response = await instance.get<RemenyaDetail>(`/ramenya/${id}`);
  return response.data;
};

export const getRamenyaListByRegion = async (location: string) => {
  const response = await instance.get<Ramenya[]>("/ramenya/all", {
    params: { region: location },
  });
  return response.data;
};

export const getRamenyaListByGenre = async (genre: string) => {
  const response = await instance.get<Ramenya[]>("/ramenya/all", {
    params: { genre },
    paramsSerializer: {
      encode: (param: string) => encodeURIComponent(param),
    },
  });
  return response.data;
};

export const getRegions = async () => {
  const response = await instance.get<Region>("/ramenya/regions");
  return response.data;
};

export interface GetRamenyaListWithGeolocationParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface GetRamenyaListWithGeolocationResponse {
  ramenyas: Ramenya[];
}

export const getRamenyaListWithGeolocation = async ({
  latitude,
  longitude,
  radius,
}: GetRamenyaListWithGeolocationParams) => {
  const response = await instance.get<GetRamenyaListWithGeolocationResponse>("/ramenya/nearby", {
    params: { latitude, longitude, radius },
  });
  return response.data;
};

export interface GetRamenyaListWithSearchParams {
  keyword?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  inLocation?: boolean;
  nearby?: boolean;
}

export const getRamenyaListWithSearch = async ({
  keyword,
  latitude,
  longitude,
  radius,
  inLocation,
  nearby,
}: GetRamenyaListWithSearchParams) => {
  const response = await instanceWithNoVersioning.get<Ramenya[]>("/search", {
    params: {
      query: keyword,
      latitude: !nearby ? undefined : latitude,
      longitude: !nearby ? undefined : longitude,
      radius: !nearby ? undefined : radius,
      inLocation,
    },
  });

  return response.data;
};

interface GetRamenyaSearchAutoCompleteResponse {
  ramenyaSearchResults: {
    _id: string;
    name: string;
    businessHours: BusinessHour[];
  }[];
  keywordSearchResults: {
    _id: string;
    name: string;
  }[];
}

export const getRamenyaSearchAutoComplete = async ({ query }: { query: string }) => {
  const response = await instanceWithNoVersioning.get<GetRamenyaSearchAutoCompleteResponse>("/search/autocomplete", {
    params: { query },
  });

  return response.data;
};

interface GetSearchHistoryResponse {
  searchKeywords: { _id: string; keyword: string }[];
  ramenyaNames: {
    _id: string;
    keyword: string;
    ramenyaId: {
      _id: string;
      businessHours: BusinessHour[];
    };
  }[];
}

export const getSearchHistory = async () => {
  const response = await instanceWithNoVersioning.get<GetSearchHistoryResponse>("/search/recent");

  return response.data;
};

export const removeSearchHistory = async (id: string[]) => {
  const response = await instanceWithNoVersioning.delete("/search/recent", {
    data: {
      keywordId: id,
    },
  });

  return response.data;
};
