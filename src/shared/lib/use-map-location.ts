import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

interface UseMapLocationProps {
  mapInstance: naver.maps.Map | null;
}

type CurrentGeolocation = {
  latitude?: number;
  longitude?: number;
  level?: number;
  radius?: number;
};

export const useMapLocation = ({ mapInstance }: UseMapLocationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setSearchParamsRef = useRef(setSearchParams);
  const [currentGeolocation, setCurrentGeolocation] = useState<CurrentGeolocation>({
    latitude: undefined,
    longitude: undefined,
    level: undefined,
    radius: undefined,
  });
  const [isLocationInitialized, setIsLocationInitialized] = useState(false);

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const calculateMapCenter = useCallback((map: naver.maps.Map) => {
    const currentCenter = map.getCenter() as naver.maps.LatLng;
    const latitude = currentCenter.lat();
    const longitude = currentCenter.lng();
    const level = map.getZoom();
    const projection = map.getProjection();
    const halfDeviceWidth = Math.round(window.innerWidth / 2);
    const p1 = new naver.maps.Point(0, 0);
    const p3 = new naver.maps.Point(halfDeviceWidth, 0);
    const c1 = projection.fromOffsetToCoord(p1);
    const c3 = projection.fromOffsetToCoord(p3);
    const radius = Math.round(projection.getDistance(c1, c3));

    return { latitude, longitude, level, radius };
  }, []);

  const updateLocationData = useCallback(
    (map: naver.maps.Map) => {
      const centerInfo = calculateMapCenter(map);

      setCurrentGeolocation(centerInfo);
      setSearchParamsRef.current((prev) => {
        prev.set("latitude", centerInfo.latitude.toString());
        prev.set("longitude", centerInfo.longitude.toString());
        prev.set("level", centerInfo.level.toString());
        prev.set("radius", centerInfo.radius.toString());
        return prev;
      });

      return centerInfo;
    },
    [calculateMapCenter],
  );

  const updateLocationDataSafe = useCallback(
    (map: naver.maps.Map) => {
      return updateLocationData(map);
    },
    [updateLocationData],
  );

  const moveMapCenter = useCallback(
    (latitude: number, longitude: number, level?: number) => {
      if (!mapInstance) {
        return;
      }

      if (level && level !== mapInstance.getZoom()) {
        mapInstance.setZoom(level);
      }

      if (mapInstance.getZoom() < 15) {
        mapInstance.panTo(new naver.maps.LatLng(latitude - 0.005, longitude));
        return;
      }

      mapInstance.panTo(new naver.maps.LatLng(latitude, longitude));
    },
    [mapInstance],
  );

  useEffect(() => {
    if (!mapInstance || isLocationInitialized) {
      return;
    }

    if (searchParams.get("latitude") && searchParams.get("longitude") && searchParams.get("radius")) {
      setCurrentGeolocation({
        latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : undefined,
        longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : undefined,
        level: searchParams.get("level") ? Number(searchParams.get("level")) : undefined,
        radius: searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined,
      });
      setIsLocationInitialized(true);
      return;
    }

    updateLocationData(mapInstance);
    setIsLocationInitialized(true);
  }, [isLocationInitialized, mapInstance, searchParams, updateLocationData]);

  return {
    currentGeolocation,
    isLocationInitialized,
    updateLocationData,
    updateLocationDataSafe,
    moveMapCenter,
    calculateMapCenter,
  };
};
