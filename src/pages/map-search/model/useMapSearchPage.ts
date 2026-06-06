import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNearbyRamenyasQuery, useRamenyaDetailQuery } from '@/entities/ramenya/api'
import {
  checkBusinessStatus,
  initialFilterOptions,
  OpenStatus,
  RAMENYA_LOCATION_LIST,
  SortType,
  type FilterOptions,
  type NearbyRamenya,
} from '@/entities/ramenya/model'
import { useRamenyaReviewsInfiniteQuery } from '@/entities/review/api'
import { useSearchResultsQuery } from '@/entities/search/api'
import type { SearchResult } from '@/entities/search/model'
import type { Coordinate, MapViewportSnapshot } from '@/shared/lib/naver-map'
import { calculateDistanceValue } from '@/shared/lib/number'
import { useToast } from '@/shared/ui/toast'
import type { NaverMapFocusRequest, NaverMapMarker } from '@/widgets/map/naver-map'
import {
  MAP_RESULT_SHEET_HEIGHTS,
  MAP_RESULT_SHEET_CONTENT_MIN_DVH,
  MAP_RESULT_SHEET_MAX_DVH,
  MAP_RESULT_SHEET_MIN_DVH,
  parseSheetDvh,
} from '@/widgets/map/result-list-overlay'

type MapRamenya = NearbyRamenya | SearchResult

type SearchArea = {
  latitude: number
  longitude: number
  radius: number
}

type SyncSearchAreaOptions = {
  enableMapScopedSearch?: boolean
}

const DEFAULT_CENTER: Coordinate = {
  latitude: RAMENYA_LOCATION_LIST[0].location.latitude,
  longitude: RAMENYA_LOCATION_LIST[0].location.longitude,
}

const DEFAULT_ZOOM = 14
const DEFAULT_RADIUS = 3_000
const MAP_FILTER_STORAGE_KEY = 'mapPageFilterOptions'
const MAP_SHEET_HEIGHT_STORAGE_KEY = 'mapPageSheetHeight'
// 시트는 앱바 바로 위(bottom-0)에 붙으므로 추가 하단 오프셋 없음.
const MAP_SHEET_BOTTOM_OFFSET = 0
const MAP_FLOATING_BUTTON_GAP = 16
// 검색창(top-16 h-48 => 하단 64px) + 여유 12px. 시트 상단이 이 지점보다 위로 올라오면 검색창을 숨긴다.
const MAP_SEARCH_BAR_BOTTOM_PX = 76
// 이 높이(dvh) 이상에서는 현재 위치 버튼을 숨긴다(시트가 화면 상단까지 올라온 상태).
const MAP_CURRENT_LOCATION_BUTTON_HIDE_DVH = 70
const sortValues = Object.values(SortType)

const isFilterOptions = (value: unknown): value is FilterOptions => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const filterOptions = value as Partial<FilterOptions>

  return (
    typeof filterOptions.isOpen === 'boolean' &&
    typeof filterOptions.sort === 'string' &&
    sortValues.includes(filterOptions.sort as SortType) &&
    Array.isArray(filterOptions.genre) &&
    filterOptions.genre.every((genre) => typeof genre === 'string')
  )
}

const getInitialFilterOptions = (): FilterOptions => {
  if (typeof window === 'undefined') {
    return initialFilterOptions
  }

  try {
    const storedFilterOptions = window.sessionStorage.getItem(MAP_FILTER_STORAGE_KEY)

    if (!storedFilterOptions) {
      return initialFilterOptions
    }

    const parsedFilterOptions: unknown = JSON.parse(storedFilterOptions)

    return isFilterOptions(parsedFilterOptions) ? parsedFilterOptions : initialFilterOptions
  } catch {
    return initialFilterOptions
  }
}

const saveFilterOptions = (filterOptions: FilterOptions) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(MAP_FILTER_STORAGE_KEY, JSON.stringify(filterOptions))
}

const isStoredSheetHeight = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.endsWith('dvh')) {
    return false
  }

  const dvh = parseFloat(value)
  return Number.isFinite(dvh) && dvh >= MAP_RESULT_SHEET_MIN_DVH && dvh <= MAP_RESULT_SHEET_MAX_DVH
}

