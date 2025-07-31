import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { GetRamenyaListWithGeolocationParams } from "../../api/map";

interface UseMapLocationProps {
  mapInstance: naver.maps.Map | null;
}

export const useMapLocation = ({ mapInstance }: UseMapLocationProps) => {
  const [searchParams] = useSearchParams();

  const [currentGeolocation, setCurrentGeolocation] = useState<GetRamenyaListWithGeolocationParams>({
    latitude: 0,
    longitude: 0,
    radius: 0,
  });

  const [isLocationInitialized, setIsLocationInitialized] = useState(false);

  // searchParams에서 위치 정보 파싱
  const searchParamsLocation = {
    latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : null,
    longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : null,
    radius: searchParams.get("radius") ? Number(searchParams.get("radius")) : null,
  };

  // 지도 중심 좌표 계산 함수
  const calculateMapCenter = useCallback((map: naver.maps.Map) => {
    const currentCenter = map.getCenter() as naver.maps.LatLng;
    const latitude = currentCenter.lat();
    const longitude = currentCenter.lng();

    const projection = map.getProjection();
    const deviceHeight = window.innerHeight;
    const halfDeviceHeight = Math.round(deviceHeight / 2);

    const p1 = new naver.maps.Point(0, 0);
    const p3 = new naver.maps.Point(halfDeviceHeight, 0);

    const c1 = projection.fromOffsetToCoord(p1);
    const c3 = projection.fromOffsetToCoord(p3);

    const distHalfHeight = projection.getDistance(c1, c3);
    const radiusInMeters = Math.round(distHalfHeight);

    return {
      latitude,
      longitude,
      radiusInMeters,
    };
  }, []);

  // 위치 데이터 수동 업데이트 (새로고침 버튼 등에서 사용)
  const updateLocationData = useCallback(
    (map: naver.maps.Map) => {
      const centerInfo = calculateMapCenter(map);
      const newLocation = {
        latitude: centerInfo.latitude,
        longitude: centerInfo.longitude,
        radius: centerInfo.radiusInMeters,
      };
      setCurrentGeolocation(newLocation);
      return newLocation; // 새로운 위치 정보 반환
    },
    [calculateMapCenter],
  );

  // 지도 중심을 특정 위치로 이동
  const moveMapCenter = useCallback(
    (latitude: number, longitude: number) => {
      if (mapInstance) {
        if (mapInstance.getZoom() < 15) {
          mapInstance.panTo(new naver.maps.LatLng(latitude - 0.005, longitude));
        } else {
          mapInstance.panTo(new naver.maps.LatLng(latitude, longitude));
        }
      }
    },
    [mapInstance],
  );

  // 위치 초기화 로직 (한 번만 실행)
  useEffect(() => {
    if (!mapInstance || isLocationInitialized) {
      return;
    }

    // 1. searchParams에 위치 정보가 있는 경우
    if (searchParamsLocation.latitude && searchParamsLocation.longitude && searchParamsLocation.radius) {
      // searchParams의 위치 정보를 currentGeolocation에 설정 (NaverMap이 이미 해당 위치로 초기화됨)
      setCurrentGeolocation({
        latitude: searchParamsLocation.latitude,
        longitude: searchParamsLocation.longitude,
        radius: searchParamsLocation.radius,
      });
      setIsLocationInitialized(true);
      return;
    }

    // 2. searchParams에 위치 정보가 없는 경우 - 현재 지도 중심 사용
    updateLocationData(mapInstance);
    setIsLocationInitialized(true);
  }, [
    mapInstance,
    isLocationInitialized,
    searchParamsLocation.latitude,
    searchParamsLocation.longitude,
    searchParamsLocation.radius,
    updateLocationData,
  ]);

  return {
    currentGeolocation,
    isLocationInitialized,
    searchParamsLocation,
    updateLocationData,
    moveMapCenter,
  };
};
