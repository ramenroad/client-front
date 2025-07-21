import React, { useState, useCallback, useRef, useEffect, useMemo, ComponentProps } from "react";
import tw from "twin.macro";
import AppBar from "../../components/app-bar";
import { NaverMap } from "../../components/map/NaverMap";
import { GetRamenyaListWithGeolocationParams, getRamenyaListWithSearch } from "../../api/map";
import {
  useRamenyaListWithGeolocationQuery,
  useRamenyaSearchAutoCompleteQuery,
} from "../../hooks/queries/useRamenyaListQuery";
import { Ramenya } from "../../types";
import RamenyaCard from "../../components/ramenya-card/RamenyaCard";
import { RamenroadText } from "../../components/common/RamenroadText";
import { IconBack, IconClose, IconComment, IconLocate, IconRefresh, IconSearch } from "../../components/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import { initialFilterOptions, MAP_MODE, MapModeType, OVERLAY_HEIGHTS, OverlayHeightType } from "../../constants";
import { useDrag } from "@use-gesture/react";
import FilterSection from "../../components/filter/FilterSection";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { FilterOptions } from "../../types/filter";
import { Line } from "../../components/common/Line";
import { getTextMatch } from "../../util";
import { useSearchHistoryQuery } from "../../hooks/queries/useSearchQuery";
import NoStoreBox from "../../components/no-data/NoStoreBox";
import { useRemoveSearchHistoryMutation } from "../../hooks/mutation/useSearchHistoryMutation";
import { useDebounce } from "../../hooks/common/useDebounce";
import NoResultBox from "../../components/no-data/NoResultBox";
import { queryClient } from "../../core/queryClient";
import { queryKeys } from "../../hooks/queries/queryKeys";
import { useSignInStore } from "../../states/sign-in";

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

  // 위치 기반 라면야 목록 쿼리
  const { ramenyaListWithGeolocationQuery } = useRamenyaListWithGeolocationQuery({
    ...currentGeolocation,
    filterOptions: filterOptions,
  });

  const [ramenyaList, setRamenyaList] = useState<Ramenya[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Ramenya | null>(null);
  const [mapInstance, setMapInstance] = useState<naver.maps.Map | null>(null);
  const [searchValue, setSearchValue] = useState("");

  // 초기화 완료 플래그
  const [isInitialized, setIsInitialized] = useState(false);

  const mapMode = useMemo<MapModeType>(() => {
    if (selectedMarker) return MAP_MODE.CARD;
    return MAP_MODE.LIST;
  }, [selectedMarker]);

  // 지도 중심 좌표 계산 함수 메모화
  const calculateMapCenter = useCallback((map: naver.maps.Map) => {
    const currentCenter = map.getCenter() as naver.maps.LatLng;
    const latitude = currentCenter.lat();
    const longitude = currentCenter.lng();

    // 네이버 포럼에서 제공하는 정확한 픽셀당 거리 계산 방법
    const projection = map.getProjection();
    const deviceHeight = window.innerHeight;
    const halfDeviceHeight = Math.round(deviceHeight / 2);

    const p1 = new naver.maps.Point(0, 0);
    const p3 = new naver.maps.Point(halfDeviceHeight, 0);

    const c1 = projection.fromOffsetToCoord(p1);
    const c3 = projection.fromOffsetToCoord(p3);

    const distHalfHeight = projection.getDistance(c1, c3);
    const radiusInMeters = Math.round(distHalfHeight);

    return {
      latitude,
      longitude,
      radiusInMeters,
    };
  }, []);

  // 위치 데이터 업데이트 함수 - 메모화
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

  // 지도 준비 완료 핸들러
  const handleMapReady = useCallback(
    (map: naver.maps.Map) => {
      setMapInstance(map);
      // 지도가 준비되면 초기 위치 데이터 가져오기 (한 번만)
      if (!isInitialized) {
        updateLocationData(map);
        setIsInitialized(true);
      }
    },
    [updateLocationData, isInitialized],
  );

  // 현재 지도 중심 좌표 가져오기 및 데이터 refetch (수동 새로고침)
  const handleRefreshLocation = useCallback(async () => {
    if (!mapInstance) {
      return;
    }

    updateLocationData(mapInstance);
    console.log("handleRefreshLocation");
    setSelectedMarker(null);

    if (searchValue === "") {
      ramenyaListWithGeolocationQuery.refetch();
      return;
    }

    // 검색어가 있는 경우 검색 API 호출
    try {
      const searchResults = await getRamenyaListWithSearch({
        query: searchValue,
        ...currentGeolocation,
        inLocation: true,
      });
      if (searchResults) {
        setRamenyaList(searchResults);
      }
    } catch (error) {
      console.error("검색 실패:", error);
    }
  }, [mapInstance, updateLocationData, searchValue, currentGeolocation, ramenyaListWithGeolocationQuery]);

  // 마커 클릭 핸들러 메모화
  const handleMarkerClick = useCallback(
    (markerData: Ramenya) => {
      console.log("handleMarkerClick", markerData);
      setSelectedMarker((prevSelected) => {
        if (prevSelected?._id === markerData._id) {
          return null;
        } else {
          mapInstance?.setZoom(15);
          return markerData;
        }
      });
    },
    [mapInstance],
  );

  // 지도 중심을 특정 위치로 이동
  const handleMoveMapCenter = useCallback(
    (latitude: number, longitude: number) => {
      if (mapInstance) {
        mapInstance.panTo(new naver.maps.LatLng(latitude - 0.005, longitude));
      }
    },
    [mapInstance],
  );

  // 키워드 선택 핸들러
  const handleSelectKeyword = useCallback(
    async (keyword: { id: string; name: string; type: "keyword" | "ramenya" }) => {
      try {
        let ramenyaList: Ramenya[] = [];
        if (keyword.type === "keyword") {
          ramenyaList = await getRamenyaListWithSearch({ query: keyword.name, ...currentGeolocation });
        } else {
          ramenyaList = await getRamenyaListWithSearch({ query: keyword.name });
        }

        queryClient.invalidateQueries({ ...queryKeys.search.history });

        if (ramenyaList?.length > 0) {
          handleMoveMapCenter(ramenyaList[0].latitude, ramenyaList[0].longitude);
          setRamenyaList(ramenyaList);
        } else {
          setRamenyaList([]);
        }
      } catch (error) {
        console.error("키워드 검색 실패:", error);
        setRamenyaList([]);
      }
    },
    [handleMoveMapCenter, currentGeolocation],
  );

  // 위치 기반 쿼리 결과 처리 (초기화 완료 후에만)
  useEffect(() => {
    if (
      isInitialized &&
      !ramenyaListWithGeolocationQuery.isLoading &&
      ramenyaListWithGeolocationQuery.data &&
      searchValue === ""
    ) {
      setRamenyaList(ramenyaListWithGeolocationQuery.data || []);
    }
  }, [ramenyaListWithGeolocationQuery.data, ramenyaListWithGeolocationQuery.isLoading, isInitialized, searchValue]);

  // 마커 데이터 메모화 - ramenyaList가 변경될 때만 새로 생성
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

  useEffect(() => {
    console.log("useEffect selectedMarker", selectedMarker);
  }, [selectedMarker]);

  return (
    <>
      <MapScreen>
        <SearchOverlay
          onSelectKeyword={handleSelectKeyword}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        {/* 상단 현재 위치 재검색 버튼 */}
        <RefreshOverlay onRefresh={handleRefreshLocation} />

        <NaverMap<Ramenya>
          onMapReady={handleMapReady}
          onMapCenterChange={updateLocationData}
          markers={markerData}
          selectedMarker={selectedMarker}
          onMarkerClick={handleMarkerClick}
        />

        {/* 카드 오버레이 (기존 기능) */}
        {mapMode === MAP_MODE.CARD && (
          <ResultCardOverlay
            ramenyaList={ramenyaList || []}
            selectedMarker={selectedMarker}
            onMarkerSelect={setSelectedMarker}
            onMoveMapCenter={handleMoveMapCenter}
          />
        )}

        {/* 리스트 오버레이 (드래그 가능한 새로운 컴포넌트) */}
        {mapMode === MAP_MODE.LIST && (
          <ResultListOverlay
            ramenyaList={ramenyaList || []}
            selectedMarker={selectedMarker}
            onMarkerSelect={setSelectedMarker}
            onMoveMapCenter={handleMoveMapCenter}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
          />
        )}
      </MapScreen>
      <AppBar />
    </>
  );
};

