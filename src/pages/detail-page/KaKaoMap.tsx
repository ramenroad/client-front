import { useEffect } from "react";
import tw from "twin.macro";

interface KakaoMapProps {
  location: string;
}

interface KakaoGeocoderResult {
  y: string;
  x: string;
}

const KakaoMap = ({ location }: KakaoMapProps) => {
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
          const realLocation = location;
          if (!container) {
            return;
          }

          try {
            const map = new window.kakao.maps.Map(container, {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667),
              level: 3,
            });
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(realLocation, (result: KakaoGeocoderResult[], status: typeof window.kakao.maps.services.Status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  result[0].y,
                  result[0].x
                );
                new window.kakao.maps.Marker({
                  map: map,
                  position: coords,
                });

                map.setCenter(coords);
              } else {
                console.error("주소 검색 실패");
              }
            });
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
  }, [location]);

  return <Wrapper id="map"></Wrapper>;
};

const Wrapper = tw.div`
  w-full h-210
`;

export default KakaoMap;
