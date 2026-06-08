import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getViewportSnapshot,
  loadNaverMapScript,
  type Coordinate,
  type MapViewportSnapshot,
  type NaverMapEventListener,
  type NaverMapInstance,
  type NaverMaps,
  type NaverMarkerInstance,
} from '@/shared/lib/naver-map'
import render from '@/shared/ui/render'
import { LoadingLottie } from '@/shared/ui/lottie'
import { createCurrentLocationMarkerIcon, createRamenyaMarkerIcon } from './model/markerIcon'

export type NaverMapMarker<T> = {
  id: string
  position: Coordinate
  title?: string
  inactive?: boolean
  data: T
}

export type NaverMapFocusRequest = {
  id: string
  position: Coordinate
}

type MarkerInstanceEntry<T> = {
  instance: NaverMarkerInstance
  marker: NaverMapMarker<T>
}

interface NaverMapProps<T> {
  initialCenter: Coordinate
  initialZoom?: number
  markers: NaverMapMarker<T>[]
  selectedMarkerId?: string | null
  currentLocation?: Coordinate | null
  focusRequest?: NaverMapFocusRequest | null
  // 포커스 이동 시 대상을 화면 중앙보다 이 비율(뷰포트 높이 대비)만큼 위로 올린다. 0이면 정중앙.
  focusOffsetRatio?: number
  onMapReady?: (viewport: MapViewportSnapshot) => void
  onMapIdle?: (viewport: MapViewportSnapshot) => void
  onFocusMove?: () => void
  onMarkerClick?: (markerData: T) => void
}

const DEFAULT_ZOOM = 14
const DEFAULT_RAMENYA_MARKER_Z_INDEX = 100
const CURRENT_LOCATION_MARKER_Z_INDEX = 500
const SELECTED_RAMENYA_MARKER_Z_INDEX = 1_000

// 하단시트가 쓰는 기준과 동일하게 동적 뷰포트 높이를 사용한다.
const getViewportHeight = () => window.visualViewport?.height || window.innerHeight

// 화면 수직 픽셀 거리를 위도 차이로 환산한다(웹 메르카토르 근사, 줌이 클수록 1px당 위도 차가 작다).
const EQUATOR_METERS_PER_PIXEL_AT_ZOOM_0 = 156543.03392
const METERS_PER_LATITUDE_DEGREE = 111_320
const pixelsToLatitudeDelta = (latitude: number, pixels: number, zoom: number) => {
  const metersPerPixel = (EQUATOR_METERS_PER_PIXEL_AT_ZOOM_0 * Math.cos((latitude * Math.PI) / 180)) / 2 ** zoom
  return (pixels * metersPerPixel) / METERS_PER_LATITUDE_DEGREE
}

const getRamenyaMarkerZIndex = (markerId: string, selectedMarkerId?: string | null) => {
  return markerId === selectedMarkerId ? SELECTED_RAMENYA_MARKER_Z_INDEX : DEFAULT_RAMENYA_MARKER_Z_INDEX
}

