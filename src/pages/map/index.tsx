import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import tw from "twin.macro";
import { NaverMap } from "../../components/map/NaverMap";
import { useRamenyaListWithGeolocationQuery } from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";
import RamenyaCard from "../../components/ramenya-card/RamenyaCard";
import { RamenroadText } from "../../components/common/RamenroadText";
import { IconRefresh } from "../../components/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import { initialFilterOptions, MAP_MODE, MapModeType, OVERLAY_HEIGHTS, OverlayHeightType } from "../../constants";
import { useDrag } from "@use-gesture/react";
import FilterSection from "../../components/filter/FilterSection";
import { useSessionStorage } from "usehooks-ts";
import { FilterOptions } from "../../types/filter";
import { Line } from "../../components/common/Line";
import NoStoreBox from "../../components/no-data/NoStoreBox";
import { useMapLocation } from "../../hooks/common/useMapLocation";
import { useMapSearch } from "../../hooks/common/useMapSearch";
import { SearchOverlay } from "../../components/map/SearchOverlay";
import { useSearchParams } from "react-router-dom";

const MapPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Ramenya | null>(null);

  const [filterOptions, setFilterOptions] = useSessionStorage<FilterOptions>(
    "mapPageFilterOptions",
    initialFilterOptions,
  );

  // 위치 관리 커스텀 훅
  const { currentGeolocation, isLocationInitialized, searchParamsLocation, updateLocationData, moveMapCenter } =
    useMapLocation({
      mapInstance,
    });

  // 검색 관리 커스텀 훅
  const {
    ramenyaList,
    setRamenyaList,
    searchValue,
    setSearchValue,
    searchParamsKeyword,
    handleKeywordClick,
    refreshCurrentLocation,
  } = useMapSearch({
    currentGeolocation,
    isLocationInitialized,
    moveMapCenter,
  });

  // 위치 기반 라면야 목록 쿼리
  const { ramenyaListWithGeolocationQuery } = useRamenyaListWithGeolocationQuery({
    ...currentGeolocation,
    filterOptions: filterOptions,
  });

  // 지도 모드 계산
  const mapMode = useMemo<MapModeType>(() => {
    if (selectedMarker) return MAP_MODE.CARD;
    return MAP_MODE.LIST;
  }, [selectedMarker]);

  // 지도 준비 완료 핸들러
  const handleMapReady = useCallback((map: naver.maps.Map) => {
    setMapInstance(map);
  }, []);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (markerData: Ramenya) => {
      setSelectedMarker((prevSelected) => {
        if (prevSelected?._id === markerData._id) {
          return null;
        } else {
          mapInstance?.setZoom(15);
          setSearchParams((prev) => {
            prev.set("selectedMarkerId", markerData._id);
            return prev;
          });
          return markerData;
        }
      });
    },
    [mapInstance, setSearchParams],
  );

  // 새로고침 핸들러
  const handleRefreshLocation = useCallback(async () => {
    if (!mapInstance) return;

    setSearchParams((prev) => {
      const newSearchParams = new URLSearchParams(prev);

      if (searchValue === "" || searchValue.trim() === "") {
        newSearchParams.delete("keywordName");
      } else {
        newSearchParams.set("keywordName", searchValue);
      }

      return newSearchParams;
    });

    // 현재 지도 중심 좌표를 가져와서 상태와 URL 모두 업데이트
    const newLocation = updateLocationData(mapInstance);
    setSelectedMarker(null);

    const refreshResult = await refreshCurrentLocation(newLocation, searchValue);

    if (refreshResult.type === "location") {
      // 위치 기반 검색은 useEffect에서 처리됨
      ramenyaListWithGeolocationQuery.refetch();
    }
  }, [mapInstance, updateLocationData, refreshCurrentLocation, ramenyaListWithGeolocationQuery]);

  // 위치 기반 쿼리 결과 처리
  useEffect(() => {
    if (
      isLocationInitialized &&
      !ramenyaListWithGeolocationQuery.isLoading &&
      ramenyaListWithGeolocationQuery.data &&
      searchValue === "" &&
      !searchParamsKeyword.keywordName
    ) {
      setRamenyaList(ramenyaListWithGeolocationQuery.data || []);
    }
  }, [
    ramenyaListWithGeolocationQuery.data,
    ramenyaListWithGeolocationQuery.isLoading,
    isLocationInitialized,
    searchValue,
    searchParamsKeyword.keywordName,
    setRamenyaList,
  ]);

  // 선택된 마커 처리
  useEffect(() => {
    if (searchParamsKeyword.selectedMarkerId && ramenyaList.length > 0) {
      const selectedMarker = ramenyaList.find((ramenya) => ramenya._id === searchParamsKeyword.selectedMarkerId);
      if (selectedMarker) {
        setSelectedMarker(selectedMarker);
      }
    }
  }, [searchParamsKeyword.selectedMarkerId, ramenyaList]);

  // 마커 데이터 메모화
  const markerData = useMemo(() => {
    return (
      ramenyaList?.map((ramenya) => ({
        position: {
          lat: ramenya.latitude,
          lng: ramenya.longitude,
        },
        data: ramenya,
        title: ramenya.name,
      })) || []
    );
  }, [ramenyaList]);

  return (
    <>
      <SearchOverlay onSelectKeyword={handleKeywordClick} searchValue={searchValue} setSearchValue={setSearchValue} />

      <RefreshOverlay onRefresh={handleRefreshLocation} />

      {/* URL 파라미터가 있을 때는 파싱이 완료된 후에만 NaverMap 렌더링 */}
      {(!searchParams.get("latitude") || (searchParamsLocation.latitude && searchParamsLocation.longitude)) && (
        <NaverMap<Ramenya>
          onMapReady={handleMapReady}
          markers={markerData}
          selectedMarker={selectedMarker}
          onMarkerClick={handleMarkerClick}
          initialCenter={
            searchParamsLocation.latitude && searchParamsLocation.longitude
              ? {
                  lat: searchParamsLocation.latitude,
                  lng: searchParamsLocation.longitude,
                }
              : undefined
          }
        />
      )}

      {mapMode === MAP_MODE.CARD && (
        <ResultCardOverlay
          ramenyaList={ramenyaList || []}
          selectedMarker={selectedMarker}
          onMarkerSelect={setSelectedMarker}
          onMoveMapCenter={moveMapCenter}
        />
      )}

      {mapMode === MAP_MODE.LIST && (
        <ResultListOverlay
          ramenyaList={ramenyaList || []}
          selectedMarker={selectedMarker}
          onMarkerSelect={setSelectedMarker}
          onMoveMapCenter={moveMapCenter}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      )}
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
  absolute top-80 z-10 absolute-center-x
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

interface ResultOverlayProps {
  ramenyaList: Ramenya[];
  selectedMarker: Ramenya | null;
  onMarkerSelect: (marker: Ramenya) => void;
  onMoveMapCenter: (latitude: number, longitude: number) => void;
}

const ResultListOverlay = ({
  ramenyaList,
  filterOptions,
  setFilterOptions,
}: ResultOverlayProps & {
  filterOptions: FilterOptions;
  setFilterOptions: (filterOptions: FilterOptions) => void;
}) => {
  const [currentHeight, setCurrentHeight] = useState<OverlayHeightType>(OVERLAY_HEIGHTS.HALF);
  const [isDragging, setIsDragging] = useState(false);
  const [tempHeight, setTempHeight] = useState<string>(OVERLAY_HEIGHTS.COLLAPSED);

  const overlayRef = useRef<HTMLDivElement>(null);

  // vh 값을 픽셀로 변환하는 함수
  const vhToPx = (vh: string) => {
    const vhValue = parseFloat(vh.replace("vh", ""));
    return (vhValue / 100) * window.innerHeight;
  };

  // 픽셀 값을 vh로 변환하는 함수
  const pxToVh = (px: number) => {
    return `${(px / window.innerHeight) * 100}vh`;
  };

  // 드래그 제스처 설정
  const bind = useDrag(
    ({ movement: [, my], canceled, last, memo = vhToPx(currentHeight) }) => {
      if (canceled) return;

      setIsDragging(true);

      // 드래그 방향에 따른 높이 계산 (위로 드래그하면 양수)
      const deltaY = -my; // 위로 드래그하면 높이 증가
      let newHeightPx = memo + deltaY;

      // 엄격한 높이 제한 적용 (vh를 픽셀로 변환하여 비교)
      const minHeightPx = vhToPx(OVERLAY_HEIGHTS.COLLAPSED);
      const maxHeightPx = vhToPx(OVERLAY_HEIGHTS.EXPANDED);
      newHeightPx = Math.max(minHeightPx, Math.min(maxHeightPx, newHeightPx));

      // 픽셀을 vh로 변환하여 tempHeight 설정
      setTempHeight(pxToVh(newHeightPx));

      // 드래그 종료 시 스냅
      if (last) {
        setIsDragging(false);

        // 3단계 높이 중 가장 가까운 것 찾기
        const heights = [OVERLAY_HEIGHTS.COLLAPSED, OVERLAY_HEIGHTS.HALF, OVERLAY_HEIGHTS.EXPANDED];
        const heightPixels = heights.map((vh) => vhToPx(vh));
        const closestHeightIndex = heightPixels.reduce(
          (prev, curr, index) =>
            Math.abs(curr - newHeightPx) < Math.abs(heightPixels[prev] - newHeightPx) ? index : prev,
          0,
        );

        const closestHeight = heights[closestHeightIndex] as OverlayHeightType;
        setCurrentHeight(closestHeight);
        setTempHeight(closestHeight);
      }
    },
    {
      axis: "y",
      filterTaps: true,
      preventDefault: true,
      // 실시간 반응을 위한 설정
      from: () => [0, vhToPx(currentHeight)],
    },
  );

  return (
    <ResultListOverlayContainer
      ref={overlayRef}
      style={{
        height: isDragging ? tempHeight : currentHeight,
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
          height: isDragging ? `calc(${tempHeight} - 10px)` : `calc(${currentHeight} - 10px)`, // FilterSection 높이 고려
          overflowY: "auto",
        }}
      >
        {ramenyaList?.map((ramenya) => (
          <>
            <RamenyaCard key={ramenya._id} {...ramenya} />
            <LineWrapper>
              <Line />
            </LineWrapper>
          </>
        ))}

        {ramenyaList.length === 0 && <NoStoreBox type="map" />}
      </ListContentArea>
    </ResultListOverlayContainer>
  );
};

const ResultCardOverlay = ({ ramenyaList, selectedMarker, onMarkerSelect, onMoveMapCenter }: ResultOverlayProps) => {
  const swiperRef = useRef<SwiperCore>();

  // Swiper 슬라이드 변경 시 지도 중심 이동 (디바운싱 적용)
  const swiperSlideChangeTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSwiperSlideChange = useCallback(
    (swiper: SwiperCore) => {
      if (!selectedMarker) return;

      if (swiperSlideChangeTimeout.current) {
        clearTimeout(swiperSlideChangeTimeout.current);
      }

      swiperSlideChangeTimeout.current = setTimeout(() => {
        const currentData = ramenyaList[swiper.realIndex];
        if (!currentData) return;
        // 선택된 마커 업데이트
        onMarkerSelect(currentData);
        // 지도 중심을 해당 마커로 이동
        onMoveMapCenter(currentData.latitude, currentData.longitude);
      }, 200); // 200ms 디바운스
    },
    [selectedMarker, ramenyaList, onMarkerSelect, onMoveMapCenter],
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
          onSlideChange={handleSwiperSlideChange}
          slidesPerView={1.1}
          loop={true}
          centeredSlides={true}
          spaceBetween={10}
          style={{
            width: "100%",
            minHeight: "120px",
            maxWidth: "400px",
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

// ResultCardOverlay 스타일
const ResultCardContainer = tw.div`
  absolute left-0 right-0 bottom-70 z-10
  flex justify-center w-full pointer-events-none
  box-border
`;

const SwiperWrapper = tw.div`
  w-full pointer-events-auto
  flex justify-center
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
  flex-1 overflow-y-auto
`;

const LineWrapper = tw.div`
  px-20
`;

const ResultListOverlayContainer = tw.div`
  absolute bottom-56 left-0 right-0 bg-white rounded-t-16 overflow-hidden flex flex-col
  z-[110] [transform:translateZ(0)] [will-change:transform] [isolation:isolate]
  border border-solid border-divider/20
`;

export default MapPage;