interface SearchOverlayProps extends ComponentProps<"input"> {
  isSearching?: boolean;
  onSelectKeyword?: (keyword: { id: string; name: string; type: "keyword" | "ramenya" }) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const SearchOverlay = ({ onSelectKeyword, searchValue, setSearchValue, ...rest }: SearchOverlayProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const { value: debouncedSearchValue } = useDebounce<string>(searchValue, 300);

  const { searchHistoryQuery } = useSearchHistoryQuery();
  const { remove: removeSearchHistory } = useRemoveSearchHistoryMutation();
  const { ramenyaSearchAutoCompleteQuery } = useRamenyaSearchAutoCompleteQuery({ query: debouncedSearchValue });

  const { isSignIn } = useSignInStore((state) => state);

  // localStorage 기반 히스토리 (비회원용)
  const [signOutKeywordHistory, setSignOutKeywordHistory] = useLocalStorage<string[]>("signOutKeywordHistory", []);
  const [signOutRamenyaHistory, setSignOutRamenyaHistory] = useLocalStorage<{ _id: string; name: string }[]>(
    "signOutRamenyaHistory",
    [],
  );

  // 히스토리 getter
  const getKeywordHistory = () => {
    if (isSignIn) {
      return searchHistoryQuery.data?.searchKeywords || [];
    } else {
      return signOutKeywordHistory.map((keyword, idx) => ({ _id: String(idx), keyword }));
    }
  };
  const getRamenyaHistory = () => {
    if (isSignIn) {
      return searchHistoryQuery.data?.ramenyaNames || [];
    } else {
      return signOutRamenyaHistory.map((r) => ({ _id: r._id, keyword: r.name }));
    }
  };

  // 히스토리 추가/삭제
  const addKeywordHistory = (keyword: string) => {
    if (!isSignIn) {
      setSignOutKeywordHistory((prev) => [keyword, ...prev.filter((k) => k !== keyword)]);
    }
  };
  const removeKeywordHistory = (keyword: string) => {
    if (!isSignIn) {
      setSignOutKeywordHistory((prev) => prev.filter((k) => k !== keyword));
    }
  };
  const clearKeywordHistory = () => {
    if (!isSignIn) {
      setSignOutKeywordHistory([]);
    }
  };
  const addRamenyaHistory = (ramenya: { _id: string; name: string }) => {
    if (!isSignIn) {
      setSignOutRamenyaHistory((prev) => [ramenya, ...prev.filter((r) => r._id !== ramenya._id)]);
    }
  };
  const removeRamenyaHistory = (ramenya: { _id: string }) => {
    if (!isSignIn) {
      setSignOutRamenyaHistory((prev) => prev.filter((r) => r._id !== ramenya._id));
    }
  };
  const clearRamenyaHistory = () => {
    if (!isSignIn) {
      setSignOutRamenyaHistory([]);
    }
  };

  const isTyping = useMemo(() => searchValue.length > 0, [searchValue]);
  const isAutoCompleteResultExist = useMemo(() => {
    return (
      ramenyaSearchAutoCompleteQuery.data?.ramenyaSearchResults?.length !== 0 ||
      ramenyaSearchAutoCompleteQuery.data?.keywordSearchResults?.length !== 0
    );
  }, [ramenyaSearchAutoCompleteQuery.data]);

  const keywordHistory = getKeywordHistory();
  const ramenyaHistory = getRamenyaHistory();
  const isKeywordHistoryExist = keywordHistory.length > 0;
  const isRamenyaHistoryExist = ramenyaHistory.length > 0;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      onSelectKeyword?.({ id: searchValue, name: searchValue, type: "keyword" });
      addKeywordHistory(searchValue);
      handleBlur();
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <SearchOverlayContainer>
        {isFocused && <FocusResetIcon onClick={handleBlur} />}
        <SearchBox>
          {!isFocused && (
            <IconWrapper>
              <IconSearch />
            </IconWrapper>
          )}
          <SearchInput
            ref={inputRef}
            {...rest}
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="장르 또는 매장으로 검색해 보세요"
          />
        </SearchBox>
      </SearchOverlayContainer>

      {isFocused && (
        <FullScreenSearchOverlay>
          {isTyping ? (
            isAutoCompleteResultExist ? (
              <AutoCompleteContainer>
                {ramenyaSearchAutoCompleteQuery.data?.keywordSearchResults?.map((keyword) => (
                  <KeywardWrapper
                    key={keyword._id}
                    onClick={() => {
                      onSelectKeyword?.({ id: keyword._id, name: keyword.name, type: "keyword" });
                      addKeywordHistory(keyword.name);
                      setIsFocused(false);
                    }}
                  >
                    <IconLocate />
                    <span>
                      <MatchedText size={16} weight="sb">
                        {getTextMatch({ query: searchValue, target: keyword.name }).matchedText}
                      </MatchedText>
                      <UnMatchedText size={16} weight="sb">
                        {getTextMatch({ query: searchValue, target: keyword.name }).unMatchedText}
                      </UnMatchedText>
                    </span>
                  </KeywardWrapper>
                ))}
                {ramenyaSearchAutoCompleteQuery.data?.ramenyaSearchResults?.map((ramenya) => (
                  <KeywardWrapper
                    key={ramenya._id}
                    onClick={() => {
                      onSelectKeyword?.({ id: ramenya._id, name: ramenya.name, type: "ramenya" });
                      setSearchValue(ramenya.name);
                      addRamenyaHistory({ _id: ramenya._id, name: ramenya.name });
                      setIsFocused(false);
                    }}
                  >
                    <IconLocate color={"#A0A0A0"} />
                    <span>
                      <MatchedText size={16} weight="sb">
                        {getTextMatch({ query: searchValue, target: ramenya.name }).matchedText}
                      </MatchedText>
                      <UnMatchedText size={16} weight="sb">
                        {getTextMatch({ query: searchValue, target: ramenya.name }).unMatchedText}
                      </UnMatchedText>
                    </span>
                  </KeywardWrapper>
                ))}
              </AutoCompleteContainer>
            ) : (
              <NoResultBox actionButton={<SubmitButton>제보하기</SubmitButton>} />
            )
          ) : (
            <>
              <HistoryContainer>
                <HistoryHeader>
                  <RamenroadText size={16} weight="sb">
                    최근 검색어
                  </RamenroadText>
                  <RemoveText
                    size={12}
                    weight="r"
                    onClick={() => {
                      if (isSignIn) {
                        if (searchHistoryQuery.data?.searchKeywords?.length === 0) return;
                        removeSearchHistory.mutate(
                          searchHistoryQuery.data?.searchKeywords?.map((keyword) => keyword._id) || [],
                        );
                      } else {
                        if (signOutKeywordHistory.length === 0) return;
                        clearKeywordHistory();
                      }
                    }}
                  >
                    전체 삭제
                  </RemoveText>
                </HistoryHeader>
                {isKeywordHistoryExist ? (
                  <HistoryTagWrapper>
                    {keywordHistory.map((keyword) => (
                      <KeywordHistoryTag
                        key={keyword._id}
                        onClick={() => {
                          onSelectKeyword?.({ id: keyword._id, name: keyword.keyword, type: "keyword" });
                          addKeywordHistory(keyword.keyword);
                          setSearchValue(keyword.keyword);
                          setIsFocused(false);
                        }}
                      >
                        <RamenroadText size={14} weight="r">
                          {keyword.keyword}
                        </RamenroadText>
                        <XIcon
                          color="#A0A0A0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSignIn) {
                              removeSearchHistory.mutate([keyword._id]);
                            } else {
                              removeKeywordHistory(keyword.keyword);
                            }
                          }}
                        />
                      </KeywordHistoryTag>
                    ))}
                  </HistoryTagWrapper>
                ) : (
                  <NoHistoryWrapper>
                    <IconComment />
                    <NoHistoryText size={16} weight="r">
                      최근 검색어가 없어요
                    </NoHistoryText>
                  </NoHistoryWrapper>
                )}
              </HistoryContainer>
              <HistoryContainer>
                <HistoryHeader>
                  <RamenroadText size={16} weight="sb">
                    검색한 매장
                  </RamenroadText>
                  <RemoveText
                    size={12}
                    weight="r"
                    onClick={() => {
                      if (isSignIn) {
                        if (searchHistoryQuery.data?.ramenyaNames?.length === 0) return;
                        removeSearchHistory.mutate(
                          searchHistoryQuery.data?.ramenyaNames?.map((ramenya) => ramenya._id) || [],
                        );
                      } else {
                        if (signOutRamenyaHistory.length === 0) return;
                        clearRamenyaHistory();
                      }
                    }}
                  >
                    전체 삭제
                  </RemoveText>
                </HistoryHeader>
                <RamenyaHistoryWrapper>
                  {isRamenyaHistoryExist ? (
                    ramenyaHistory.map((ramenya) => (
                      <KeywardWrapper
                        key={ramenya._id}
                        onClick={() => {
                          onSelectKeyword?.({ id: ramenya._id, name: ramenya.keyword, type: "ramenya" });
                          setSearchValue(ramenya.keyword);
                          addRamenyaHistory({ _id: ramenya._id, name: ramenya.keyword });
                          setIsFocused(false);
                        }}
                      >
                        <IconLocate color={"#A0A0A0"} />
                        <RamenroadText size={16} weight="r">
                          {ramenya.keyword}
                        </RamenroadText>
                        <RamenyaXIcon
                          color="#A0A0A0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSignIn) {
                              removeSearchHistory.mutate([ramenya._id]);
                            } else {
                              removeRamenyaHistory({ _id: ramenya._id });
                            }
                          }}
                        />
                      </KeywardWrapper>
                    ))
                  ) : (
                    <NoHistoryWrapper>
                      <IconComment />
                      <NoHistoryText size={16} weight="r">
                        검색한 매장이 없어요
                      </NoHistoryText>
                    </NoHistoryWrapper>
                  )}
                </RamenyaHistoryWrapper>
              </HistoryContainer>
            </>
          )}
        </FullScreenSearchOverlay>
      )}
    </>
  );
};

