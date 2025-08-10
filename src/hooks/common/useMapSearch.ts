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

  // 이전 keywordName을 추적하는 ref
  const prevKeywordNameRef = useRef<string | null>(null);

  // searchParams에서 키워드 정보 파싱
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

  // keywordName이 실제로 변경되었을 때만 searchValue 업데이트
  useEffect(() => {
    if (!searchParamsKeyword.keyword) {
      return;
    }

    if (searchParamsKeyword.keyword !== prevKeywordNameRef.current) {
      setKeyword(searchParamsKeyword.keyword);
      prevKeywordNameRef.current = searchParamsKeyword.keyword;
    }
  }, [searchParamsKeyword.keyword]);

  // 키워드로 검색하는 함수

  // 키워드 클릭 핸들러
  const handleKeywordClick = useCallback(
    (keyword: string, isNearBy?: boolean) => {
      setSearchParams((prev) => {
        prev.set("keyword", keyword);
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
