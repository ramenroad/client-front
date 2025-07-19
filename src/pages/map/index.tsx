import React, { useState, useCallback, useRef, useEffect } from "react";
import tw from "twin.macro";
import AppBar from "../../components/app-bar";
import { NaverMap } from "../../components/map/NaverMap";
import { GetRamenyaListWithGeolocationParams } from "../../api/map";
import { useRamenyaListWithGeolocationQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";
import RamenyaCard from "../../components/ramenya-card/RamenyaCard";
import { RamenroadText } from "../../components/common/RamenroadText";
import { IconRefresh } from "../../components/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import { initialFilterOptions, OVERLAY_HEIGHTS, OverlayHeightType } from "../../constants";
import { useDrag } from "@use-gesture/react";
import FilterSection from "../../components/filter/FilterSection";
import { useSessionStorage } from "usehooks-ts";
import { FilterOptions } from "../../types/filter";

const MapPage = () => {
  const [currentGeolocation, setCurrentGeolocation] = useState<GetRamenyaListWithGeolocationParams>({
    latitude: 0,
    longitude: 0,
    radius: 0,
  });

  const [filterOptions, setFilterOptions] = useSessionStorage<FilterOptions>(
    "mapPageFilterOptions",
    initialFilterOptions,
  );

  const { data: ramenyaList } = useRamenyaListWithGeolocationQuery({
    ...currentGeolocation,
    filterOptions: filterOptions,
  });
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
          markers={ramenyaList?.map((ramenya) => ({
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

        {/* 카드 오버레이 (기존 기능) */}
        {/* <ResultCardOverlay
          ramenyaList={ramenyaList?.ramenyas || []}
          selectedMarker={selectedMarker}
          onMarkerSelect={setSelectedMarker}
          onMoveMapCenter={handleMoveMapCenter}
        /> */}

        {/* 리스트 오버레이 (드래그 가능한 새로운 컴포넌트) */}
        <ResultListOverlay
          ramenyaList={ramenyaList || []}
          selectedMarker={selectedMarker}
          onMarkerSelect={setSelectedMarker}
          onMoveMapCenter={handleMoveMapCenter}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
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

interface ResultOverlayProps {
  ramenyaList: Ramenya[];
  selectedMarker: Ramenya | null;
  onMarkerSelect: (marker: Ramenya) => void;
  onMoveMapCenter: (latitude: number, longitude: number) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (filterOptions: FilterOptions) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResultCardOverlay = ({ ramenyaList, selectedMarker, onMarkerSelect, onMoveMapCenter }: ResultOverlayProps) => {
  const swiperRef = useRef<SwiperCore>();

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
    <ResultCardContainer>
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
    </ResultCardContainer>
  );
};

const ResultListOverlay = ({ ramenyaList, filterOptions, setFilterOptions }: ResultOverlayProps) => {
  const [currentHeight, setCurrentHeight] = useState<OverlayHeightType>(OVERLAY_HEIGHTS.COLLAPSED);
  const [isDragging, setIsDragging] = useState(false);
  const [tempHeight, setTempHeight] = useState<number>(OVERLAY_HEIGHTS.COLLAPSED);

  const overlayRef = useRef<HTMLDivElement>(null);

  // 드래그 중 실시간 높이 변화를 위해 tempHeight 사용

  // 드래그 제스처 설정
  const bind = useDrag(
    ({ movement: [, my], canceled, last, memo = currentHeight }) => {
      if (canceled) return;

      setIsDragging(true);

      // 드래그 방향에 따른 높이 계산 (위로 드래그하면 양수)
      const deltaY = -my; // 위로 드래그하면 높이 증가
      let newHeight = memo + deltaY;

      // 엄격한 높이 제한 적용
      newHeight = Math.max(OVERLAY_HEIGHTS.COLLAPSED, Math.min(OVERLAY_HEIGHTS.EXPANDED, newHeight));

      setTempHeight(newHeight);

      // 드래그 종료 시 스냅
      if (last) {
        setIsDragging(false);

        // 3단계 높이 중 가장 가까운 것 찾기
        const heights = [OVERLAY_HEIGHTS.COLLAPSED, OVERLAY_HEIGHTS.HALF, OVERLAY_HEIGHTS.EXPANDED];
        const closestHeight = heights.reduce((prev, curr) =>
          Math.abs(curr - newHeight) < Math.abs(prev - newHeight) ? curr : prev,
        ) as OverlayHeightType;

        setCurrentHeight(closestHeight);
        setTempHeight(closestHeight);
      }
    },
    {
      axis: "y",
      filterTaps: true,
      preventDefault: true,
      // 실시간 반응을 위한 설정
      from: () => [0, currentHeight],
    },
  );

  return (
    <ResultListOverlayContainer
      ref={overlayRef}
      className="absolute bottom-0 left-0 right-0 z-100 bg-white rounded-t-16 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] overflow-hidden"
      style={{
        height: isDragging ? `${tempHeight}px` : `${currentHeight}px`,
        transition: isDragging ? "none" : "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* 드래그 핸들 */}
      <DragHandle {...bind()}>
        <DragIndicator />
      </DragHandle>

      <FilterSection
        sessionStorageKey="mapPageFilterOptions"
        filterOptions={filterOptions}
        onFilterChange={setFilterOptions}
      />

      {/* 콘텐츠 영역 */}
      <ListContentArea
        style={{
          height: isDragging ? `${tempHeight - 10}px` : `${currentHeight - 10}px`,
          overflowY: "auto",
        }}
      >
        {ramenyaList?.map((ramenya) => <RamenyaCard key={ramenya._id} {...ramenya} />)}
      </ListContentArea>
    </ResultListOverlayContainer>
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

// ResultCardOverlay 스타일
const ResultCardContainer = tw.div`
  absolute left-0 right-0 bottom-20 z-10
  flex justify-center w-full pointer-events-none
  pl-10
`;

const SwiperWrapper = tw.div`
  w-full max-w-md pointer-events-auto
`;

// ResultListOverlay는 인라인 스타일로 구현

const DragHandle = tw.div`
  w-full h-20 flex items-center justify-center
  cursor-grab active:cursor-grabbing
  touch-none select-none
  touch-none
`;

const DragIndicator = tw.div`
  w-36 h-4 bg-gray-300 rounded-full
`;

const ListContentArea = tw.div`
  flex-1
`;

const ResultListOverlayContainer = tw.div`
  absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-16 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] overflow-hidden
`;

export default MapPage;
