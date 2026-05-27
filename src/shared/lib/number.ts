export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

type DistanceCoordinate = {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_KM = 6371

const toRadians = (degree: number) => {
  return (degree * Math.PI) / 180
}

const isValidCoordinate = (coordinate?: DistanceCoordinate | null): coordinate is DistanceCoordinate => {
  return Boolean(
    coordinate &&
      Number.isFinite(coordinate.latitude) &&
      Number.isFinite(coordinate.longitude) &&
      coordinate.latitude !== 0 &&
      coordinate.longitude !== 0,
  )
}

export const calculateDistanceValue = (from?: DistanceCoordinate | null, to?: DistanceCoordinate | null) => {
  if (!isValidCoordinate(from) || !isValidCoordinate(to)) {
    return Number.POSITIVE_INFINITY
  }

  const latitudeDistance = toRadians(to.latitude - from.latitude)
  const longitudeDistance = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)
  const haversine =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDistance / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export const calculateDistance = (
  from?: DistanceCoordinate | null,
  to?: DistanceCoordinate | null,
): string => {
  const distanceKm = calculateDistanceValue(from, to)

  if (!Number.isFinite(distanceKm)) {
    return ''
  }

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }

  return `${distanceKm.toFixed(2)}km`
}
