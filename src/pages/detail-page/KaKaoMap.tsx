import React, { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const KakaoMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      console.log("카카오맵 스크립트 로드됨");

      window.kakao.maps.load(() => {
        console.log("카카오맵 로드됨");

        const container = document.getElementById("map");
        console.log("container:", container); // null인지 확인

        const options = {
          center: new window.kakao.maps.LatLng(37.5666805, 126.9784147),
          level: 3,
        };

        try {
          const map = new window.kakao.maps.Map(container, options);
          console.log("지도 생성됨:", map);

          const markerPosition = new window.kakao.maps.LatLng(
            37.5666805,
            126.9784147
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          marker.setMap(map);
        } catch (error) {
          console.error("지도 생성 중 오류:", error);
        }
      });
    });

    script.addEventListener("error", (error) => {
      console.error("스크립트 로드 실패:", error);
    });

    return () => {
      script.remove();
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
