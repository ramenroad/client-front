import { useCallback, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNearbyRamenyasQuery } from '@/entities/ramenya/api'
import { RAMENYA_LOCATION_LIST, type NearbyRamenya } from '@/entities/ramenya/model'
import { useSearchResultsQuery } from '@/entities/search/api'
import type { SearchResult } from '@/entities/search/model'
import type { Coordinate, MapViewportSnapshot } from '@/shared/lib/naver-map'
import { useToast } from '@/shared/ui/toast'
import type { NaverMapFocusRequest, NaverMapMarker } from '@/widgets/map/naver-map'
import { MAP_RESULT_SHEET_HEIGHTS, type MapResultSheetHeight } from '@/widgets/map/result-list-overlay'

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

const normalizeSearchText = (value: string) => value.trim().toLowerCase()

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
  const [resultSheetHeight, setResultSheetHeight] = useState<MapResultSheetHeight>(MAP_RESULT_SHEET_HEIGHTS.HALF)
  const isFirstIdleRef = useRef(true)
  const suppressNextIdleRef = useRef(false)
  const { openToast } = useToast()

  const selectedId = searchParams.get('selectedId')
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

  const ramenyaList = useMemo<MapRamenya[]>(() => {
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
        genre: ramenya.genre,
        thumbnailUrl: ramenya.thumbnailUrl || '',
        rating: ramenya.rating,
        reviewCount: ramenya.reviewCount,
        ramenya,
      })),
    [ramenyaList],
  )

  const isLoading = trimmedKeyword
    ? searchQuery.isFetching || (shouldSearchGloballyAsFallback && globalFallbackSearchQuery.isFetching)
    : nearbyQuery.isFetching
  const resultSheetTitle = (() => {
    if (!trimmedKeyword) {
      return '주변 라멘야'
    }

    if (isUsingGlobalSearchFallback) {
      return '전체 검색 결과'
    }

    return isMapScopedSearch ? '현 지도 검색 결과' : '검색 결과'
  })()
  const shouldShowCurrentLocationButton = resultSheetHeight !== MAP_RESULT_SHEET_HEIGHTS.EXPANDED
  const currentLocationButtonBottom = `calc(${resultSheetHeight} + 16px)`

  const setSelectedRamenya = useCallback(
    (ramenya: MapRamenya) => {
      const ramenyaId = getRamenyaId(ramenya)
      suppressNextIdleRef.current = true
      setResultSheetHeight((prev) =>
        prev === MAP_RESULT_SHEET_HEIGHTS.COLLAPSED ? MAP_RESULT_SHEET_HEIGHTS.HALF : prev,
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
          }),
        { replace: true },
      )
    },
    [setSearchParams],
  )

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
    resultSheetTitle,
    needsRefresh,
    currentLocation,
    focusRequest: mapFocusRequest,
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
    handleMarkerClick: setSelectedRamenya,
    handleResultClick: setSelectedRamenya,
    handleCurrentLocationClick,
  }
}

export type { MapRamenya }
