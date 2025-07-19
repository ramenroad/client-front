import tw from "twin.macro";
import AppBar from "../../components/app-bar";
import { NaverMap } from "../../components/map/NaverMap";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetRamenyaListWithGeolocationParams } from "../../api/map";
import { useRamenyaListWithGeolocationQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";
import RamenyaCard from "../../components/ramenya-card/RamenyaCard";
import { RamenroadText } from "../../components/common/RamenroadText";
import { IconRefresh } from "../../components/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import { OVERLAY_HEIGHTS, OverlayHeightType } from "../../constants";
import styled from "@emotion/styled";

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
    setSelectedMarker(markerData);
  }, []);

  // 지도 중심을 특정 위치로 이동
  const handleMoveMapCenter = useCallback(
    (latitude: number, longitude: number) => {
      if (mapInstance) {
        console.log("panTo", latitude, longitude);
        mapInstance.panTo(new naver.maps.LatLng(latitude, longitude));
      }
    },
    [mapInstance],
  );

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
        />

        {/* 하단 드래그 가능한 결과 리스트 */}
        <ResultListOverlay
          ramenyaList={ramenyaList?.ramenyas || []}
          selectedMarker={selectedMarker}
          onMarkerSelect={setSelectedMarker}
          onMoveMapCenter={handleMoveMapCenter}
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

interface ResultListOverlayProps {
  ramenyaList: Ramenya[];
  selectedMarker: Ramenya | null;
  onMarkerSelect: (marker: Ramenya) => void;
  onMoveMapCenter: (latitude: number, longitude: number) => void;
}

const ResultListOverlay = ({
  ramenyaList,
  selectedMarker,
  onMarkerSelect,
  onMoveMapCenter,
}: ResultListOverlayProps) => {
  const [currentHeight, setCurrentHeight] = useState<OverlayHeightType>(OVERLAY_HEIGHTS.COLLAPSED);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore>();

  // 드래그 시작
  const handleDragStart = useCallback(
    (clientY: number) => {
      setIsDragging(true);
      setStartY(clientY);
      setStartHeight(currentHeight);
    },
    [currentHeight],
  );

  // 드래그 중
  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return;

      const deltaY = startY - clientY; // 위로 드래그하면 양수
      const newHeight = Math.max(OVERLAY_HEIGHTS.COLLAPSED, Math.min(OVERLAY_HEIGHTS.EXPANDED, startHeight + deltaY));

      // 실시간으로 높이 업데이트 (부드러운 드래그를 위해)
      if (overlayRef.current) {
        overlayRef.current.style.height = `${newHeight}px`;
      }
    },
    [isDragging, startY, startHeight],
  );

  // 드래그 종료 - 가장 가까운 단계로 스냅
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    if (!overlayRef.current) return;

    const currentHeightValue = parseFloat(overlayRef.current.style.height) || currentHeight;

    // 가장 가까운 높이 단계 찾기
    const heights = Object.values(OVERLAY_HEIGHTS);
    const closestHeight = heights.reduce((prev, curr) =>
      Math.abs(curr - currentHeightValue) < Math.abs(prev - currentHeightValue) ? curr : prev,
    ) as OverlayHeightType;

    setCurrentHeight(closestHeight);
  }, [isDragging, currentHeight]);

  // 마우스 이벤트
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientY);
    },
    [handleDragStart],
  );

  // 터치 이벤트
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handleDragStart(e.touches[0].clientY);
    },
    [handleDragStart],
  );

  // 전역 이벤트 리스너
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientY);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Swiper 슬라이드 변경 시 지도 중심 이동
  const handleSwiperSlideChange = useCallback(
    (swiper: SwiperCore) => {
      const currentData = ramenyaList[swiper.realIndex];

      if (!currentData) return;

      // 선택된 마커 업데이트
      onMarkerSelect(currentData);

      // 지도 중심을 해당 마커로 이동
      onMoveMapCenter(currentData.latitude, currentData.longitude);
    },
    [ramenyaList, onMarkerSelect, onMoveMapCenter],
  );

  // 선택된 마커가 변경될 때마다 Swiper 동기화
  useEffect(() => {
    if (!selectedMarker || !ramenyaList.length || !swiperRef.current) return;

    const idx = ramenyaList.findIndex((ramenya) => ramenya._id === selectedMarker._id);

    if (idx >= 0) {
      if (swiperRef.current.slideToLoop) {
        swiperRef.current.slideToLoop(idx);
      } else {
        swiperRef.current.slideTo(idx);
      }
    }
  }, [selectedMarker, ramenyaList]);

  if (!ramenyaList.length) return null;

  return (
    <OverlayContainer ref={overlayRef} height={currentHeight} isDragging={isDragging}>
      {/* 드래그 핸들 */}
      <DragHandle onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
        <DragIndicator />
      </DragHandle>

      {/* 콘텐츠 영역 */}
      <ContentArea>
        <SwiperWrapper>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            key={ramenyaList[0]?._id}
            onSlideChangeTransitionEnd={handleSwiperSlideChange}
            slidesPerView={1.1}
            loop
            spaceBetween={10}
            style={{
              width: "100%",
              minHeight: "120px",
            }}
          >
            {ramenyaList.map((ramenya, index) => (
              <SwiperSlide key={index}>
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
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperWrapper>
      </ContentArea>
    </OverlayContainer>
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

const OverlayContainer = styled.div<{ height: OverlayHeightType; isDragging: boolean }>(({ height, isDragging }) => [
  tw`absolute bottom-0 left-0 right-0 z-20
       bg-white rounded-t-16
       shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
       overflow-hidden`,
  {
    height: `${height}px`,
    transition: isDragging ? "none" : "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
]);

const DragHandle = tw.div`
  w-full h-20 flex items-center justify-center
  cursor-grab active:cursor-grabbing
  touch-none select-none
`;

const DragIndicator = tw.div`
  w-36 h-4 bg-gray-300 rounded-full
`;

const ContentArea = tw.div`
  flex-1 px-10 pb-20
  overflow-hidden
`;

const SwiperWrapper = tw.div`
  w-full max-w-md mx-auto
`;

export default MapPage;
