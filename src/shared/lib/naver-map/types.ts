export type NaverMapPoint = {
  x: number
  y: number
}

export type NaverMapSize = {
  width: number
  height: number
}

export type NaverMapLatLng = {
  lat: () => number
  lng: () => number
}

export type NaverMapBounds = {
  getCenter: () => NaverMapLatLng
  getNE: () => NaverMapLatLng
  getSW: () => NaverMapLatLng
  hasLatLng: (latlng: NaverMapLatLng) => boolean
}

export type NaverMapOptions = {
  center: NaverMapLatLng
  zoom: number
  mapDataControl?: boolean
  mapTypeControl?: boolean
  scaleControl?: boolean
  zoomControl?: boolean
}

export type NaverMarkerIcon = {
  content: string
  size: NaverMapSize
  anchor: NaverMapPoint
}

export type NaverMarkerOptions = {
  position: NaverMapLatLng
  map: NaverMapInstance
  icon?: NaverMarkerIcon
  clickable?: boolean
  visible?: boolean
  zIndex?: number
}

export type NaverMapEventListener = {
  listener: unknown
}

export type NaverMarkerInstance = {
  setMap: (map: NaverMapInstance | null) => void
  setIcon: (icon: NaverMarkerIcon) => void
  setPosition: (position: NaverMapLatLng) => void
  setVisible: (visible: boolean) => void
  setZIndex: (zIndex: number) => void
}

export type NaverMapInstance = {
  getBounds: () => NaverMapBounds
  getCenter: () => NaverMapLatLng
  getZoom: () => number
  panBy: (offset: NaverMapPoint) => void
  panTo: (coord: NaverMapLatLng) => void
  setCenter: (coord: NaverMapLatLng) => void
  setZoom: (zoom: number) => void
  destroy?: () => void
}

export type NaverMaps = {
  Map: new (mapDiv: string | HTMLElement, mapOptions: NaverMapOptions) => NaverMapInstance
  LatLng: new (lat: number, lng: number) => NaverMapLatLng
  Marker: new (options: NaverMarkerOptions) => NaverMarkerInstance
  Point: new (x: number, y: number) => NaverMapPoint
  Size: new (width: number, height: number) => NaverMapSize
  Event: {
    addListener: (
      target: NaverMapInstance | NaverMarkerInstance,
      eventName: string,
      listener: () => void,
    ) => NaverMapEventListener
    removeListener: (listener: NaverMapEventListener) => void
  }
}

export type NaverMapGlobal = {
  maps: NaverMaps
}

declare global {
  interface Window {
    naver?: NaverMapGlobal
  }
}
