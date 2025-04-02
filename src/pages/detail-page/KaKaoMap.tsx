/* eslint-disable @typescript-eslint/no-explicit-any */

import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import tw from "twin.macro";

interface KakaoMapProps {
  latitude: number | undefined;
  longitude: number | undefined;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = ({ latitude, longitude }: KakaoMapProps) => {
  const [map, setMap] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadKakaoMap = () => {
      // 이미 스크립트가 로드되어 있는지 확인
      if (document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]')) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`;

      // 스크립트 로드 전에 kakao 객체가 있는지 확인
      if (!window.kakao) {
        window.kakao = {};
      }

      script.addEventListener("load", () => {
        if (isMounted) {
          initializeMap();
        }
      });

      script.addEventListener("error", () => {
        if (isMounted) {
          console.error("지도 로딩에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      });

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      try {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          if (!container) {
            console.error("지도를 표시할 컨테이너를 찾을 수 없습니다.");
            return;
          }

          const mapInstance = new window.kakao.maps.Map(container, {
            center: new window.kakao.maps.LatLng(
              latitude || 33.450701,
              longitude || 126.570667
            ),
            level: 3,
          });

          // 좌표가 있는 경우에만 마커 생성
          if (latitude && longitude) {
            const coords = new window.kakao.maps.LatLng(latitude, longitude);
            new window.kakao.maps.Marker({
              map: mapInstance,
              position: coords,
            });
            mapInstance.setCenter(coords);
          }

          if (isMounted) {
            setMap(mapInstance);
            setIsMapLoaded(true);
          }
        });
      } catch (error) {
        console.error("지도 생성 중 오류:", error);
        if (isMounted) {
          console.error("지도 생성 중 오류가 발생했습니다.");
        }
      }
    };

    loadKakaoMap();

    return () => {
      isMounted = false;
      if (map) {
        map.setMap(null);
      }
      const script = document.querySelector(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, [latitude, longitude]);

  return (
    <Wrapper id="map" isMapLoaded={isMapLoaded}></Wrapper>
  );
};

interface WrapperProps {
  isMapLoaded: boolean;
}
const Wrapper = styled.div<WrapperProps>(({ isMapLoaded }) => [
  tw`w-full h-210 relative`,
  !isMapLoaded && tw`hidden`,
]);

export default KakaoMap;
