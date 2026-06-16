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

// 언마운트/HMR 시 맵·리스너가 이미 파기됐는데 cleanup이 돌면 네이버 내부에서 throw(`x.isArray` null) 한다.
// 리스너 해제는 best-effort라 실패를 삼켜 React commit 단계가 깨지지 않게 한다.
const safeRemoveListener = (maps: NaverMaps | null, listener: NaverMapEventListener) => {
  if (!maps) {
    return
  }
  try {
    maps.Event.removeListener(listener)
  } catch {
    // 이미 해제/파기됨 — 무시.
  }
}

// 마커 해제도 동일하게 best-effort — 파기된 맵의 마커에 setMap(null)을 호출하면 네이버 내부에서
// throw(`x.capitalize` null 등) 한다. cleanup이 React commit 단계를 깨지 않게 삼킨다.
const safeSetMapNull = (instance: NaverMarkerInstance | null | undefined) => {
  if (!instance) {
    return
  }
  try {
    instance.setMap(null)
  } catch {
    // 이미 파기됨 — 무시.
  }
}

const safeDestroyMap = (map: NaverMapInstance | null) => {
  if (!map) {
    return
  }
  try {
    map.destroy?.()
  } catch {
    // 이미 파기됨 — 무시.
  }
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

    // rAF/맵 이벤트로 지연 실행되는 사이 맵이 파기되면(상세→뒤로/공유 토스트 리렌더 등) SDK 전역이 사라져
    // setIcon 내부에서 throw(`x.LatLng` null) 하고 React commit이 깨진다. 전역 SDK를 한 번 더 확인한다.
    if (!window.naver?.maps) {
      return
    }

    const zoom = map.getZoom()

    markerInstancesRef.current.forEach(({ instance, marker }) => {
      const isSelected = marker.id === selectedMarkerId

      // 개별 마커가 이미 맵에서 떨어졌으면(setMap(null)) setIcon이 네이버 내부에서 throw 한다 — best-effort로 삼킨다.
      try {
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
      } catch {
        // 파기/경합 중인 마커 — 무시.
      }
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
      safeRemoveListener(maps, idleListener)
    }
  }, [onMapIdle, scheduleRamenyaMarkerIconUpdate, status])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps) {
      return
    }

    // 토스트/리렌더로 markers 참조가 바뀌어 이 effect가 재실행되는 사이 맵이 파기되면
    // new maps.Marker가 네이버 내부에서 throw(`x.LatLng` null) 한다 — 전역 SDK를 한 번 더 확인한다.
    if (!window.naver?.maps) {
      return
    }

    markerListenersRef.current.forEach((listener) => safeRemoveListener(maps, listener))
    markerListenersRef.current = []
    markerInstancesRef.current.forEach(({ instance }) => safeSetMapNull(instance))
    markerInstancesRef.current = []

    const zoom = map.getZoom()

    markers.forEach((marker) => {
      // 파기/경합 중인 맵에 마커를 붙이면 throw 하므로 마커 단위로 best-effort 처리한다.
      try {
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
      } catch {
        // 파기/경합 중인 맵 — 무시.
      }
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
      safeRemoveListener(maps, zoomListener)
    }
  }, [scheduleRamenyaMarkerIconUpdate, status])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps || !currentLocation) {
      safeSetMapNull(currentLocationMarkerRef.current)
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

      markerListenersRef.current.forEach((listener) => safeRemoveListener(maps, listener))

      markerInstancesRef.current.forEach(({ instance }) => safeSetMapNull(instance))
      safeSetMapNull(currentLocationMarkerRef.current)
      safeDestroyMap(mapRef.current)

      // 죽은 인스턴스가 ref에 남으면 재진입(상세→뒤로) 시 init이 생성을 건너뛰어 깨진 맵이 된다 → 비워준다.
      markerInstancesRef.current = []
      markerListenersRef.current = []
      currentLocationMarkerRef.current = null
      mapRef.current = null
      mapsRef.current = null
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
