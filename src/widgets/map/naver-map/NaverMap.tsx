import { useEffect, useMemo, useRef, useState } from 'react'
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
  data: T
}

export type NaverMapFocusRequest = {
  id: string
  position: Coordinate
}

interface NaverMapProps<T> {
  initialCenter: Coordinate
  initialZoom?: number
  markers: NaverMapMarker<T>[]
  selectedMarkerId?: string | null
  currentLocation?: Coordinate | null
  focusRequest?: NaverMapFocusRequest | null
  onMapReady?: (viewport: MapViewportSnapshot) => void
  onMapIdle?: (viewport: MapViewportSnapshot) => void
  onFocusMove?: () => void
  onMarkerClick?: (markerData: T) => void
}

const DEFAULT_ZOOM = 14

export const NaverMap = <T,>({
  initialCenter,
  initialZoom = DEFAULT_ZOOM,
  markers,
  selectedMarkerId,
  currentLocation,
  focusRequest,
  onMapReady,
  onMapIdle,
  onFocusMove,
  onMarkerClick,
}: NaverMapProps<T>) => {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<NaverMapInstance | null>(null)
  const mapsRef = useRef<NaverMaps | null>(null)
  const markerInstancesRef = useRef<NaverMarkerInstance[]>([])
  const markerListenersRef = useRef<NaverMapEventListener[]>([])
  const currentLocationMarkerRef = useRef<NaverMarkerInstance | null>(null)
  const [status, setStatus] = useState<'error' | 'loading' | 'ready'>('loading')

  const markerSnapshotKey = useMemo(
    () =>
      markers
        .map((marker) => `${marker.id}:${marker.position.latitude}:${marker.position.longitude}:${marker.title ?? ''}`)
        .join('|'),
    [markers],
  )

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
      onMapIdle?.(getViewportSnapshot(map))
    })

    return () => {
      maps.Event.removeListener(idleListener)
    }
  }, [onMapIdle, status])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps) {
      return
    }

    markerListenersRef.current.forEach((listener) => maps.Event.removeListener(listener))
    markerListenersRef.current = []
    markerInstancesRef.current.forEach((marker) => marker.setMap(null))
    markerInstancesRef.current = []

    markers.forEach((marker) => {
      const markerInstance = new maps.Marker({
        map,
        position: new maps.LatLng(marker.position.latitude, marker.position.longitude),
        icon: createRamenyaMarkerIcon({
          maps,
          isSelected: marker.id === selectedMarkerId,
        }),
        clickable: true,
      })

      const clickListener = maps.Event.addListener(markerInstance, 'click', () => {
        onMarkerClick?.(marker.data)
      })

      markerInstancesRef.current.push(markerInstance)
      markerListenersRef.current.push(clickListener)
    })
  }, [markerSnapshotKey, markers, onMarkerClick, selectedMarkerId, status])

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
      })
      return
    }

    currentLocationMarkerRef.current.setPosition(position)
  }, [currentLocation, status])

  useEffect(() => {
    const map = mapRef.current
    const maps = mapsRef.current

    if (!map || !maps || !focusRequest) {
      return
    }

    onFocusMove?.()
    map.panTo(new maps.LatLng(focusRequest.position.latitude, focusRequest.position.longitude))
  }, [focusRequest, onFocusMove, status])

  useEffect(() => {
    return () => {
      const maps = mapsRef.current

      if (maps) {
        markerListenersRef.current.forEach((listener) => maps.Event.removeListener(listener))
      }

      markerInstancesRef.current.forEach((marker) => marker.setMap(null))
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
