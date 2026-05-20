import type { NaverMapBounds, NaverMapInstance, NaverMapLatLng } from './types'

export type Coordinate = {
  latitude: number
  longitude: number
}

export type MapBoundsSnapshot = {
  northEast: Coordinate
  southWest: Coordinate
}

export type MapViewportSnapshot = {
  center: Coordinate
  zoom: number
  radius: number
  bounds: MapBoundsSnapshot
}

const EARTH_RADIUS_METER = 6_371_000

const toRadians = (degree: number) => (degree * Math.PI) / 180

const toCoordinate = (latLng: NaverMapLatLng): Coordinate => ({
  latitude: latLng.lat(),
  longitude: latLng.lng(),
})

export const getDistanceMeter = (from: Coordinate, to: Coordinate) => {
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_METER * c
}

export const getRadiusFromBounds = (center: Coordinate, bounds: MapBoundsSnapshot) => {
  return Math.round(
    Math.max(getDistanceMeter(center, bounds.northEast), getDistanceMeter(center, bounds.southWest)),
  )
}

export const getBoundsSnapshot = (bounds: NaverMapBounds): MapBoundsSnapshot => ({
  northEast: toCoordinate(bounds.getNE()),
  southWest: toCoordinate(bounds.getSW()),
})

export const getViewportSnapshot = (map: NaverMapInstance): MapViewportSnapshot => {
  const bounds = getBoundsSnapshot(map.getBounds())
  const center = toCoordinate(map.getCenter())

  return {
    center,
    zoom: map.getZoom(),
    radius: getRadiusFromBounds(center, bounds),
    bounds,
  }
}