const AutoCompleteContainer = tw.div`
  flex flex-col
`;

const SubmitButton = tw.button`
  text-orange bg-[#FFE4CE]
  font-16-m
  px-32 py-10
  rounded-100
  outline-none border-none
  cursor-pointer
`;

const KeywardWrapper = tw.div`
  flex items-center gap-8
  h-36
  cursor-pointer
`;

const MatchedText = tw(RamenroadText)`
  text-orange
`;

const UnMatchedText = tw(RamenroadText)`
`;

const SearchOverlayContainer = tw.figure`
  absolute top-16 left-0 right-0 z-[200]
  m-0 px-20
  h-48
  box-border
  flex gap-12 items-center
`;

const SearchBox = tw.div`
  flex items-center gap-8
  w-full h-full rounded-8
  box-border border border-solid border-divider
  bg-white px-16 py-12
`;

const IconWrapper = tw.div`
  w-24 h-24
`;

const FocusResetIcon = tw(IconBack)`
  cursor-pointer
`;

const SearchInput = tw.input`
  w-full h-24
  bg-white border-none
  font-16-r text-black leading-24
  focus:outline-none
`;

// 전체 화면 검색 오버레이 스타일
const FullScreenSearchOverlay = tw.main`
  absolute w-full h-full inset-0 bg-white z-[150]
  flex flex-col gap-32
  box-border px-16 py-20 pt-84
`;

