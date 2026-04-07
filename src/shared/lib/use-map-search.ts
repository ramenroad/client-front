import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { updateSearchParams } from "@/shared/lib/search-params";

export type MapSearchParams = {
  keyword?: string;
  selectedId?: string;
  level?: number;
  latitude?: number;
  longitude?: number;
};

export const useMapSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(() => searchParams.get("keyword") ?? "");

  const searchParamsKeyword = useMemo<MapSearchParams>(
    () => ({
      keyword: searchParams.get("keyword") ?? undefined,
      selectedId: searchParams.get("selectedId") ?? undefined,
      level: searchParams.get("level") ? Number(searchParams.get("level")) : undefined,
      latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : undefined,
      longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : undefined,
    }),
    [searchParams],
  );

  const handleKeywordClick = useCallback(
    (nextKeyword: string, isNearBy?: boolean) => {
      setSearchParams((prev) =>
        updateSearchParams(prev, (nextParams) => {
          nextParams.set("keyword", nextKeyword);

          if (isNearBy) {
            nextParams.set("nearBy", "true");
            return;
          }

          nextParams.delete("nearBy");
        }),
      );
    },
    [setSearchParams],
  );

  return {
    keyword,
    setKeyword,
    searchParamsKeyword,
    handleKeywordClick,
  };
};
