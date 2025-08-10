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

  // setSearchParams 함수를 ref로 안정화
  const setSearchParamsRef = useRef(setSearchParams);

  // ref를 최신으로 업데이트
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const [currentGeolocation, setCurrentGeolocation] = useState<CurrentGeolocation>({
    latitude: undefined,
    longitude: undefined,
    level: undefined,
    radius: undefined,
  });

  const [isLocationInitialized, setIsLocationInitialized] = useState(false);

  // 지도 중심 좌표 계산 함수
  const calculateMapCenter = useCallback((map: naver.maps.Map) => {
    const currentCenter = map.getCenter() as naver.maps.LatLng;

    const latitude = currentCenter.lat();
    const longitude = currentCenter.lng();
    const level = map.getZoom();

    const projection = map.getProjection();
    const deviceWidth = window.innerWidth;
    const halfDeviceWidth = Math.round(deviceWidth / 2);

    const p1 = new naver.maps.Point(0, 0);
    const p3 = new naver.maps.Point(halfDeviceWidth, 0);

    const c1 = projection.fromOffsetToCoord(p1);
    const c3 = projection.fromOffsetToCoord(p3);

    const distHalfHeight = projection.getDistance(c1, c3);
    const radius = Math.round(distHalfHeight);

    return {
      latitude,
      longitude,
      level,
      radius,
    };
  }, []);

  // 위치 데이터 수동 업데이트 (새로고침 버튼 등에서 사용)
  const updateLocationData = useCallback(
    (map: naver.maps.Map) => {
      console.debug("현재 위치 기준 지도 중심 좌표", map.getCenter());

      const centerInfo = calculateMapCenter(map);
      const newLocation = {
        latitude: centerInfo.latitude,
        longitude: centerInfo.longitude,
        level: centerInfo.level,
        radius: centerInfo.radius,
      };

      setCurrentGeolocation(newLocation);

      // ref를 통해 최신 setSearchParams 함수 사용
      setSearchParamsRef.current((prev) => {
        prev.set("latitude", newLocation.latitude.toString());
        prev.set("longitude", newLocation.longitude.toString());
        prev.set("level", newLocation.level.toString());
        prev.set("radius", newLocation.radius.toString());

        return prev;
      });

      return newLocation; // 새로운 위치 정보 반환
    },
    [calculateMapCenter], // setSearchParams 의존성 제거
  );

  // 이벤트 리스너에서 사용할 수 있는 안전한 함수
  const updateLocationDataSafe = useCallback(
    (map: naver.maps.Map) => {
      const centerInfo = calculateMapCenter(map);
      const newLocation = {
        latitude: centerInfo.latitude,
        longitude: centerInfo.longitude,
        level: centerInfo.level,
        radius: centerInfo.radius,
      };

      setCurrentGeolocation(newLocation);

      console.log("newLocation", newLocation);

      // ref를 통해 최신 setSearchParams 함수 사용
      setSearchParamsRef.current((prev) => {
        prev.set("latitude", newLocation.latitude.toString());
        prev.set("longitude", newLocation.longitude.toString());
        prev.set("level", newLocation.level.toString());
        prev.set("radius", newLocation.radius.toString());

        return prev;
      });

      return newLocation;
    },
    [calculateMapCenter],
  );

  // 지도 중심을 특정 위치로 이동
  const moveMapCenter = useCallback(
    (latitude: number, longitude: number, level?: number) => {
      if (mapInstance) {
        // 지도 레벨을 searchParams에 있는 레벨로 설정
        if (level && level !== mapInstance.getZoom()) {
          mapInstance.setZoom(level);
        }
        // 지도 레벨이 15 미만인 경우 바텀 시트 때문에 경도 좌표를 조금 줄여서 표시
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
    if (searchParams.get("latitude") && searchParams.get("longitude") && searchParams.get("radius")) {
      // searchParams의 위치 정보를 currentGeolocation에 설정 (NaverMap이 이미 해당 위치로 초기화됨)
      setCurrentGeolocation({
        latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : undefined,
        longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : undefined,
        level: searchParams.get("level") ? Number(searchParams.get("level")) : undefined,
        radius: searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined,
      });
      setIsLocationInitialized(true);
      return;
    }

    // 2. searchParams에 위치 정보가 없는 경우 - 현재 지도 중심 사용
    updateLocationData(mapInstance);
    setIsLocationInitialized(true);
  }, [mapInstance, isLocationInitialized, updateLocationData, searchParams]);

  return {
    currentGeolocation,
    isLocationInitialized,
    updateLocationData,
    updateLocationDataSafe, // 이벤트 리스너용 안전한 함수
    moveMapCenter,
    calculateMapCenter,
  };
};