const HistoryContainer = tw.div`
  flex flex-col gap-16
`;

const HistoryHeader = tw.div`
  flex justify-between items-center
  w-full
`;

const RemoveText = tw(RamenroadText)`
  text-gray-400 cursor-pointer
`;

const HistoryTagWrapper = tw.div`
  flex flex-wrap gap-8
`;

const KeywordHistoryTag = tw.div`
  flex items-center gap-8
  box-border h-33
  py-6 px-12
  cursor-pointer
  border border-solid border-gray-200 rounded-50
  font-14-r text-gray-900
`;

const RamenyaHistoryWrapper = tw.div`
  flex flex-col
`;

const NoHistoryWrapper = tw.div`
  flex flex-col
  items-center gap-8
  cursor-pointer
  mt-12
`;

const NoHistoryText = tw(RamenroadText)`
  text-gray-400
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
          height: isDragging ? `${tempHeight - 10}px` : `${currentHeight - 10}px`, // FilterSection 높이 고려
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

const MapScreen = tw.main`
  w-full h-[calc(100vh-56px)] relative
  pb-56
`;

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

const RamenyaXIcon = tw(IconClose)`
  ml-auto
  w-9 h-9
  cursor-pointer
`;

const XIcon = tw(IconClose)`
  w-9 h-9
  cursor-pointer
`;

export default MapPage;
