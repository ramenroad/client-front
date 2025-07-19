import tw from "twin.macro";
import AppBar from "../../components/app-bar";
import { NaverMap } from "../../components/map/NaverMap";
import { useCallback, useRef, useState } from "react";
import { GetRamenyaListWithGeolocationParams } from "../../api/map";
import { useRamenyaListWithGeolocationQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";
import RamenyaCard from "../../components/ramenya-card/RamenyaCard";
import { RamenroadText } from "../../components/common/RamenroadText";
import { IconRefresh } from "../../components/Icon";

const MapPage = () => {
  const [currentGeolocation, setCurrentGeolocation] = useState<GetRamenyaListWithGeolocationParams>({
    latitude: 0,
    longitude: 0,
    radius: 0,
  });

  const { data: ramenyaList } = useRamenyaListWithGeolocationQuery(currentGeolocation);
  const [selectedMarker, setSelectedMarker] = useState<Ramenya | null>(null);
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);

  // throttling을 위한 ref
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // 지도 중심 좌표 계산 함수
  const calculateMapCenter = useCallback((map: naver.maps.Map) => {
    const currentCenter = map.getCenter() as naver.maps.LatLng;
    const zoom = map.getZoom();
    const latitude = currentCenter.lat();
    const longitude = currentCenter.lng();

    // 네이버 포럼에서 제공하는 정확한 픽셀당 거리 계산 방법
    const projection = map.getProjection();

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
  }, []);

  // 위치 데이터 업데이트 함수
  const updateLocationData = useCallback(
    (map: naver.maps.Map) => {
      const centerInfo = calculateMapCenter(map);
      setCurrentGeolocation({
        latitude: centerInfo.latitude,
        longitude: centerInfo.longitude,
        radius: centerInfo.radiusInMeters,
      });
    },
    [calculateMapCenter],
  );

  // 현재 지도 중심 좌표 가져오기 및 데이터 refetch (수동)
  const handleRefreshLocation = useCallback(() => {
    if (mapInstance) {
      updateLocationData(mapInstance);
    } else {
      console.log("지도가 아직 로드되지 않았습니다.");
    }
  }, [mapInstance, updateLocationData]);

  // 지도 중심이 변경될 때 호출되는 함수 (자동 refetch with throttling)
  const handleMapCenterChange = useCallback(
    (map: naver.maps.Map) => {
      // 기존 throttle이 있으면 취소
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }

      // 1초 후에 데이터 업데이트 (throttling)
      throttleRef.current = setTimeout(() => {
        updateLocationData(map);
      }, 1000);
    },
    [updateLocationData],
  );

  const handleMapReady = useCallback(
    (map: naver.maps.Map) => {
      setMapInstance(map);
      // 지도가 준비되면 초기 위치 데이터 가져오기
      updateLocationData(map);
    },
    [updateLocationData],
  );

  const handleMarkerClick = useCallback((markerData: Ramenya) => {
    setSelectedMarker(null);
    setSelectedMarker(markerData);
  }, []);

  return (
    <>
      <MapScreen>
        {/* 상단 현재 위치 재검색 버튼 */}
        <RefreshOverlay onRefresh={handleRefreshLocation} />

        <NaverMap<Ramenya>
          onMapReady={handleMapReady}
          onMapCenterChange={handleMapCenterChange}
          markers={ramenyaList?.ramenyas.map((ramenya) => ({
            position: {
              lat: ramenya.latitude,
              lng: ramenya.longitude,
            },
            data: ramenya,
            title: ramenya.name,
          }))}
          selectedMarker={selectedMarker}
          onMarkerClick={handleMarkerClick}
          resultList={ramenyaList?.ramenyas.map((ramenya) => ({
            id: ramenya._id,
            data: ramenya,
            element: (
              <RamenyaCard
                key={ramenya._id}
                isMapCard={true}
                _id={ramenya._id}
                name={ramenya.name}
                rating={ramenya.rating}
                latitude={ramenya.latitude}
                longitude={ramenya.longitude}
                address={ramenya.address}
                businessHours={ramenya.businessHours}
                genre={ramenya.genre}
                reviewCount={ramenya.reviewCount}
                thumbnailUrl={ramenya.thumbnailUrl}
                width={"350px"}
              />
            ),
          }))}
        />
      </MapScreen>
      <AppBar />
    </>
  );
};

interface RefreshOverlayProps {
  onRefresh: () => void;
}

const RefreshOverlay = ({ onRefresh }: RefreshOverlayProps) => {
  return (
    <RefreshButtonContainer onClick={onRefresh}>
      <RefreshButton>
        <IconRefresh />
        <RefreshButtonText size={12} weight="m">
          현재 위치 재검색
        </RefreshButtonText>
      </RefreshButton>
    </RefreshButtonContainer>
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

const MapScreen = tw.main`
  w-full h-[calc(100vh-56px)] relative
`;

export default MapPage;
