import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import { setCurrentLocation } from "@/entities/location/model";
import {
  initialFilterOptions,
  MAP_MODE,
  OpenStatus,
  OVERLAY_HEIGHTS,
  SEARCH_MODE,
  type FilterOptions,
  type MapModeType,
  type OverlayHeightType,
  type Ramenya,
  type SearchModeType,
  useRamenyaListWithGeolocationQuery,
} from "@/entities/ramenya/model";
import { checkBusinessStatus } from "@/entities/ramenya/lib";
import { useMapSearchResultsQuery } from "@/features/search/model";
import { useMapLocation } from "@/shared/lib/useMapLocation";
import { useMapSearch } from "@/shared/lib/useMapSearch";
import { updateSearchParams } from "@/shared/lib/search-params";
import { useUserLocation } from "@/shared/lib/useUserLocation";
import { useToast } from "@/shared/ui/toast";

const dvhToPx = (dvh: string) => {
  const dvhValue = parseFloat(dvh.replace("dvh", ""));
  return (dvhValue / 100) * (window.visualViewport?.height || window.innerHeight);
};

type SearchGeolocation = {
  latitude?: number;
  longitude?: number;
  radius?: number;
  level?: number;
};

export const useMapSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setSearchParamsRef = useRef(setSearchParams);
  const isMovingRef = useRef(false);
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  const [currentHeight, setCurrentHeight] = useState<OverlayHeightType>(OVERLAY_HEIGHTS.HALF);

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const mapSearchParams = useMemo(
    () => ({
      latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : undefined,
      longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : undefined,
      radius: searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined,
      level: searchParams.get("level") ? Number(searchParams.get("level")) : undefined,
    }),
    [searchParams],
  );

  const [searchGeolocation, setSearchGeolocation] = useState<SearchGeolocation>(() => ({
    latitude: mapSearchParams.latitude,
    longitude: mapSearchParams.longitude,
    radius: mapSearchParams.radius,
    level: mapSearchParams.level,
  }));

  const hasSearchGeolocation = useMemo(
    () => searchGeolocation.latitude !== undefined && searchGeolocation.longitude !== undefined,
    [searchGeolocation.latitude, searchGeolocation.longitude],
  );

  useEffect(() => {
    if (hasSearchGeolocation) {
      return;
    }

    if (mapSearchParams.latitude === undefined || mapSearchParams.longitude === undefined) {
      return;
    }

    // Keep the current map position in the URL, but only seed the actual search
    // geolocation once on initial entry. After that, refreshing should be explicit.
    setSearchGeolocation({
      latitude: mapSearchParams.latitude,
      longitude: mapSearchParams.longitude,
      radius: mapSearchParams.radius,
      level: mapSearchParams.level,
    });
  }, [
    hasSearchGeolocation,
    mapSearchParams.latitude,
    mapSearchParams.longitude,
    mapSearchParams.radius,
    mapSearchParams.level,
  ]);

  const GPSButtonHeight = useMemo(() => {
    switch (currentHeight) {
      case OVERLAY_HEIGHTS.COLLAPSED:
        return dvhToPx(OVERLAY_HEIGHTS.COLLAPSED);
      case OVERLAY_HEIGHTS.HALF:
        return dvhToPx(OVERLAY_HEIGHTS.HALF);
      case OVERLAY_HEIGHTS.EXPANDED:
        return dvhToPx(OVERLAY_HEIGHTS.EXPANDED);
    }
  }, [currentHeight]);

  const [filterOptions, setFilterOptions] = useSessionStorage<FilterOptions>(
    "mapPageFilterOptions",
    initialFilterOptions,
  );

  const { getUserPositionResult } = useUserLocation();
  const { openToast } = useToast();
  const { moveMapCenter, updateLocationData } = useMapLocation({ mapInstance });
  const { keyword, setKeyword, searchParamsKeyword, handleKeywordClick } = useMapSearch();

  const searchMode = useMemo<SearchModeType>(() => {
    return keyword.trim() === "" ? SEARCH_MODE.NEARBY : SEARCH_MODE.KEYWORD;
  }, [keyword]);

  const { ramenyaListWithGeolocationQuery } = useRamenyaListWithGeolocationQuery({
    ...searchGeolocation,
    filterOptions,
  });

  const { ramenyaListWithSearchQuery } = useMapSearchResultsQuery({
    keyword: searchParamsKeyword.keyword ?? undefined,
    ...searchGeolocation,
    filterOptions,
    nearby: searchParams.get("nearBy") === "true",
  });

  const keywordMatchedLocation = useMemo(() => {
    if (searchMode !== SEARCH_MODE.KEYWORD || !ramenyaListWithSearchQuery.data) {
      return null;
    }

    return ramenyaListWithSearchQuery.data.find((ramenya) => ramenya.name === keyword) ?? null;
  }, [keyword, ramenyaListWithSearchQuery.data, searchMode]);

  const ramenyaList = useMemo(() => {
    return searchMode === SEARCH_MODE.NEARBY ? ramenyaListWithGeolocationQuery.data : ramenyaListWithSearchQuery.data;
  }, [searchMode, ramenyaListWithGeolocationQuery.data, ramenyaListWithSearchQuery.data]);

  const mapMode = useMemo<MapModeType>(() => {
    return searchParams.get("selectedId") ? MAP_MODE.CARD : MAP_MODE.LIST;
  }, [searchParams]);

  const selectedMarker = useMemo(() => {
    if (!searchParamsKeyword.selectedId || !ramenyaList?.length) {
      return null;
    }

    return ramenyaList.find((ramenya) => ramenya._id === searchParamsKeyword.selectedId) ?? null;
  }, [ramenyaList, searchParamsKeyword.selectedId]);

  const markerData = useMemo(() => {
    return (
      ramenyaList?.map((ramenya) => ({
        position: {
          lat: ramenya.latitude,
          lng: ramenya.longitude,
        },
        data: ramenya,
        title: ramenya.name,
        inactive:
          checkBusinessStatus(ramenya.businessHours).status === OpenStatus.CLOSED ||
          checkBusinessStatus(ramenya.businessHours).status === OpenStatus.DAY_OFF,
      })) ?? []
    );
  }, [ramenyaList]);

  const handleMapReady = useCallback((map: naver.maps.Map) => {
    setMapInstance(map);
  }, []);

  const handleMapIdle = useCallback(
    (map: naver.maps.Map) => {
      updateLocationData(map);
    },
    [updateLocationData],
  );

  const handleMarkerClick = useCallback(
    (markerData: Ramenya) => {
      isMovingRef.current = true;

      setSearchParamsRef.current((prev) =>
        updateSearchParams(prev, (nextParams) => {
          if (selectedMarker?._id === markerData._id) {
            nextParams.delete("selectedId");
            return;
          }

          nextParams.set("selectedId", markerData._id);
        }),
      );

      window.setTimeout(() => {
        isMovingRef.current = false;
      }, 300);
    },
    [selectedMarker],
  );

  const handleMarkerSelect = useCallback(
    (marker: Ramenya) => {
      isMovingRef.current = true;
      moveMapCenter(marker.latitude, marker.longitude);

      setSearchParamsRef.current((prev) =>
        updateSearchParams(prev, (nextParams) => {
          nextParams.set("selectedId", marker._id);
        }),
      );

      window.setTimeout(() => {
        isMovingRef.current = false;
      }, 100);
    },
    [moveMapCenter],
  );

  const handleRefreshDataWithNewLocation = useCallback(async () => {
    if (!mapInstance) {
      return;
    }

    isMovingRef.current = true;
    const nextGeolocation = updateLocationData(mapInstance);

    if (!keyword || keyword.trim() === "") {
      setSearchParams((prev) =>
        updateSearchParams(prev, (nextParams) => {
          nextParams.set("nearBy", "true");
          nextParams.delete("selectedId");
        }),
      );
    } else {
      setSearchParams((prev) =>
        updateSearchParams(prev, (nextParams) => {
          nextParams.delete("selectedId");
        }),
      );
    }

    setSearchGeolocation(nextGeolocation);

    window.setTimeout(() => {
      isMovingRef.current = false;
    }, 300);
  }, [keyword, mapInstance, setSearchParams, updateLocationData]);

  const handleClickGPSButton = useCallback(async () => {
    const { position: currentLocation, errorCode } = await getUserPositionResult();

    if (!currentLocation) {
      if (errorCode === "permission_denied") {
        openToast("위치 권한을 허용해주세요.");
        return;
      }

      openToast("현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setCurrentLocation(currentLocation);

    const nextLevel = mapSearchParams.level ? Math.max(mapSearchParams.level, 14) : 14;

    moveMapCenter(currentLocation.latitude, currentLocation.longitude, nextLevel);
    setSearchGeolocation({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius: mapSearchParams.radius,
      level: nextLevel,
    });
  }, [getUserPositionResult, mapSearchParams.level, mapSearchParams.radius, moveMapCenter, openToast]);

  useEffect(() => {
    if (keywordMatchedLocation) {
      moveMapCenter(keywordMatchedLocation.latitude, keywordMatchedLocation.longitude);
    }
  }, [keywordMatchedLocation, moveMapCenter]);

  return {
    searchParams,
    mapMode,
    currentHeight,
    setCurrentHeight,
    filterOptions,
    setFilterOptions,
    keyword,
    setKeyword,
    ramenyaList,
    selectedMarker,
    markerData,
    isMovingRef,
    GPSButtonHeight,
    handleKeywordClick,
    handleMapReady,
    handleMapIdle,
    handleMarkerClick,
    handleMarkerSelect,
    handleRefreshDataWithNewLocation,
    handleClickGPSButton,
    shouldRenderMap: !searchParams.get("latitude") || Boolean(searchParams.get("longitude")),
    initialCenter:
      mapSearchParams.latitude && mapSearchParams.longitude
        ? {
            lat: mapSearchParams.latitude,
            lng: mapSearchParams.longitude,
          }
        : undefined,
  };
};
