import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Ramenya } from "../../types";
import { GetRamenyaListWithGeolocationParams, getRamenyaListWithSearch } from "../../api/map";
import { queryClient } from "../../core/queryClient";
import { queryKeys } from "../queries/queryKeys";

interface UseMapSearchProps {
  currentGeolocation: GetRamenyaListWithGeolocationParams;
  isLocationInitialized: boolean;
  moveMapCenter: (latitude: number, longitude: number) => void;
}

export const useMapSearch = ({ currentGeolocation, isLocationInitialized, moveMapCenter }: UseMapSearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ramenyaList, setRamenyaList] = useState<Ramenya[]>([]);
  const [searchValue, setSearchValue] = useState("");

  // 이전 keywordName을 추적하는 ref
  const prevKeywordNameRef = useRef<string | null>(null);

  // searchParams에서 키워드 정보 파싱
  const searchParamsKeyword = useMemo(
    () => ({
      keywordName: searchParams.get("keywordName") ?? null,
      keywordId: searchParams.get("keywordId") ?? null,
      selectedMarkerId: searchParams.get("selectedMarkerId") ?? null,
    }),
    [searchParams],
  );

  // keywordName이 실제로 변경되었을 때만 searchValue 업데이트
  useEffect(() => {
    if (searchParamsKeyword.keywordName !== prevKeywordNameRef.current) {
      if (searchParamsKeyword.keywordName) {
        setSearchValue(searchParamsKeyword.keywordName);
      } else {
        setSearchValue("");
      }
      prevKeywordNameRef.current = searchParamsKeyword.keywordName;
    }
  }, [searchParamsKeyword.keywordName]);

  // searchValue 변경 시 자동 검색 실행
  useEffect(() => {
    if (!isLocationInitialized) {
      return;
    }

    // URL 파라미터 기반 검색이 실행 중이면 스킵
    if (searchParamsKeyword.keywordName) {
      return;
    }

    // searchValue가 비어있으면 위치 기반 검색으로 전환
    if (!searchValue || searchValue.trim() === "") {
      // ramenyaList를 비워서 상위 컴포넌트의 위치 기반 쿼리가 표시되도록 함
      setRamenyaList([]);
      return;
    }

    // searchValue가 있으면 검색 실행
    const executeSearch = async () => {
      try {
        const searchResults = await getRamenyaListWithSearch({
          query: searchValue,
          ...currentGeolocation,
          inLocation: true,
        });
        if (searchResults) {
          setRamenyaList(searchResults);
        }
      } catch (error) {
        console.error("자동 검색 실패:", error);
        setRamenyaList([]);
      }
    };

    executeSearch();
  }, [searchValue, isLocationInitialized, searchParamsKeyword.keywordName, currentGeolocation, setRamenyaList]);

  // 키워드로 검색하는 함수
  const searchWithKeyword = useCallback(
    async (
      keyword: { id?: string; name: string; type: "keyword" | "ramenya" },
      geolocation?: GetRamenyaListWithGeolocationParams,
    ) => {
      try {
        let results: Ramenya[] = [];
        const searchGeolocation = geolocation || currentGeolocation;

        if (keyword.type === "keyword") {
          results = await getRamenyaListWithSearch({ query: keyword.name, ...searchGeolocation });
        } else {
          results = await getRamenyaListWithSearch({ query: keyword.name });
        }

        queryClient.invalidateQueries({ ...queryKeys.search.history });

        if (results?.length > 0) {
          moveMapCenter(results[0].latitude, results[0].longitude);
          setRamenyaList(results);
        } else {
          setRamenyaList([]);
        }
      } catch (error) {
        console.error("키워드 검색 실패:", error);
        setRamenyaList([]);
      }
    },
    [currentGeolocation, moveMapCenter],
  );

  // 키워드 클릭 핸들러
  const handleKeywordClick = useCallback(
    (keyword: { id: string; name: string; type: "keyword" | "ramenya" }) => {
      setSearchParams((prev) => {
        prev.set("keywordName", keyword.name);
        prev.set("keywordId", keyword.id);
        prev.set("latitude", currentGeolocation.latitude.toString());
        prev.set("longitude", currentGeolocation.longitude.toString());
        prev.set("radius", currentGeolocation.radius.toString());
        return prev;
      });
    },
    [currentGeolocation, setSearchParams],
  );

  // 현재 위치로 새로고침 (현재 지도 위치를 URL에 업데이트)
  const refreshCurrentLocation = useCallback(
    async (newLocation?: GetRamenyaListWithGeolocationParams, currentSearchValue?: string) => {
      // 새로운 위치 정보가 전달되면 사용, 없으면 현재 상태 사용
      const locationToUse = newLocation || currentGeolocation;
      // 현재 검색값 사용 (전달된 값이 있으면 사용, 없으면 현재 상태 사용)
      const searchValueToUse = currentSearchValue !== undefined ? currentSearchValue : searchValue;

      // 현재 지도 위치를 URL에 업데이트
      setSearchParams((prev) => {
        prev.delete("selectedMarkerId");
        prev.set("latitude", locationToUse.latitude.toString());
        prev.set("longitude", locationToUse.longitude.toString());
        prev.set("radius", locationToUse.radius.toString());

        // searchValueToUse가 빈 문자열이면 keywordName 삭제
        if (searchValueToUse === "" || !searchValueToUse) {
          prev.delete("keywordName");
          prev.delete("keywordId");
        } else {
          // 기존 키워드 정보는 유지
          const currentKeywordName = prev.get("keywordName");
          const currentKeywordId = prev.get("keywordId");

          if (currentKeywordName) {
            prev.set("keywordName", currentKeywordName);
          } else {
            prev.delete("keywordName");
          }

          if (currentKeywordId) {
            prev.set("keywordId", currentKeywordId);
          } else {
            prev.delete("keywordId");
          }
        }

        return prev;
      });

      if (searchValueToUse === "" || !searchValueToUse) {
        // 위치 기반 검색은 상위 컴포넌트에서 처리
        return { type: "location" as const };
      }

      // 검색어가 있는 경우
      try {
        const searchResults = await getRamenyaListWithSearch({
          query: searchValueToUse,
          ...locationToUse,
          inLocation: true,
        });
        if (searchResults) {
          setRamenyaList(searchResults);
        }
        return { type: "search" as const, results: searchResults };
      } catch (error) {
        console.error("검색 실패:", error);
        return { type: "error" as const };
      }
    },
    [currentGeolocation, searchValue, searchParamsKeyword, setSearchParams, setRamenyaList],
  );

  // 키워드 검색 처리 로직
  useEffect(() => {
    if (!isLocationInitialized) {
      return;
    }

    // 키워드가 없으면 위치 기반 검색 (상위에서 처리)
    if (!searchParamsKeyword.keywordName) {
      return;
    }

    // 키워드가 있으면 키워드 검색
    if (!searchParamsKeyword.keywordId) {
      // 키워드만 있는 경우 (위치 기반 키워드 검색)
      searchWithKeyword({ name: searchParamsKeyword.keywordName, type: "keyword" });
      return;
    }

    // 키워드 ID가 있는 경우 (특정 매장 검색)
    searchWithKeyword(
      { id: searchParamsKeyword.keywordId, name: searchParamsKeyword.keywordName, type: "ramenya" },
      currentGeolocation,
    );
  }, [
    isLocationInitialized,
    searchParamsKeyword.keywordId,
    searchParamsKeyword.keywordName,
    currentGeolocation,
    searchWithKeyword,
  ]);

  return {
    ramenyaList,
    setRamenyaList,
    searchValue,
    setSearchValue,
    searchParamsKeyword,
    searchWithKeyword,
    handleKeywordClick,
    refreshCurrentLocation,
  };
};
