/// <reference types="navermaps" />

import { ReactNode, useEffect, useState, useRef } from "react";
import { useGeolocation } from "../../hooks/common/useGeolocation";
import tw from "twin.macro";
import { IconRefresh } from "../Icon";
import { RamenroadText } from "../common/RamenroadText";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";

export interface NaverMapProps<T = unknown> {
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
  resultList?: { element: ReactNode; data: T }[];
  onCurrentIndexChange?: (index: number) => void;
}

export const NaverMap = <T = unknown,>(props: NaverMapProps<T>) => {
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  const swiperRef = useRef<SwiperCore>();
  const dataRefetchRef = useRef(false);

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

  useEffect(() => {
    if (dataRefetchRef.current && props.markers?.[0]?.position.lat && props.markers?.[0]?.position.lng) {
      dataRefetchRef.current = false;
      mapInstance?.panTo(new naver.maps.LatLng(props.markers?.[0]?.position.lat, props.markers?.[0]?.position.lng));
    }
  }, [mapInstance, props.markers]);

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

      dataRefetchRef.current = true;

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

  // 마커 인스턴스들을 저장할 배열
  const [markerInstances, setMarkerInstances] = useState<naver.maps.Marker[]>([]);

  useEffect(() => {
    if (props.markers && mapInstance) {
      // 기존 마커들 제거
      markerInstances.forEach((marker) => {
        marker.setMap(null);
      });

      // 새로운 마커들 생성
      const newMarkerInstances: naver.maps.Marker[] = [];

      props.markers.forEach((marker) => {
        // 커스텀 마커 생성 (텍스트 포함)
        const markerInstance = new naver.maps.Marker({
          map: mapInstance,
          position: new naver.maps.LatLng(marker.position.lat, marker.position.lng),
          icon: {
            content: `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
              ">
              ${
                props.selectedMarker !== marker.data
                  ? `
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
</svg>
`
                  : `<svg width="56" height="67" viewBox="0 0 56 67" fill="none" xmlns="http://www.w3.org/2000/svg">
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
</svg>
`
              }
                                  ${
                                    marker.title
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
                   ">${marker.title}</div>
                 `
                                      : ""
                                  }
              </div>
            `,
            anchor: new naver.maps.Point(12, 12),
          },
          clickable: true,
        });

        // 마커 클릭 이벤트 리스너 추가
        naver.maps.Event.addListener(markerInstance, "click", () => {
          // 해당 마커 위치로 지도 중심 이동
          mapInstance.panTo(new naver.maps.LatLng(marker.position.lat, marker.position.lng));
          props.onMarkerClick?.(marker.data);
        });

        newMarkerInstances.push(markerInstance);
      });

      // 새로운 마커 인스턴스들 저장
      setMarkerInstances(newMarkerInstances);
    }
  }, [mapInstance, props.markers]);

  useEffect(() => {
    if (!props.selectedMarker || !props.resultList) return;

    // resultList에서 selectedMarker에 해당하는 인덱스 찾기
    const idx = props.resultList.findIndex(
      (item) => item.data === props.selectedMarker, // _id 등 고유값 비교
    );

    if (idx >= 0 && swiperRef.current) {
      swiperRef.current.slideToLoop
        ? swiperRef.current.slideToLoop(idx) // loop 모드면 slideToLoop 사용
        : swiperRef.current.slideTo(idx);
    }
  }, [props.selectedMarker, props.resultList]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
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

      <ResultListContainer>
        <SwiperWrapper>
          {props.resultList && props.resultList.length > 0 && (
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              key={props.resultList[0]?.toString()}
              onSlideChangeTransitionEnd={(swiper) => {
                const currentData = props.resultList?.[swiper.realIndex]?.data;

                if (!currentData) return;
                props.onMarkerClick?.(currentData);

                if (currentData && props.markers) {
                  // id로 해당 마커 데이터 찾기
                  const marker = props.markers.find((m) => m.data === currentData);
                  if (marker && mapInstance) {
                    // 지도 중심 이동
                    console.log("panTo", marker.position.lat, marker.position.lng);
                    mapInstance.panTo(new naver.maps.LatLng(marker.position.lat, marker.position.lng));
                  }
                }
              }}
              slidesPerView={1.1}
              loop
              spaceBetween={10}
              style={{
                width: "100%",
                minHeight: "120px",
              }}
            >
              {props.resultList.map((result, index) => (
                <SwiperSlide key={index}>{result.element}</SwiperSlide>
              ))}
            </Swiper>
          )}
        </SwiperWrapper>
      </ResultListContainer>
    </div>
  );
};

const ResultListContainer = tw.div`
  absolute left-0 right-0 bottom-20 z-10
  flex justify-center w-full pointer-events-none
  pl-10
`;

const SwiperWrapper = tw.div`
  w-full max-w-md pointer-events-auto
`;

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
