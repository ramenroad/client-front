import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import tw from "twin.macro";
import { NaverMap } from "../../components/map/NaverMap";
import {
  useRamenyaListWithGeolocationQuery,
  useRamenyaListWithSearchQuery,
} from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";
import RamenyaCard from "../../components/ramenya-card/RamenyaCard";
import { RamenroadText } from "../../components/common/RamenroadText";
import { IconGPS, IconRefresh } from "../../components/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import {
  initialFilterOptions,
  MAP_MODE,
  MapModeType,
  OpenStatus,
  OVERLAY_HEIGHTS,
  OverlayHeightType,
  SEARCH_MODE,
  SearchModeType,
} from "../../constants";
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
import { useUserLocation } from "../../hooks/common/useUserLocation";
import { checkBusinessStatus } from "../../util";

const MapPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // setSearchParams 함수를 ref로 안정화
  const setSearchParamsRef = useRef(setSearchParams);

  const isMovingRef = useRef(false);

  // ref를 최신으로 업데이트
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const mapSearchParams = useMemo(() => {
    return {
      latitude: searchParams.get("latitude") ? Number(searchParams.get("latitude")) : undefined,
      longitude: searchParams.get("longitude") ? Number(searchParams.get("longitude")) : undefined,
      radius: searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined,
      level: searchParams.get("level") ? Number(searchParams.get("level")) : undefined,
    };
  }, [searchParams]);
  const [geolocationForSearch, setGeolocationForSearch] = useState<{
    latitude?: number;
    longitude?: number;
    radius?: number;
    level?: number;
  }>({
    latitude: undefined,
    longitude: undefined,
    radius: undefined,
    level: undefined,
  });

  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);

  const [selectedMarker, setSelectedMarker] = useState<Ramenya | null>(null);
  const selectedMarkerRef = useRef<Ramenya | null>(null);

  useEffect(() => {
    selectedMarkerRef.current = selectedMarker;
  }, [selectedMarker]);

  const [searchMode, setSearchMode] = useState<SearchModeType>(SEARCH_MODE.NEARBY);

  const [currentHeight, setCurrentHeight] = useState<OverlayHeightType>(OVERLAY_HEIGHTS.HALF);

  const dvhToPx = (dvh: string) => {
    const dvhValue = parseFloat(dvh.replace("dvh", ""));
    return (dvhValue / 100) * (window.visualViewport?.height || window.innerHeight);
  };

  const GPSButtonHeight = useMemo(() => {
    // dvh 값을 픽셀로 변환하는 함수

    switch (currentHeight) {
      case OVERLAY_HEIGHTS.COLLAPSED:
        return dvhToPx(OVERLAY_HEIGHTS.COLLAPSED);
      case OVERLAY_HEIGHTS.HALF:
        return dvhToPx(OVERLAY_HEIGHTS.HALF);
      case OVERLAY_HEIGHTS.EXPANDED:
        return dvhToPx(OVERLAY_HEIGHTS.EXPANDED);
    }
  }, [currentHeight]);

  const [filterOptions, setFilterOptions] = useSessionStorage<FilterOptions>(
    "mapPageFilterOptions",
    initialFilterOptions,
  );

  const { getUserPosition } = useUserLocation();

  // 위치 관리 커스텀 훅
  const { moveMapCenter } = useMapLocation({
    mapInstance,
  });

  // 검색 관리 커스텀 훅
  const { keyword, setKeyword, searchParamsKeyword, handleKeywordClick } = useMapSearch();

  // 위치 기반 라면야 목록 쿼리
  const { ramenyaListWithGeolocationQuery } = useRamenyaListWithGeolocationQuery({
    ...geolocationForSearch,
    filterOptions: filterOptions,
  });

  const { ramenyaListWithSearchQuery } = useRamenyaListWithSearchQuery({
    keyword: searchParamsKeyword.keyword ?? undefined,
    ...geolocationForSearch,
    filterOptions: filterOptions,
    nearby: searchParams.get("nearBy") === "true",
  });

  const ramenyaList = useMemo(() => {
    if (searchMode === SEARCH_MODE.NEARBY) {
      return ramenyaListWithGeolocationQuery.data;
    } else {
      return ramenyaListWithSearchQuery.data;
    }
  }, [searchMode, ramenyaListWithGeolocationQuery.data, ramenyaListWithSearchQuery.data]);

  // 지도 모드 계산
  const mapMode = useMemo<MapModeType>(() => {
    if (searchParams.get("selectedId")) return MAP_MODE.CARD;
    return MAP_MODE.LIST;
  }, [searchParams]);

  // 지도 준비 완료 핸들러
  const handleMapReady = useCallback((map: naver.maps.Map) => {
    // 맵 인스턴스 등록
    setMapInstance(map);
  }, []);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (markerData: Ramenya) => {
      isMovingRef.current = true;

      setSelectedMarker(() => {
        if (selectedMarkerRef.current?._id === markerData._id) {
          setSearchParamsRef.current((prev) => {
            prev.delete("selectedId");
            return prev;
          });
          return null;
        } else {
          setSearchParamsRef.current((prev) => {
            prev.set("selectedId", markerData._id);
            return prev;
          });
          return markerData;
        }
      });
      setTimeout(() => {
        isMovingRef.current = false;
      }, 300);
    },
    [setSearchParamsRef],
  );

  // 새로고침 핸들러
  const handleRefreshDataWithNewLocation = useCallback(async () => {
    if (!mapInstance) return;

    setSelectedMarker(null);
    isMovingRef.current = true;

    if (!keyword || keyword.trim() === "") {
      setSearchMode(SEARCH_MODE.NEARBY);
      setSearchParams((prev) => {
        prev.set("nearBy", "true");
        prev.delete("selectedId");
        return prev;
      });
    } else {
      setSearchMode(SEARCH_MODE.KEYWORD);
      setSearchParams((prev) => {
        prev.delete("selectedId");
        return prev;
      });
    }

    setGeolocationForSearch({
      ...mapSearchParams,
    });

    setTimeout(() => {
      isMovingRef.current = false;
    }, 300);
  }, [mapInstance, setSearchParams, keyword, mapSearchParams]);

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
        inactive:
          checkBusinessStatus(ramenya.businessHours).status === OpenStatus.CLOSED ||
          checkBusinessStatus(ramenya.businessHours).status === OpenStatus.DAY_OFF,
      })) || []
    );
  }, [ramenyaList]);

  const handleClickGPSButton = useCallback(async () => {
    const currentLocation = await getUserPosition();
    if (currentLocation) {
      moveMapCenter(
        currentLocation.latitude,
        currentLocation.longitude,
        mapSearchParams.level && mapSearchParams.level < 14 ? 14 : mapSearchParams.level,
      );
      setGeolocationForSearch({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: mapSearchParams.radius,
        level: mapSearchParams.level,
      });
    }
  }, [getUserPosition, mapSearchParams.radius, mapSearchParams.level, moveMapCenter]);

  useEffect(() => {
    // 첫 좌표 세팅
    const getCurrentLocation = async () => {
      if (
        mapSearchParams.latitude &&
        mapSearchParams.longitude &&
        !geolocationForSearch.latitude &&
        !geolocationForSearch.longitude &&
        !geolocationForSearch.radius
      ) {
        setGeolocationForSearch({
          latitude: Number(searchParams.get("latitude")),
          longitude: Number(searchParams.get("longitude")),
          radius: mapSearchParams.radius,
        });
      }
    };

    if (!geolocationForSearch.latitude || !geolocationForSearch.longitude) {
      getCurrentLocation();
    }
  }, [geolocationForSearch, mapSearchParams.latitude, mapSearchParams.longitude, mapSearchParams.radius, searchParams]);

  useEffect(() => {
    if ((ramenyaListWithSearchQuery.data || ramenyaListWithGeolocationQuery.data) && !selectedMarker) {
      const selectedRamenya =
        ramenyaListWithSearchQuery.data?.find((ramenya) => ramenya._id === searchParamsKeyword.selectedId) ??
        ramenyaListWithGeolocationQuery.data?.find((ramenya) => ramenya._id === searchParamsKeyword.selectedId);

      if (selectedRamenya) {
        setSelectedMarker(selectedRamenya);
      }
    }
  }, [
    ramenyaListWithSearchQuery.data,
    ramenyaListWithGeolocationQuery.data,
    searchParamsKeyword.selectedId,
    selectedMarker,
  ]);

  useEffect(() => {
    if (!keyword || keyword.trim() === "") {
      setSearchMode(SEARCH_MODE.NEARBY);
    } else {
      setSearchMode(SEARCH_MODE.KEYWORD);
    }
  }, [keyword]);

  useEffect(() => {
    if (searchMode === SEARCH_MODE.KEYWORD && ramenyaListWithSearchQuery.data) {
      const location = ramenyaListWithSearchQuery.data.find((ramenya) => ramenya.name === keyword);

      if (location) {
        moveMapCenter(location.latitude, location.longitude);
        setGeolocationForSearch({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: mapSearchParams.radius,
        });
      }
    }
  }, [searchMode, keyword, ramenyaListWithSearchQuery.data, moveMapCenter, mapSearchParams.radius]);

  return (
    <>
      <SearchOverlay
        onSelectKeyword={(keyword, isNearBy) => {
          setSearchMode(SEARCH_MODE.KEYWORD);
          setSearchParams((prev) => {
            if (isNearBy) {
              prev.set("nearBy", "true");
            } else {
              prev.delete("nearBy");
            }
            return prev;
          });
          handleKeywordClick(keyword, isNearBy);
        }}
        keyword={keyword}
        setKeyword={setKeyword}
      />

      <RefreshOverlay onRefresh={handleRefreshDataWithNewLocation} />

      {/* URL 파라미터가 있을 때는 파싱이 완료된 후에만 NaverMap 렌더링 */}
      {(!searchParams.get("latitude") || (searchParams.get("latitude") && searchParams.get("longitude"))) && (
        <NaverMap<Ramenya>
          onMapReady={handleMapReady}
          markers={markerData}
          selectedMarker={selectedMarker}
          onMarkerClick={handleMarkerClick}
          initialCenter={
            searchParams.get("latitude") && searchParams.get("longitude")
              ? {
                  lat: Number(searchParams.get("latitude")),
                  lng: Number(searchParams.get("longitude")),
                }
              : undefined
          }
          isMovingRef={isMovingRef}
        />
      )}

      {mapMode === MAP_MODE.CARD && (
        <ResultCardOverlay
          isMovingRef={isMovingRef}
          ramenyaList={ramenyaList || []}
          selectedMarker={selectedMarker}
          onMarkerSelect={setSelectedMarker}
          onMoveMapCenter={moveMapCenter}
        />
      )}

      {mapMode === MAP_MODE.LIST && (
        <>
          {currentHeight !== OVERLAY_HEIGHTS.EXPANDED && (
            <GPSWrapper
              onClick={handleClickGPSButton}
              style={{
                left: "16px",
                bottom: GPSButtonHeight + 60,
              }}
            >
              <IconGPS />
            </GPSWrapper>
          )}
          <ResultListOverlay
            ramenyaList={ramenyaList || []}
            selectedMarker={selectedMarker}
            onMarkerSelect={setSelectedMarker}
            onMoveMapCenter={moveMapCenter}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            currentHeight={currentHeight}
            setCurrentHeight={setCurrentHeight}
          />
        </>
      )}
    </>
  );
};

