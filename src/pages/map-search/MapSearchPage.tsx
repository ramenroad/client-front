import { IconGPS } from "@/shared/ui/icon";
import render from "@/shared/ui/render";
import {
  MAP_MODE,
  OVERLAY_HEIGHTS,
  type Ramenya,
} from "@/entities/ramenya/model";
import { NaverMap } from "@/widgets/map/naver-map";
import { RefreshOverlay } from "@/widgets/map/refresh-overlay";
import { ResultCardOverlay } from "@/widgets/map/result-card-overlay";
import { ResultListOverlay } from "@/widgets/map/result-list-overlay";
import { SearchOverlay } from "@/widgets/map/search-overlay";
import { useMapSearchPage } from "./model/useMapSearchPage";

const MapPage = () => {
  const {
    mapMode,
    currentHeight,
    setCurrentHeight,
    filterOptions,
    setFilterOptions,
    keyword,
    setKeyword,
    ramenyaList,
    selectedMarker,
    markerData,
    isMovingRef,
    GPSButtonHeight,
    handleKeywordClick,
    handleMapReady,
    handleMapIdle,
    handleMarkerClick,
    handleMarkerSelect,
    handleRefreshDataWithNewLocation,
    handleClickGPSButton,
    shouldRenderMap,
    initialCenter,
  } = useMapSearchPage();

  return (
    <>
      <SearchOverlay onSelectKeyword={handleKeywordClick} keyword={keyword} setKeyword={setKeyword} />

      <RefreshOverlay onRefresh={handleRefreshDataWithNewLocation} />

      {shouldRenderMap && (
        <NaverMap<Ramenya>
          onMapReady={handleMapReady}
          onMapIdle={handleMapIdle}
          markers={markerData}
          selectedMarker={selectedMarker}
          onMarkerClick={handleMarkerClick}
          initialCenter={initialCenter}
        />
      )}

      {mapMode === MAP_MODE.CARD && (
        <ResultCardOverlay
          isMovingRef={isMovingRef}
          ramenyaList={ramenyaList ?? []}
          selectedMarker={selectedMarker}
          onMarkerSelect={handleMarkerSelect}
        />
      )}

      {mapMode === MAP_MODE.LIST && (
        <>
          {currentHeight !== OVERLAY_HEIGHTS.EXPANDED && (
            <GPSWrapper
              type="button"
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
            ramenyaList={ramenyaList ?? []}
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

const GPSWrapper = render.button("absolute cursor-pointer border-none bg-transparent p-0 shadow-none outline-none");

export default MapPage;
