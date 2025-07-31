/// <reference types="navermaps" />

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import tw from "twin.macro";
import { requestLocationPermission } from "../../util";
import { useUserLocation } from "../../hooks/common/useUserLocation";

export interface NaverMapProps<T = unknown> {
  markers?: {
    position: {
      lat: number;
      lng: number;
    };
    data: T;
    title?: string;
  }[];
  onMarkerClick?: (markerData: T) => void;
  selectedMarker?: T | null;
  onMapReady?: (map: naver.maps.Map) => void;
  onMapCenterChange?: (map: naver.maps.Map) => void;
  initialCenter?: {
    lat: number;
    lng: number;
  };
}

// 마커 아이콘 SVG를 상수로 분리
const NORMAL_MARKER_SVG = `
<svg width="38" height="45" viewBox="0 0 38 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2082_2994)">
<path d="M19 5.5C24.5287 5.5 28.988 9.73696 28.999 15.5078C28.9216 18.0186 27.5785 20.9563 25.7627 23.7744C23.965 26.5645 21.7963 29.0996 20.2539 30.7715C19.5637 31.5193 18.436 31.5202 17.7441 30.7725C16.1783 29.0799 13.9685 26.5077 12.1562 23.7041C10.32 20.8633 9 17.9468 9 15.5293C9.00001 9.74748 13.4644 5.5 19 5.5Z" fill="#FF5E00" stroke="white" stroke-width="2"/>
<ellipse cx="19" cy="15.6693" rx="3" ry="3.04622" fill="white"/>
</g>
<defs>
<filter id="filter0_d_2082_2994" x="-1" y="0" width="40" height="46" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2082_2994"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2082_2994" result="shape"/>
</filter>
</defs>
</svg>`;

const SELECTED_MARKER_SVG = `
<svg width="56" height="67" viewBox="0 0 56 67" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2082_3501)">
<path d="M28 5.25C38.372 5.25 46.7419 13.1815 46.749 23.9531C46.5918 28.9374 43.7778 34.7253 40.1855 40.0918C36.6176 45.422 32.4158 50.1436 29.7549 52.9453C28.7822 53.9692 27.2179 53.9702 26.2422 52.9453C23.5431 50.1094 19.2629 45.3141 15.665 39.9561C12.0315 34.5448 9.25 28.7835 9.25 23.9668C9.25004 13.1882 17.6236 5.25 28 5.25Z" fill="#FF5E00" stroke="white" stroke-width="2.5"/>
<mask id="path-3-inside-1_2082_3501" fill="white">
<path fill-rule="evenodd" clip-rule="evenodd" d="M32.408 33.1231C32.408 32.8108 32.591 32.5294 32.8682 32.3856C35.9958 30.7637 38.2104 27.7166 38.5391 24.5983C38.5854 24.1589 38.2233 23.7998 37.7815 23.7998H18.2177C17.7759 23.7998 17.4137 24.1589 17.4601 24.5983C17.7887 27.7162 20.0027 30.7628 23.1297 32.385C23.4068 32.5287 23.5898 32.8102 23.5898 33.1223V34.25C23.5898 34.6918 23.9479 35.05 24.3898 35.05H31.608C32.0498 35.05 32.408 34.6918 32.408 34.25V33.1231Z"/>
</mask>
<path fill-rule="evenodd" clip-rule="evenodd" d="M32.408 33.1231C32.408 32.8108 32.591 32.5294 32.8682 32.3856C35.9958 30.7637 38.2104 27.7166 38.5391 24.5983C38.5854 24.1589 38.2233 23.7998 37.7815 23.7998H18.2177C17.7759 23.7998 17.4137 24.1589 17.4601 24.5983C17.7887 27.7162 20.0027 30.7628 23.1297 32.385C23.4068 32.5287 23.5898 32.8102 23.5898 33.1223V34.25C23.5898 34.6918 23.9479 35.05 24.3898 35.05H31.608C32.0498 35.05 32.408 34.6918 32.408 34.25V33.1231Z" fill="white"/>
<path d="M23.1297 32.385L23.8204 31.0535L23.1297 32.385ZM38.5391 24.5983L40.0309 24.7555L38.5391 24.5983ZM32.8682 32.3856L32.1776 31.0541L32.8682 32.3856ZM32.8682 32.3856L33.5587 33.7172C37.0707 31.896 39.6423 28.4419 40.0309 24.7555L38.5391 24.5983L37.0474 24.441C36.7786 26.9914 34.921 29.6314 32.1776 31.0541L32.8682 32.3856ZM37.7815 23.7998V22.2998H18.2177V23.7998V25.2998H37.7815V23.7998ZM17.4601 24.5983L15.9683 24.7555C16.3568 28.4414 18.9278 31.895 22.439 33.7165L23.1297 32.385L23.8204 31.0535C21.0776 29.6306 19.2206 26.991 18.9518 24.441L17.4601 24.5983ZM23.5898 34.25H25.0898V33.1223H23.5898H22.0898V34.25H23.5898ZM31.608 35.05V33.55H24.3898V35.05V36.55H31.608V35.05ZM32.408 33.1231H30.908V34.25H32.408H33.908V33.1231H32.408ZM31.608 35.05V36.55C32.8783 36.55 33.908 35.5202 33.908 34.25H32.408H30.908C30.908 33.8634 31.2214 33.55 31.608 33.55V35.05ZM23.5898 34.25H22.0898C22.0898 35.5202 23.1195 36.55 24.3898 36.55V35.05V33.55C24.7764 33.55 25.0898 33.8634 25.0898 34.25H23.5898ZM23.1297 32.385L22.439 33.7165C22.2544 33.6207 22.0898 33.4092 22.0898 33.1223H23.5898H25.0898C25.0898 32.2111 24.5592 31.4367 23.8204 31.0535L23.1297 32.385ZM18.2177 23.7998V22.2998C16.9944 22.2998 15.8176 23.3253 15.9683 24.7555L17.4601 24.5983L18.9518 24.441C19.0099 24.9925 18.5573 25.2998 18.2177 25.2998V23.7998ZM38.5391 24.5983L40.0309 24.7555C40.1816 23.3253 39.0048 22.2998 37.7815 22.2998V23.7998V25.2998C37.4418 25.2998 36.9893 24.9925 37.0474 24.441L38.5391 24.5983ZM32.8682 32.3856L32.1776 31.0541C31.4387 31.4372 30.908 32.2117 30.908 33.1231H32.408H33.908C33.908 33.41 33.7433 33.6215 33.5587 33.7172L32.8682 32.3856Z" fill="white" mask="url(#path-3-inside-1_2082_3501)"/>
<path d="M20.5 16H37" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M20.5029 19H22.75M32.5 19H37" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M25.8994 19V25.75M29.0498 19V22" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</g>
<defs>
<filter id="filter0_d_2082_3501" x="0" y="0" width="56" height="68.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2082_3501"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2082_3501" result="shape"/>
</filter>
</defs>
</svg>`;