const getInitialSheetHeight = (): string => {
  if (typeof window === 'undefined') {
    return MAP_RESULT_SHEET_HEIGHTS.HALF
  }

  const storedSheetHeight = window.sessionStorage.getItem(MAP_SHEET_HEIGHT_STORAGE_KEY)

  return isStoredSheetHeight(storedSheetHeight) ? storedSheetHeight : MAP_RESULT_SHEET_HEIGHTS.HALF
}

const saveSheetHeight = (sheetHeight: string) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(MAP_SHEET_HEIGHT_STORAGE_KEY, sheetHeight)
}

const parseNumberParam = (value: string | null) => {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const createSearchAreaFromViewport = (viewport: MapViewportSnapshot): SearchArea => ({
  latitude: viewport.center.latitude,
  longitude: viewport.center.longitude,
  radius: viewport.radius,
})

const getInitialArea = (searchParams: URLSearchParams): SearchArea | null => {
  const latitude = parseNumberParam(searchParams.get('latitude'))
  const longitude = parseNumberParam(searchParams.get('longitude'))
  const radius = parseNumberParam(searchParams.get('radius'))

  if (latitude === undefined || longitude === undefined || radius === undefined) {
    return null
  }

  return { latitude, longitude, radius }
}

const getInitialCenter = (searchParams: URLSearchParams): Coordinate => {
  const latitude = parseNumberParam(searchParams.get('latitude'))
  const longitude = parseNumberParam(searchParams.get('longitude'))

  if (latitude === undefined || longitude === undefined) {
    return DEFAULT_CENTER
  }

  return { latitude, longitude }
}

const getRamenyaId = (ramenya: MapRamenya) => ramenya._id

const getReviewCreatedTime = (createdAt?: string) => {
  return createdAt ? new Date(createdAt).getTime() : 0
}

const normalizeSearchText = (value: string) => value.trim().toLowerCase()

const isInactiveRamenya = (ramenya: MapRamenya) => {
  const { status } = checkBusinessStatus(ramenya.businessHours)

  return status !== OpenStatus.OPEN
}

const matchesOpenFilter = (ramenya: MapRamenya) => {
  return checkBusinessStatus(ramenya.businessHours).status === OpenStatus.OPEN
}

const matchesGenreFilter = (ramenya: MapRamenya, genres: string[]) => {
  return genres.every((selectedGenre) => ramenya.genre.includes(selectedGenre))
}

const sortByDistance = (ramenyas: MapRamenya[], currentLocation?: Coordinate | null) => {
  if (!currentLocation) {
    return ramenyas
  }

  return [...ramenyas].sort(
    (a, b) =>
      calculateDistanceValue(currentLocation, { latitude: a.latitude, longitude: a.longitude }) -
      calculateDistanceValue(currentLocation, { latitude: b.latitude, longitude: b.longitude }),
  )
}

const filterMapRamenyas = (
  ramenyas: MapRamenya[],
  filterOptions: FilterOptions,
  currentLocation?: Coordinate | null,
) => {
  let filteredRamenyas = ramenyas

  if (filterOptions.isOpen) {
    filteredRamenyas = filteredRamenyas.filter(matchesOpenFilter)
  }

  if (filterOptions.genre.length > 0) {
    filteredRamenyas = filteredRamenyas.filter((ramenya) => matchesGenreFilter(ramenya, filterOptions.genre))
  }

  if (filterOptions.sort === SortType.DISTANCE) {
    return sortByDistance(filteredRamenyas, currentLocation)
  }

  if (filterOptions.sort === SortType.RATING) {
    return [...filteredRamenyas].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  return filteredRamenyas
}

const findAutoFocusRamenya = ({
  query,
  ramenyas,
}: {
  query: string
  ramenyas: MapRamenya[]
}) => {
  if (ramenyas.length === 0) {
    return null
  }

  const normalizedQuery = normalizeSearchText(query)
  const exactMatch = ramenyas.find((ramenya) => normalizeSearchText(ramenya.name) === normalizedQuery)

  return exactMatch ?? (ramenyas.length === 1 ? ramenyas[0] : null)
}

const updateMapSearchParams = (
  prev: URLSearchParams,
  updater: (nextParams: URLSearchParams) => void,
) => {
  const nextParams = new URLSearchParams(prev)
  updater(nextParams)
  return nextParams
}

const getCurrentPosition = () => {
  return new Promise<Coordinate>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      reject,
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    )
  })
}

