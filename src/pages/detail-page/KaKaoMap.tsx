import React, { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const KakaoMap = () => {
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
        console.log("카카오맵 스크립트 로드됨");

        // kakao.maps.load 함수를 사용하여 지도 API를 초기화
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const realLocation = "서울특별시 마포구 동교로34길 21";

          if (!container) {
            console.error("지도를 표시할 div를 찾을 수 없습니다.");
            return;
          }

          try {
            // 임시 중심 좌표로 지도 생성
            const map = new window.kakao.maps.Map(container, {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667),
              level: 3,
            });

            // 주소 검색
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(realLocation, (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  result[0].y,
                  result[0].x
                );

                // 마커 생성
                const marker = new window.kakao.maps.Marker({
                  map: map,
                  position: coords,
                });

                // 지도 중심 이동
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

      script.addEventListener("error", (error) => {
        console.error("스크립트 로드 실패:", error);
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
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "400px",
      }}
    ></div>
  );
};

export default KakaoMap;
