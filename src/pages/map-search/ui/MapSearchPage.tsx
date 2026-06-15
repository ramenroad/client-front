import { RamenCalendarAddEntry } from '@/features/ramen-calendar-add-entry'
import { IconBookmark, IconGPS } from '@/shared/ui/icon'
import { Modal } from '@/shared/ui/modal'
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
    focusOffsetRatio,
    isSearchBarHidden,
    searchBarBottomPx,
    bookmarkedIds,
    isSavedMode,
    isLoginModalOpen,
    calendarAddTarget,
    todayVisitDate,
    handleBookmarkToggle,
    handleCalendarAddOpen,
    handleCalendarAddClose,
    handleNavigateCalendarPage,
    handleToggleSavedMode,
    handleCloseLoginModal,
    handleNavigateLoginPage,
    handleSearchBarOverlapChange,
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
        isHidden={isSearchBarHidden}
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
        focusOffsetRatio={focusOffsetRatio}
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

      {shouldShowCurrentLocationButton && (
        <SavedFilterButton
          type="button"
          data-active={isSavedMode}
          onClick={handleToggleSavedMode}
          style={{ bottom: currentLocationButtonBottom }}
          aria-pressed={isSavedMode}
          aria-label="저장한 매장만 보기"
        >
          <IconBookmark active={isSavedMode} size={20} />
        </SavedFilterButton>
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
        searchBarBottomPx={searchBarBottomPx}
        bookmarkedIds={bookmarkedIds}
        onHeightChange={setResultSheetHeight}
        onSearchBarOverlapChange={handleSearchBarOverlapChange}
        onFilterChange={setFilterOptions}
        onSelect={handleResultClick}
        onOpenDetail={handleOpenDetailSheet}
        onCloseDetail={handleCloseDetailSheet}
        onBookmarkToggle={handleBookmarkToggle}
        onCalendarAddOpen={handleCalendarAddOpen}
      />

      {calendarAddTarget && (
        <RamenCalendarAddEntry
          visitDate={todayVisitDate}
          initialRamenya={calendarAddTarget}
          createSuccessToastAction={(visitDate) => (
            <ToastShortcutButton type="button" onClick={() => handleNavigateCalendarPage(visitDate)}>
              캘린더 확인
            </ToastShortcutButton>
          )}
          onClose={handleCalendarAddClose}
        />
      )}

      <Modal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal}>
        <ModalContent>
          <ModalTextBox>
            <ModalTitle>로그인이 필요해요</ModalTitle>
            <ModalText>로그인 하시겠습니까?</ModalText>
          </ModalTextBox>
          <ModalButtonBox>
            <ModalCancelButton type="button" onClick={handleCloseLoginModal}>
              취소
            </ModalCancelButton>
            <ModalConfirmButton type="button" onClick={handleNavigateLoginPage}>
              확인
            </ModalConfirmButton>
          </ModalButtonBox>
        </ModalContent>
      </Modal>
    </>
  )
}

const ModalContent = render.div('flex w-290 flex-col items-center justify-center gap-16 rounded-12 bg-white pt-32')

const ModalTextBox = render.div('flex flex-col')

const ModalTitle = render.div('text-center font-16-sb text-gray-900')

const ModalText = render.div('text-center font-16-r text-gray-900')

const ModalButtonBox = render.div('flex h-60 w-full')

const ModalCancelButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-black')

const ModalConfirmButton = render.button('w-full cursor-pointer border-none bg-transparent font-16-r text-orange')

const ToastShortcutButton = render.button(
  'cursor-pointer whitespace-nowrap border-none bg-transparent p-0 font-14-sb text-orange shadow-none outline-none',
)

const GPSButton = render.button(
  'absolute left-16 z-40 flex h-38 w-38 cursor-pointer items-center justify-center border-none bg-transparent p-0 shadow-none outline-none transition-[bottom] duration-300 ease-out',
)

const SavedFilterButton = render.button(
  'absolute right-16 z-40 flex h-38 w-38 cursor-pointer items-center justify-center rounded-full border border-solid border-gray-100 bg-white p-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)] outline-none transition-[bottom] duration-300 ease-out data-[active=true]:border-orange',
)

export default MapSearchPage
