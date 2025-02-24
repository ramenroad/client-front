import { useEffect } from "react";
import tw from "twin.macro";

interface KakaoMapProps {
  latitude?: number;
  longitude?: number;
  onClick?: () => void;
  onZoomChanged?: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const KakaoMap = ({ latitude, longitude, onClick, onZoomChanged }: KakaoMapProps) => {
  useEffect(() => {
    const loadKakaoMap = () => {
      // 이미 스크립트가 로드되어 있는지 확인
      if (
        document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]')
      ) {
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
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          if (!container) {
            return;
          }

          try {
            const map = new window.kakao.maps.Map(container, {
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
                map: map,
                position: coords,
              });
              map.setCenter(coords);
            }

            // 이벤트 리스너 추가
            if (onClick) {
              window.kakao.maps.event.addListener(map, 'click', onClick);
            }
            if (onZoomChanged) {
              window.kakao.maps.event.addListener(map, 'zoom_changed', onZoomChanged);
            }
          } catch (error) {
            console.error("지도 생성 중 오류:", error);
          }
        });
      });
      document.head.appendChild(script);
    };

    loadKakaoMap();

    return () => {
      const script = document.querySelector(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, [latitude, longitude]);

  return <Wrapper id="map"></Wrapper>;
};

const Wrapper = tw.div`
  w-full h-210
`;

export default KakaoMap;
