import { IconGPS } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { SearchOverlay } from '@/widgets/map/search-overlay'
import { NaverMap } from '@/widgets/map/naver-map'
import { RefreshOverlay } from '@/widgets/map/refresh-overlay'
import { ResultListOverlay } from '@/widgets/map/result-list-overlay'
import { FilterSection } from '@/widgets/ramenya'
import { ReviewCard } from '@/widgets/review'
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
    filterOptions,
    setFilterOptions,
    detail,
    detailReviews,
    detailSheetId,
    isDetailSheetOpen,
    isDetailLoading,
    isDetailError,
    isDetailReviewsLoading,
    isDetailReviewsError,
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
    handleOpenDetailSheet,
    handleCloseDetailSheet,
    handleCurrentLocationClick,
  } = useMapSearchPage()

  return (
    <>
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
        FilterSection={FilterSection}
        ReviewCard={ReviewCard}
        items={resultItems}
        height={resultSheetHeight}
        selectedId={selectedId}
        currentLocation={currentLocation}
        filterOptions={filterOptions}
        detail={detail}
        detailReviews={detailReviews}
        detailId={detailSheetId}
        isDetailOpen={isDetailSheetOpen}
        isDetailLoading={isDetailLoading}
        isDetailError={isDetailError}
        isDetailReviewsLoading={isDetailReviewsLoading}
        isDetailReviewsError={isDetailReviewsError}
        onHeightChange={setResultSheetHeight}
        onFilterChange={setFilterOptions}
        onSelect={handleResultClick}
        onOpenDetail={handleOpenDetailSheet}
        onCloseDetail={handleCloseDetailSheet}
      />
    </>
  )
}

const GPSButton = render.button(
  'absolute left-16 z-40 flex h-38 w-38 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none transition-[bottom] duration-300 ease-out',
)

export default MapSearchPage