export const NaverMap = <T,>({
  initialCenter,
  initialZoom = DEFAULT_ZOOM,
  markers,
  selectedMarkerId,
  currentLocation,
  focusRequest,
  focusOffsetRatio = 0,
  onMapReady,
  onMapIdle,
  onFocusMove,
  onMarkerClick,
}: NaverMapProps<T>) => {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<NaverMapInstance | null>(null)
  const mapsRef = useRef<NaverMaps | null>(null)
  const markerInstancesRef = useRef<MarkerInstanceEntry<T>[]>([])
  const markerListenersRef = useRef<NaverMapEventListener[]>([])
  const markerIconFrameRef = useRef<number | null>(null)
  const currentLocationMarkerRef = useRef<NaverMarkerInstance | null>(null)
  const focusOffsetRatioRef = useRef(focusOffsetRatio)
  const [status, setStatus] = useState<'error' | 'loading' | 'ready'>('loading')

  const markerSnapshotKey = useMemo(
    () =>
      markers
        .map(
          (marker) =>
            `${marker.id}:${marker.position.latitude}:${marker.position.longitude}:${marker.title ?? ''}:${marker.inactive ? 'inactive' : 'active'}`,
        )
        .join('|'),
    [markers],
  )

  const updateRamenyaMarkerIcons = useCallback(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps) {
      return
    }

    const zoom = map.getZoom()

    markerInstancesRef.current.forEach(({ instance, marker }) => {
      const isSelected = marker.id === selectedMarkerId

      instance.setIcon(
        createRamenyaMarkerIcon({
          maps,
          inactive: marker.inactive,
          isSelected,
          title: marker.title,
          zoom,
        }),
      )
      instance.setZIndex(getRamenyaMarkerZIndex(marker.id, selectedMarkerId))
    })
  }, [selectedMarkerId])

  const scheduleRamenyaMarkerIconUpdate = useCallback(() => {
    if (markerIconFrameRef.current !== null) {
      window.cancelAnimationFrame(markerIconFrameRef.current)
    }

    markerIconFrameRef.current = window.requestAnimationFrame(() => {
      markerIconFrameRef.current = null
      updateRamenyaMarkerIcons()
    })
  }, [updateRamenyaMarkerIcons])

  useEffect(() => {
    let isCancelled = false
    const mapElement = mapElementRef.current

    if (!mapElement) {
      return
    }

    loadNaverMapScript()
      .then((maps) => {
        if (isCancelled || mapRef.current) {
          return
        }

        mapsRef.current = maps

        const map = new maps.Map(mapElement, {
          center: new maps.LatLng(initialCenter.latitude, initialCenter.longitude),
          zoom: initialZoom,
          mapDataControl: false,
          mapTypeControl: false,
          scaleControl: false,
          zoomControl: false,
        })

        mapRef.current = map
        setStatus('ready')
        onMapReady?.(getViewportSnapshot(map))
      })
      .catch(() => {
        if (!isCancelled) {
          setStatus('error')
        }
      })

    return () => {
      isCancelled = true
    }
  }, [initialCenter.latitude, initialCenter.longitude, initialZoom, onMapReady])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps) {
      return
    }

    const idleListener = maps.Event.addListener(map, 'idle', () => {
      scheduleRamenyaMarkerIconUpdate()
      onMapIdle?.(getViewportSnapshot(map))
    })

    return () => {
      maps.Event.removeListener(idleListener)
    }
  }, [onMapIdle, scheduleRamenyaMarkerIconUpdate, status])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps) {
      return
    }

    markerListenersRef.current.forEach((listener) => maps.Event.removeListener(listener))
    markerListenersRef.current = []
    markerInstancesRef.current.forEach(({ instance }) => instance.setMap(null))
    markerInstancesRef.current = []

    const zoom = map.getZoom()

    markers.forEach((marker) => {
      const markerInstance = new maps.Marker({
        map,
        position: new maps.LatLng(marker.position.latitude, marker.position.longitude),
        icon: createRamenyaMarkerIcon({
          maps,
          inactive: marker.inactive,
          isSelected: false,
          title: marker.title,
          zoom,
        }),
        clickable: true,
        zIndex: DEFAULT_RAMENYA_MARKER_Z_INDEX,
      })

      const clickListener = maps.Event.addListener(markerInstance, 'click', () => {
        onMarkerClick?.(marker.data)
      })

      markerInstancesRef.current.push({
        instance: markerInstance,
        marker,
      })
      markerListenersRef.current.push(clickListener)
    })
  }, [markerSnapshotKey, markers, onMarkerClick, status])

  useEffect(() => {
    if (!mapsRef.current) {
      return
    }

    updateRamenyaMarkerIcons()
  }, [markerSnapshotKey, status, updateRamenyaMarkerIcons])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps) {
      return
    }

    const zoomListener = maps.Event.addListener(map, 'zoom_changed', () => {
      scheduleRamenyaMarkerIconUpdate()
    })

    return () => {
      maps.Event.removeListener(zoomListener)
    }
  }, [scheduleRamenyaMarkerIconUpdate, status])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps || !currentLocation) {
      currentLocationMarkerRef.current?.setMap(null)
      currentLocationMarkerRef.current = null
      return
    }

    const position = new maps.LatLng(currentLocation.latitude, currentLocation.longitude)

    if (!currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current = new maps.Marker({
        map,
        position,
        icon: createCurrentLocationMarkerIcon(maps),
        clickable: false,
        zIndex: CURRENT_LOCATION_MARKER_Z_INDEX,
      })
      return
    }

    currentLocationMarkerRef.current.setPosition(position)
    currentLocationMarkerRef.current.setZIndex(CURRENT_LOCATION_MARKER_Z_INDEX)
  }, [currentLocation, status])

  // 최신 오프셋 비율만 클로저로 읽어, 시트 드래그로 비율이 바뀔 때마다 포커스가 재실행돼
  // 지도가 튀는 것을 막는다(포커스 effect 의존성에는 focusOffsetRatio를 넣지 않는다).
  useEffect(() => {
    focusOffsetRatioRef.current = focusOffsetRatio
  }, [focusOffsetRatio])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps || !focusRequest) {
      return
    }

    onFocusMove?.()

    const { latitude, longitude } = focusRequest.position
    // 하단시트에 가려지지 않도록 중심을 대상보다 남쪽으로 옮겨, 대상이 화면 중앙보다 위에 오게 한다.
    // 위경도를 직접 옮기므로 단일 panTo로 부드럽게 이동하고, 북쪽 기준(회전 없음) 지도라 방향이 보장된다.
    const offsetPx = getViewportHeight() * focusOffsetRatioRef.current
    const latitudeShift = offsetPx > 0 ? pixelsToLatitudeDelta(latitude, offsetPx, map.getZoom()) : 0
    map.panTo(new maps.LatLng(latitude - latitudeShift, longitude))
  }, [focusRequest, onFocusMove, status])

  useEffect(() => {
    return () => {
      const maps = mapsRef.current

      if (markerIconFrameRef.current !== null) {
        window.cancelAnimationFrame(markerIconFrameRef.current)
      }

      if (maps) {
        markerListenersRef.current.forEach((listener) => maps.Event.removeListener(listener))
      }

      markerInstancesRef.current.forEach(({ instance }) => instance.setMap(null))
      currentLocationMarkerRef.current?.setMap(null)
      mapRef.current?.destroy?.()
    }
  }, [])

  return (
    <MapWrapper>
      <NaverMapComponent ref={mapElementRef} />
      {status === 'loading' && (
        <MapStatusLayer>
          <LoadingLottie className="h-80 w-80" />
          <StatusText>지도를 불러오는 중</StatusText>
        </MapStatusLayer>
      )}
      {status === 'error' && (
        <MapStatusLayer>
          <ErrorTitle>지도를 불러오지 못했습니다</ErrorTitle>
          <StatusText>VITE_NAVER_MAP_CLIENT_ID 설정을 확인해주세요.</StatusText>
        </MapStatusLayer>
      )}
    </MapWrapper>
  )
}

const MapWrapper = render.article('relative h-full w-full overflow-hidden')

const NaverMapComponent = render.div('h-full w-full')

const MapStatusLayer = render.div(
  'absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-white/90 text-center',
)

const ErrorTitle = render.span('m-0 font-16-sb text-gray-900')

const StatusText = render.span('m-0 font-14-r text-gray-500')