export const useMapSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCenter = useMemo(() => getInitialCenter(searchParams), [searchParams])
  const initialZoom = useMemo(() => parseNumberParam(searchParams.get('level')) ?? DEFAULT_ZOOM, [searchParams])
  const initialKeyword = searchParams.get('keyword') ?? ''
  const [keyword, setKeyword] = useState(initialKeyword)
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword)
  const [searchArea, setSearchArea] = useState<SearchArea | null>(() => getInitialArea(searchParams))
  const [viewport, setViewport] = useState<MapViewportSnapshot | null>(null)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null)
  const [focusRequest, setFocusRequest] = useState<NaverMapFocusRequest | null>(null)
  const [resultSheetHeight, setResultSheetHeight] = useState<string>(getInitialSheetHeight)
  const [isSearchBarHidden, setIsSearchBarHidden] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(getInitialFilterOptions)
  const isFirstIdleRef = useRef(true)
  const suppressNextIdleRef = useRef(false)
  const { openToast } = useToast()

  useEffect(() => {
    let isCancelled = false

    if (!navigator.geolocation) {
      return
    }

    getCurrentPosition()
      .then((nextLocation) => {
        if (!isCancelled) {
          setCurrentLocation(nextLocation)
        }
      })
      .catch(() => undefined)

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    saveFilterOptions(filterOptions)
  }, [filterOptions])

  useEffect(() => {
    saveSheetHeight(resultSheetHeight)
  }, [resultSheetHeight])

  const selectedId = searchParams.get('selectedId')
  const detailSheetId = searchParams.get('sheet') === 'detail' ? selectedId : null
  const trimmedKeyword = searchKeyword.trim()
  const isMapScopedSearch = searchParams.get('nearBy') === 'true'

  const nearbyParams = useMemo(() => {
    if (trimmedKeyword || !searchArea) {
      return null
    }

    return searchArea
  }, [searchArea, trimmedKeyword])

  const searchResultParams = useMemo(() => {
    if (!trimmedKeyword) {
      return null
    }

    if (!isMapScopedSearch) {
      return {
        query: trimmedKeyword,
      }
    }

    if (!searchArea) {
      return null
    }

    return {
      query: trimmedKeyword,
      latitude: searchArea.latitude,
      longitude: searchArea.longitude,
      radius: searchArea.radius,
      inLocation: true,
    }
  }, [isMapScopedSearch, searchArea, trimmedKeyword])

  const nearbyQuery = useNearbyRamenyasQuery(nearbyParams, {
    staleTime: 30_000,
  })
  const searchQuery = useSearchResultsQuery(searchResultParams, {
    staleTime: 30_000,
  })
  const detailQuery = useRamenyaDetailQuery(detailSheetId ?? '', {
    enabled: Boolean(detailSheetId),
    staleTime: 30_000,
  })
  const detailReviewsQuery = useRamenyaReviewsInfiniteQuery(
    { ramenyaId: detailSheetId ?? '', limit: 3 },
    {
      enabled: Boolean(detailSheetId),
      staleTime: 30_000,
    },
  )
  const shouldSearchGloballyAsFallback = Boolean(
    trimmedKeyword && isMapScopedSearch && searchQuery.isSuccess && (searchQuery.data?.length ?? 0) === 0,
  )
  const globalFallbackSearchQuery = useSearchResultsQuery(
    shouldSearchGloballyAsFallback
      ? {
          query: trimmedKeyword,
        }
      : null,
    {
      staleTime: 30_000,
    },
  )
  const isUsingGlobalSearchFallback = shouldSearchGloballyAsFallback
  const isGlobalSearchResult = Boolean(trimmedKeyword && (!isMapScopedSearch || isUsingGlobalSearchFallback))

  const rawRamenyaList = useMemo<MapRamenya[]>(() => {
    if (trimmedKeyword) {
      return isUsingGlobalSearchFallback ? (globalFallbackSearchQuery.data ?? []) : (searchQuery.data ?? [])
    }

    return nearbyQuery.data?.ramenyas ?? []
  }, [
    globalFallbackSearchQuery.data,
    isUsingGlobalSearchFallback,
    nearbyQuery.data?.ramenyas,
    searchQuery.data,
    trimmedKeyword,
  ])
  const ramenyaList = useMemo(
    () => filterMapRamenyas(rawRamenyaList, filterOptions, currentLocation),
    [currentLocation, filterOptions, rawRamenyaList],
  )

  const autoFocusRamenya = useMemo(() => {
    if (!isGlobalSearchResult || selectedId) {
      return null
    }

    return findAutoFocusRamenya({
      query: trimmedKeyword,
      ramenyas: ramenyaList,
    })
  }, [isGlobalSearchResult, ramenyaList, selectedId, trimmedKeyword])

  const effectiveSelectedId = selectedId ?? (autoFocusRamenya ? getRamenyaId(autoFocusRamenya) : null)
  const autoFocusRequest = useMemo<NaverMapFocusRequest | null>(() => {
    if (!autoFocusRamenya) {
      return null
    }

    return {
      id: `search-${getRamenyaId(autoFocusRamenya)}-${searchQuery.dataUpdatedAt}-${globalFallbackSearchQuery.dataUpdatedAt}`,
      position: {
        latitude: autoFocusRamenya.latitude,
        longitude: autoFocusRamenya.longitude,
      },
    }
  }, [autoFocusRamenya, globalFallbackSearchQuery.dataUpdatedAt, searchQuery.dataUpdatedAt])
  const mapFocusRequest = focusRequest ?? autoFocusRequest

  const selectedRamenya = useMemo(
    () => ramenyaList.find((ramenya) => getRamenyaId(ramenya) === effectiveSelectedId) ?? null,
    [effectiveSelectedId, ramenyaList],
  )

  const markerData = useMemo<NaverMapMarker<MapRamenya>[]>(
    () =>
      ramenyaList.map((ramenya) => ({
        id: getRamenyaId(ramenya),
        position: {
          latitude: ramenya.latitude,
          longitude: ramenya.longitude,
        },
        title: ramenya.name,
        inactive: isInactiveRamenya(ramenya),
        data: ramenya,
      })),
    [ramenyaList],
  )

  const resultItems = useMemo(
    () =>
      ramenyaList.map((ramenya) => ({
        id: getRamenyaId(ramenya),
        name: ramenya.name,
        address: ramenya.address,
        latitude: ramenya.latitude,
        longitude: ramenya.longitude,
        genre: ramenya.genre,
        thumbnailUrl: ramenya.thumbnailUrl || '',
        rating: ramenya.rating,
        reviewCount: ramenya.reviewCount,
        businessHours: ramenya.businessHours,
        ramenya,
      })),
    [ramenyaList],
  )
  const detailReviews = useMemo(
    () =>
      (detailReviewsQuery.data?.pages.flatMap((page) => page.reviews) ?? [])
        .sort((a, b) => getReviewCreatedTime(b.createdAt) - getReviewCreatedTime(a.createdAt))
        .slice(0, 3),
    [detailReviewsQuery.data],
  )

  const isLoading = trimmedKeyword
    ? searchQuery.isFetching || (shouldSearchGloballyAsFallback && globalFallbackSearchQuery.isFetching)
    : nearbyQuery.isFetching
  const isDetailSheetOpen = Boolean(detailSheetId)
  const shouldShowCurrentLocationButton = parseSheetDvh(resultSheetHeight) < MAP_CURRENT_LOCATION_BUTTON_HIDE_DVH
  const currentLocationButtonBottom = `calc(${resultSheetHeight} + ${
    MAP_SHEET_BOTTOM_OFFSET + MAP_FLOATING_BUTTON_GAP
  }px)`

  const handleSearchBarOverlapChange = useCallback((overlapping: boolean) => {
    setIsSearchBarHidden(overlapping)
  }, [])

  const setSelectedRamenya = useCallback(
    (ramenya: MapRamenya) => {
      const ramenyaId = getRamenyaId(ramenya)
      suppressNextIdleRef.current = true
      setResultSheetHeight((prev) =>
        parseSheetDvh(prev) <= MAP_RESULT_SHEET_CONTENT_MIN_DVH ? MAP_RESULT_SHEET_HEIGHTS.HALF : prev,
      )
      setFocusRequest({
        id: `${ramenyaId}-${Date.now()}`,
        position: {
          latitude: ramenya.latitude,
          longitude: ramenya.longitude,
        },
      })
      setSearchParams(
        (prev) =>
          updateMapSearchParams(prev, (nextParams) => {
            nextParams.set('selectedId', ramenyaId)
            nextParams.delete('sheet')
          }),
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const openDetailSheet = useCallback(
    (ramenya: MapRamenya) => {
      const ramenyaId = getRamenyaId(ramenya)

      suppressNextIdleRef.current = true
      setResultSheetHeight(MAP_RESULT_SHEET_HEIGHTS.EXPANDED)
      setFocusRequest({
        id: `detail-${ramenyaId}-${Date.now()}`,
        position: {
          latitude: ramenya.latitude,
          longitude: ramenya.longitude,
        },
      })
      setSearchParams((prev) =>
        updateMapSearchParams(prev, (nextParams) => {
          nextParams.set('selectedId', ramenyaId)
          nextParams.set('sheet', 'detail')
        }),
      )
    },
    [setSearchParams],
  )

  const closeDetailSheet = useCallback(() => {
    setResultSheetHeight(MAP_RESULT_SHEET_HEIGHTS.HALF)
    setSearchParams(
      (prev) =>
        updateMapSearchParams(prev, (nextParams) => {
          nextParams.delete('sheet')
        }),
      { replace: true },
    )
  }, [setSearchParams])

  const syncSearchAreaToUrl = useCallback(
    (area: SearchArea, zoom?: number, options?: SyncSearchAreaOptions) => {
      setSearchParams(
        (prev) =>
          updateMapSearchParams(prev, (nextParams) => {
            nextParams.set('latitude', area.latitude.toString())
            nextParams.set('longitude', area.longitude.toString())
            nextParams.set('radius', area.radius.toString())

            if (zoom !== undefined) {
              nextParams.set('level', zoom.toString())
            }

            if (!trimmedKeyword || options?.enableMapScopedSearch) {
              nextParams.set('nearBy', 'true')
            }

            nextParams.delete('selectedId')
            nextParams.delete('sheet')
          }),
        { replace: true },
      )
    },
    [setSearchParams, trimmedKeyword],
  )

  const handleMapReady = useCallback((nextViewport: MapViewportSnapshot) => {
    setViewport(nextViewport)
    setSearchArea((prev) => prev ?? createSearchAreaFromViewport(nextViewport))
  }, [])

  const handleMapIdle = useCallback((nextViewport: MapViewportSnapshot) => {
    setViewport(nextViewport)

    if (isFirstIdleRef.current) {
      isFirstIdleRef.current = false
      return
    }

    if (suppressNextIdleRef.current) {
      suppressNextIdleRef.current = false
      return
    }

    setNeedsRefresh(true)
  }, [])

  const handleRefresh = useCallback(() => {
    if (!viewport) {
      return
    }

    const nextArea = createSearchAreaFromViewport(viewport)
    setSearchArea(nextArea)
    setNeedsRefresh(false)
    setFocusRequest(null)
    syncSearchAreaToUrl(nextArea, viewport.zoom, {
      enableMapScopedSearch: true,
    })
  }, [syncSearchAreaToUrl, viewport])

  const handleKeywordSelect = useCallback(
    (nextKeyword: string, isNearBy?: boolean) => {
      const normalizedKeyword = nextKeyword.trim()

      setKeyword(normalizedKeyword)
      setSearchKeyword(normalizedKeyword)
      setNeedsRefresh(false)
      setFocusRequest(null)

      if (viewport) {
        setSearchArea(createSearchAreaFromViewport(viewport))
      }

      setSearchParams(
        (prev) =>
          updateMapSearchParams(prev, (nextParams) => {
            if (normalizedKeyword) {
              nextParams.set('keyword', normalizedKeyword)
            } else {
              nextParams.delete('keyword')
            }

            if (isNearBy) {
              nextParams.set('nearBy', 'true')
            } else {
              nextParams.delete('nearBy')
            }

            nextParams.delete('selectedId')
            nextParams.delete('sheet')
          }),
        { replace: true },
      )
    },
    [setSearchParams, viewport],
  )

  const handleKeywordClear = useCallback(() => {
    const nextArea = viewport ? createSearchAreaFromViewport(viewport) : searchArea

    setKeyword('')
    setSearchKeyword('')
    setNeedsRefresh(false)
    setFocusRequest(null)

    if (nextArea) {
      setSearchArea(nextArea)
    }

    setSearchParams(
      (prev) =>
        updateMapSearchParams(prev, (nextParams) => {
          nextParams.delete('keyword')
          nextParams.delete('selectedId')
          nextParams.delete('sheet')
          nextParams.set('nearBy', 'true')

          if (!nextArea) {
            return
          }

          nextParams.set('latitude', nextArea.latitude.toString())
          nextParams.set('longitude', nextArea.longitude.toString())
          nextParams.set('radius', nextArea.radius.toString())

          if (viewport?.zoom !== undefined) {
            nextParams.set('level', viewport.zoom.toString())
          }
        }),
      { replace: true },
    )
  }, [searchArea, setSearchParams, viewport])

  const handleCurrentLocationClick = useCallback(async () => {
    if (!navigator.geolocation) {
      openToast('이 브라우저에서는 위치 정보를 지원하지 않습니다.')
      return
    }

    try {
      const nextLocation = await getCurrentPosition()
      const nextArea = {
        latitude: nextLocation.latitude,
        longitude: nextLocation.longitude,
        radius: viewport?.radius ?? searchArea?.radius ?? DEFAULT_RADIUS,
      }

      suppressNextIdleRef.current = true
      setCurrentLocation(nextLocation)
      setSearchArea(nextArea)
      setNeedsRefresh(false)
      setFocusRequest({
        id: `current-${Date.now()}`,
        position: nextLocation,
      })
      syncSearchAreaToUrl(nextArea, viewport?.zoom ?? initialZoom)
    } catch {
      openToast('현재 위치를 확인하지 못했습니다. 위치 권한을 확인해주세요.')
    }
  }, [initialZoom, openToast, searchArea, syncSearchAreaToUrl, viewport])

  const handleMapFocusMove = useCallback(() => {
    suppressNextIdleRef.current = true
  }, [])

  return {
    initialCenter,
    initialZoom,
    keyword,
    setKeyword,
    ramenyaList,
    resultItems,
    selectedId: effectiveSelectedId,
    selectedRamenya,
    markerData,
    isLoading,
    filterOptions,
    setFilterOptions,
    detail: detailQuery.data,
    detailReviews,
    detailSheetId,
    isDetailSheetOpen,
    isDetailLoading: detailQuery.isFetching,
    isDetailError: detailQuery.isError,
    isDetailReviewsLoading: detailReviewsQuery.isFetching,
    isDetailReviewsError: detailReviewsQuery.isError,
    needsRefresh,
    currentLocation,
    focusRequest: mapFocusRequest,
    resultSheetHeight,
    setResultSheetHeight,
    shouldShowCurrentLocationButton,
    currentLocationButtonBottom,
    isSearchBarHidden,
    searchBarBottomPx: MAP_SEARCH_BAR_BOTTOM_PX,
    handleSearchBarOverlapChange,
    handleMapReady,
    handleMapIdle,
    handleMapFocusMove,
    handleRefresh,
    handleKeywordSelect,
    handleKeywordClear,
    handleMarkerClick: setSelectedRamenya,
    handleResultClick: setSelectedRamenya,
    handleOpenDetailSheet: openDetailSheet,
    handleCloseDetailSheet: closeDetailSheet,
    handleCurrentLocationClick,
  }
}

export type { MapRamenya }
