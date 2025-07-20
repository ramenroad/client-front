import { BusinessHour, Ramenya } from "../../types";
import { instance, instanceWithNoVersioning } from "../index";

export interface GetRamenyaListWithGeolocationParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface GetRamenyaListWithGeolocationResponse {
  ramenyas: Ramenya[];
}

export const getRamenyaListWithGeolocation = async ({
  latitude,
  longitude,
  radius,
}: GetRamenyaListWithGeolocationParams) => {
  const response = await instance.get<GetRamenyaListWithGeolocationResponse>(`/ramenya/nearby`, {
    params: {
      latitude,
      longitude,
      radius,
    },
  });

  return response.data;
};

export const getRamenyaListWithSearch = async ({
  query,
  latitude,
  longitude,
  radius,
  inLocation,
}: {
  query: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  inLocation?: boolean;
}) => {
  const response = await instanceWithNoVersioning.get<Ramenya[]>(`/search`, {
    params: {
      query,
      latitude,
      longitude,
      radius,
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
  const response = await instanceWithNoVersioning.get<GetRamenyaSearchAutoCompleteResponse>(`/search/autocomplete`, {
    params: {
      query,
    },
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
  const response = await instanceWithNoVersioning.get<GetSearchHistoryResponse>(`/search/recent`);

  return response.data;
};

export const removeSearchHistory = async (id: string[]) => {
  const response = await instanceWithNoVersioning.delete(`/search/recent`, {
    data: {
      keywordId: id,
    },
  });

  return response.data;
};
