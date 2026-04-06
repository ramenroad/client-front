import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export type MapSearchParams = {
  keyword?: string;
  selectedId?: string;
  level?: number;
  latitude?: number;
  longitude?: number;
};

export const useMapSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const prevKeywordNameRef = useRef<string | null>(null);

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

  useEffect(() => {
    if (!searchParamsKeyword.keyword) {
      return;
    }

    if (searchParamsKeyword.keyword !== prevKeywordNameRef.current) {
      setKeyword(searchParamsKeyword.keyword);
      prevKeywordNameRef.current = searchParamsKeyword.keyword;
    }
  }, [searchParamsKeyword.keyword]);

  const handleKeywordClick = useCallback(
    (nextKeyword: string, isNearBy?: boolean) => {
      setSearchParams((prev) => {
        prev.set("keyword", nextKeyword);
        if (isNearBy) {
          prev.set("nearBy", "true");
        }
        return prev;
      });
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