const USER_POSITION_MARKER = `
<div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
  <!-- 애니메이션 원들 -->
  <div style="
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(66, 133, 244, 0.3);
    animation: pulse 2s infinite;
  "></div>
  <div style="
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(66, 133, 244, 0.2);
    animation: pulse 2s infinite 0.5s;
  "></div>
  <div style="
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(66, 133, 244, 0.1);
    animation: pulse 2s infinite 1s;
  "></div>
  <!-- 메인 마커 -->
  <div style="
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4285f4;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    z-index: 1;
  "></div>
</div>
<style>
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
</style>
`;

export const NaverMap = <T = unknown,>(props: NaverMapProps<T>) => {
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { getUserPosition } = useUserLocation();

  // 마커 인스턴스들과 데이터 매핑을 위한 Map 사용
  const markersMapRef = useRef<Map<string, { instance: naver.maps.Marker; data: T }>>(new Map());

  // 위치 권한 요청과 위치 가져오기 함수들

  // 마커 아이콘 생성 함수 메모화
  const createMarkerIcon = useCallback((isSelected: boolean, title?: string) => {
    const markerSvg = isSelected ? SELECTED_MARKER_SVG : NORMAL_MARKER_SVG;

    return {
      content: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          ${markerSvg}
          ${
            title
              ? `
            <div style="
              font-size: 12px;
              font-weight: 600;
              color: #333;
              white-space: nowrap;
              margin-top: -10px;
              max-width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
            ">${title}</div>
          `
              : ""
          }
        </div>
      `,
      anchor: new naver.maps.Point(12, 12),
    };
  }, []);

  // 지도 초기화 (한번만 실행)
  useEffect(() => {
    if (isInitialized) return;

    const initMap = async () => {
      if (typeof naver === "undefined" || !naver.maps) {
        setTimeout(initMap, 100);
        return;
      }

      try {
        // 지도 중심 설정 우선순위: initialCenter > 사용자 위치 > 서울 시청
        let center: naver.maps.LatLng;
        let userPosition = null;

        if (props.initialCenter) {
          // props로 전달된 초기 중심 좌표 사용 (위치 권한 요청 안 함)
          center = new naver.maps.LatLng(props.initialCenter.lat, props.initialCenter.lng);
        } else {
          // 기존 로직: 위치 권한 요청 후 사용자 위치 또는 서울 시청
          const granted = await requestLocationPermission();

          if (granted) {
            userPosition = await getUserPosition();
          }

          center =
            userPosition && userPosition.latitude && userPosition.longitude
              ? new naver.maps.LatLng(userPosition.latitude, userPosition.longitude)
              : new naver.maps.LatLng(37.566826, 126.9786567);
        }

        const map = new naver.maps.Map("map", {
          center: center,
          zoom: 14,
        });

        // 사용자 위치 마커 추가 (initialCenter가 없고 권한 허용된 경우만)
        if (!props.initialCenter && userPosition && userPosition.latitude && userPosition.longitude) {
          new naver.maps.Marker({
            position: new naver.maps.LatLng(userPosition.latitude, userPosition.longitude),
            map: map,
            icon: {
              content: USER_POSITION_MARKER,
              anchor: new naver.maps.Point(20, 20),
            },
          });
        }

        // 지도 중심 변경 이벤트 리스너 (디바운스 적용)
        let centerChangeTimeout: NodeJS.Timeout;
        naver.maps.Event.addListener(map, "center_changed", () => {
          clearTimeout(centerChangeTimeout);
          centerChangeTimeout = setTimeout(() => {
            console.log("current location", map.getCenter());
            props.onMapCenterChange?.(map);
          }, 300);
        });

        setMapInstance(map);
        setIsInitialized(true);
        props.onMapReady?.(map);
        console.log("지도 초기화 완료");
      } catch (error) {
        console.error("지도 초기화 실패:", error);
      }
    };

    initMap();
  }, [isInitialized]);

  // initialCenter가 변경되면 지도 중심 이동 (초기화 이후에만)
  const prevInitialCenterRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (mapInstance && props.initialCenter && isInitialized) {
      const prev = prevInitialCenterRef.current;
      const current = props.initialCenter;

      // 이전 값과 다를 때만 지도 중심 이동
      if (!prev || prev.lat !== current.lat || prev.lng !== current.lng) {
        mapInstance.setCenter(new naver.maps.LatLng(props.initialCenter.lat, props.initialCenter.lng));
        prevInitialCenterRef.current = props.initialCenter;
      }
    }
  }, [mapInstance, props.initialCenter, isInitialized]);

  // 마커 목록 변경 시에만 마커 생성/삭제 (selectedMarker 제외)
  const markersKey = useMemo(() => {
    return props.markers?.map((m) => `${m.position.lat}-${m.position.lng}-${JSON.stringify(m.data)}`).join(",") || "";
  }, [props.markers]);

  useEffect(() => {
    if (!mapInstance || !props.markers) return;

    // 기존 마커들 정리
    markersMapRef.current.forEach((marker) => {
      marker.instance.setMap(null);
    });
    markersMapRef.current.clear();

    // 새로운 마커들 생성
    props.markers.forEach((marker, index) => {
      const isSelected = props.selectedMarker === marker.data;
      const markerKey = `marker-${index}`;

      const markerInstance = new naver.maps.Marker({
        map: mapInstance,
        position: new naver.maps.LatLng(marker.position.lat, marker.position.lng),
        icon: createMarkerIcon(isSelected, marker.title),
        clickable: true,
      });

      // 마커 클릭 이벤트
      naver.maps.Event.addListener(markerInstance, "click", () => {
        mapInstance.panTo(new naver.maps.LatLng(marker.position.lat, marker.position.lng));
        props.onMarkerClick?.(marker.data);
      });

      // 마커 저장
      markersMapRef.current.set(markerKey, {
        instance: markerInstance,
        data: marker.data,
      });
    });
  }, [mapInstance, markersKey, createMarkerIcon]);

  // selectedMarker 변경 시에만 마커 아이콘 업데이트 (마커를 다시 생성하지 않음)
  useEffect(() => {
    if (!mapInstance || !props.markers) return;

    props.markers.forEach((marker, index) => {
      const markerKey = `marker-${index}`;
      const markerInfo = markersMapRef.current.get(markerKey);

      if (markerInfo) {
        const isSelected = props.selectedMarker === marker.data;
        const newIcon = createMarkerIcon(isSelected, marker.title);
        markerInfo.instance.setIcon(newIcon);
      }
    });
  }, [props.selectedMarker, props.markers, createMarkerIcon]);

  return (
    <MapWrapper>
      <NaverMapComponent id="map" />
    </MapWrapper>
  );
};

const MapWrapper = tw.article`
  w-full h-full overflow-hidden
`;

const NaverMapComponent = tw.div`
  w-full h-full
`;
