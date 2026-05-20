import { IconGPS } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { SearchOverlay } from '@/widgets/map/search-overlay'
import { NaverMap } from '@/widgets/map/naver-map'
import { RefreshOverlay } from '@/widgets/map/refresh-overlay'
import { ResultListOverlay } from '@/widgets/map/result-list-overlay'
import { useMapSearchPage } from '../model/useMapSearchPage'

const MapSearchPage = () => {
  const {
    initialCenter,
    initialZoom,
    keyword,
    setKeyword,
    selectedId,
    resultItems,
    markerData,
    isLoading,
    resultSheetTitle,
    needsRefresh,
    currentLocation,
    focusRequest,
    resultSheetHeight,
    setResultSheetHeight,
    shouldShowCurrentLocationButton,
    currentLocationButtonBottom,
    handleMapReady,
    handleMapIdle,
    handleMapFocusMove,
    handleRefresh,
    handleKeywordSelect,
    handleKeywordClear,
    handleMarkerClick,
    handleResultClick,
    handleCurrentLocationClick,
  } = useMapSearchPage()

  return (
    <PageContainer>
      <SearchOverlay
        keyword={keyword}
        setKeyword={setKeyword}
        onSelectKeyword={handleKeywordSelect}
        onClearKeyword={handleKeywordClear}
      />

      <NaverMap
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        markers={markerData}
        selectedMarkerId={selectedId}
        currentLocation={currentLocation}
        focusRequest={focusRequest}
        onMapReady={handleMapReady}
        onMapIdle={handleMapIdle}
        onFocusMove={handleMapFocusMove}
        onMarkerClick={handleMarkerClick}
      />

      {needsRefresh && <RefreshOverlay onRefresh={handleRefresh} />}

      {shouldShowCurrentLocationButton && (
        <GPSButton
          type="button"
          onClick={handleCurrentLocationClick}
          style={{ bottom: currentLocationButtonBottom }}
          aria-label="현재 위치로 이동"
        >
          <IconGPS />
        </GPSButton>
      )}

      <ResultListOverlay
        items={resultItems}
        height={resultSheetHeight}
        title={resultSheetTitle}
        selectedId={selectedId}
        isLoading={isLoading}
        onHeightChange={setResultSheetHeight}
        onSelect={handleResultClick}
      />
    </PageContainer>
  )
}

const PageContainer = render.section('relative h-full w-full overflow-hidden bg-white')

const GPSButton = render.button(
  'absolute left-16 z-40 flex h-38 w-38 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none transition-[bottom] duration-300 ease-out',
)

export default MapSearchPage