const GPSWrapper = tw.div`
  absolute
  cursor-pointer
`;

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
  w-125 h-34 pl-14 pr-16 py-8
  flex gap-4 items-center
  bg-white rounded-50
  outline-none border-none
  shadow
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
  isMovingRef?: React.MutableRefObject<boolean>;
}

const ResultListOverlay = ({
  currentHeight,
  setCurrentHeight,
  ramenyaList,
  filterOptions,
  setFilterOptions,
}: ResultOverlayProps & {
  currentHeight: OverlayHeightType;
  setCurrentHeight: (height: OverlayHeightType) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (filterOptions: FilterOptions) => void;
}) => {
  // const [currentHeight, setCurrentHeight] = useState<OverlayHeightType>(OVERLAY_HEIGHTS.HALF);
  const [isDragging, setIsDragging] = useState(false);
  const [tempHeight, setTempHeight] = useState<string>(OVERLAY_HEIGHTS.COLLAPSED);

  const overlayRef = useRef<HTMLDivElement>(null);

  // dvh 값을 픽셀로 변환하는 함수
  const dvhToPx = (dvh: string) => {
    const dvhValue = parseFloat(dvh.replace("dvh", ""));
    return (dvhValue / 100) * (window.visualViewport?.height || window.innerHeight);
  };

  // 픽셀 값을 dvh로 변환하는 함수
  const pxToDvh = (px: number) => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    return `${(px / viewportHeight) * 100}dvh`;
  };

  // 드래그 제스처 설정
  const bind = useDrag(
    ({ movement: [, my], canceled, last, memo = dvhToPx(currentHeight) }) => {
      if (canceled) return;

      setIsDragging(true);

      // 드래그 방향에 따른 높이 계산 (위로 드래그하면 양수)
      const deltaY = -my; // 위로 드래그하면 높이 증가
      let newHeightPx = memo + deltaY;

      // 엄격한 높이 제한 적용 (vh를 픽셀로 변환하여 비교)
      const minHeightPx = dvhToPx(OVERLAY_HEIGHTS.COLLAPSED);
      const maxHeightPx = dvhToPx(OVERLAY_HEIGHTS.EXPANDED);
      newHeightPx = Math.max(minHeightPx, Math.min(maxHeightPx, newHeightPx));

      // 픽셀을 vh로 변환하여 tempHeight 설정
      setTempHeight(pxToDvh(newHeightPx));

      // 드래그 종료 시 스냅
      if (last) {
        setIsDragging(false);

        // 3단계 높이 중 가장 가까운 것 찾기
        const heights = [OVERLAY_HEIGHTS.COLLAPSED, OVERLAY_HEIGHTS.HALF, OVERLAY_HEIGHTS.EXPANDED];
        const heightPixels = heights.map((dvh) => dvhToPx(dvh));
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
      from: () => [0, dvhToPx(currentHeight)],
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

const ResultCardOverlay = ({
  ramenyaList,
  selectedMarker,
  onMarkerSelect,
  onMoveMapCenter,
  isMovingRef,
}: ResultOverlayProps) => {
  const swiperRef = useRef<SwiperCore>();
  const [, setSearchParams] = useSearchParams();

  // Swiper 슬라이드 변경 시 지도 중심 이동 (디바운싱 적용)
  const swiperSlideChangeTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSwiperSlideChange = useCallback(
    (swiper: SwiperCore) => {
      if (isMovingRef?.current || !selectedMarker || swiper.clickedIndex || swiper.clickedIndex === 0) return;

      setSearchParams((prev) => {
        prev.set("selectedId", selectedMarker._id);
        prev.set("latitude", selectedMarker.latitude.toString());
        prev.set("longitude", selectedMarker.longitude.toString());
        return prev;
      });

      if (swiperSlideChangeTimeout.current) {
        clearTimeout(swiperSlideChangeTimeout.current);
      }

      swiperSlideChangeTimeout.current = setTimeout(() => {
        const currentData = ramenyaList[swiper.realIndex];
        if (!currentData) return;
        // 선택된 마커 업데이트
        onMarkerSelect(currentData);
        // 지도 중심을 해당 마커로 이동
        // onMoveMapCenter(currentData.latitude, currentData.longitude);
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
  w-36 h-4 bg-divider rounded-full
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
  shadow-[0_-5px_10px_rgba(0,0,0,0.1)]
`;

export default MapPage;
