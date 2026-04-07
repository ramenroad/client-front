import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { updateSearchParams } from "@/shared/lib/search-params";

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
  const initialGeolocation = {
    latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : undefined,
    longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : undefined,
    level: searchParams.get("level") ? Number(searchParams.get("level")) : undefined,
    radius: searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined,
  };
  const [currentGeolocation, setCurrentGeolocation] = useState<CurrentGeolocation>({
    ...initialGeolocation,
  });
  const [isLocationInitialized, setIsLocationInitialized] = useState(
    Boolean(initialGeolocation.latitude && initialGeolocation.longitude && initialGeolocation.radius),
  );

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
      setIsLocationInitialized(true);
      setSearchParamsRef.current(
        (prev) =>
          updateSearchParams(prev, (nextParams) => {
            nextParams.set("latitude", centerInfo.latitude.toString());
            nextParams.set("longitude", centerInfo.longitude.toString());
            nextParams.set("level", centerInfo.level.toString());
            nextParams.set("radius", centerInfo.radius.toString());
          }),
        { replace: true },
      );

      return centerInfo;
    },
    [calculateMapCenter],
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

  return {
    currentGeolocation,
    isLocationInitialized,
    updateLocationData,
    moveMapCenter,
    calculateMapCenter,
  };
};
