/// <reference types="navermaps" />

import { useEffect, useState } from "react";
import { useGeolocation } from "../../hooks/common/useGeolocation";
import tw from "twin.macro";
import { IconRefresh } from "../Icon";
import { RamenroadText } from "../common/RamenroadText";

export interface NaverMapProps {
  onRefresh?: ({
    latitude,
    longitude,
    radius,
    zoom,
  }: {
    latitude: number;
    longitude: number;
    radius: number;
    zoom: number;
  }) => void;
}

export const NaverMap = (props: NaverMapProps) => {
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  // 첫 렌더링 때 위치 가져오기
  const { latitude, longitude } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 600000,
    autoFetch: true, // 첫 렌더링 때 자동으로 위치 가져오기
  });

  useEffect(() => {
    const initMap = () => {
      if (typeof naver !== "undefined" && naver.maps) {
        console.log("네이버 지도 API 로드 완료:", naver);
        try {
          // 사용자 위치가 있으면 해당 위치로, 없으면 서울 시청으로 기본 설정
          const center =
            latitude && longitude
              ? new naver.maps.LatLng(latitude, longitude)
              : new naver.maps.LatLng(37.566826, 126.9786567);

          const map = new naver.maps.Map("map", {
            center: center,
            zoom: 15,
          });

          // 사용자 위치에 마커 추가
          if (latitude && longitude) {
            const marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(latitude, longitude),
              map: map,
              title: "현재 위치",
              icon: {
                content:
                  '<div style="background: #4285f4; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                anchor: new naver.maps.Point(6, 6),
              },
            });

            console.log("사용자 위치 마커 생성:", marker);
          }

          setMapInstance(map);
          console.log("지도 생성 완료:", map);
        } catch (error) {
          console.error("지도 생성 실패:", error);
        }
      } else {
        console.log("네이버 지도 API 로드 대기 중...");
        // 100ms 후 재시도
        setTimeout(initMap, 100);
      }
    };

    // 초기 로드 시도
    initMap();
  }, [latitude, longitude]);

  // 위치가 업데이트되면 지도 중심점 변경
  useEffect(() => {
    if (mapInstance && latitude && longitude) {
      const newCenter = new naver.maps.LatLng(latitude, longitude);
      mapInstance.setCenter(newCenter);
    }
  }, [mapInstance, latitude, longitude]);

  // 현재 지도 중심 좌표 가져오기
  const getCurrentMapCenter = () => {
    if (mapInstance) {
      const currentCenter = mapInstance.getCenter() as naver.maps.LatLng;
      const zoom = mapInstance.getZoom();
      const latitude = currentCenter.lat();
      const longitude = currentCenter.lng();

      // 네이버 포럼에서 제공하는 정확한 픽셀당 거리 계산 방법
      const projection = mapInstance.getProjection();

      // 현재 디바이스의 세로 길이 픽셀 가져오기
      const deviceHeight = window.innerHeight;
      const halfDeviceHeight = Math.round(deviceHeight / 2);

      // 중심점에서 1px, 디바이스 세로 길이의 절반만큼 떨어진 지점의 실제 거리 계산
      const p1 = new naver.maps.Point(0, 0);
      const p2 = new naver.maps.Point(1, 0); // 1px
      const p3 = new naver.maps.Point(halfDeviceHeight, 0); // 디바이스 세로 길이의 절반

      const c1 = projection.fromOffsetToCoord(p1);
      const c2 = projection.fromOffsetToCoord(p2);
      const c3 = projection.fromOffsetToCoord(p3);

      const dist1px = projection.getDistance(c1, c2);
      const distHalfHeight = projection.getDistance(c1, c3);

      // 화면 중심에서 가장자리까지의 거리 (반경)
      const radiusInMeters = Math.round(distHalfHeight);

      const centerInfo = {
        latitude,
        longitude,
        zoom,
        deviceHeight,
        halfDeviceHeight,
        dist1px: dist1px.toFixed(4),
        distHalfHeight: Math.round(distHalfHeight),
        radiusInMeters,
      };

      props.onRefresh?.({
        latitude: centerInfo.latitude,
        longitude: centerInfo.longitude,
        radius: centerInfo.radiusInMeters,
        zoom: centerInfo.zoom,
      });

      console.log("현재 지도 중심 좌표:", centerInfo);
      console.log(`줌 레벨 ${zoom}`);
      console.log(`- 디바이스 세로 길이: ${deviceHeight}px`);
      console.log(`- 계산 기준 (세로 절반): ${halfDeviceHeight}px`);
      console.log(`- 1px당 거리: ${dist1px.toFixed(4)}m`);
      console.log(`- ${halfDeviceHeight}px 거리: ${Math.round(distHalfHeight)}m`);
      console.log(
        `- 화면 반경: ${radiusInMeters >= 1000 ? (radiusInMeters / 1000).toFixed(1) + "km" : radiusInMeters + "m"}`,
      );

      return centerInfo;
    } else {
      console.log("지도가 아직 로드되지 않았습니다.");
      return null;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>

      {/* 상단 현재 위치 재검색 버튼 */}

      <RefreshButtonContainer onClick={getCurrentMapCenter}>
        <RefreshButton>
          <IconRefresh />
          <RefreshButtonText size={12} weight="m">
            현재 위치 재검색
          </RefreshButtonText>
        </RefreshButton>
      </RefreshButtonContainer>
    </div>
  );
};

const RefreshButtonContainer = tw.div`
  absolute top-20 z-10 absolute-center-x
`;

const RefreshButton = tw.button`
  w-125 h-34 px-15 py-8
  flex gap-4 items-center
  bg-white border-none rounded-50
  shadow-none
  outline-none
  cursor-pointer
  z-10
`;

const RefreshButtonText = tw(RamenroadText)`
  text-gray-700
  whitespace-nowrap
`;
