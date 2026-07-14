export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const COMPACT_UNITS = [
  { threshold: 1_000_000, suffix: 'M' },
  { threshold: 1_000, suffix: 'K' },
] as const

/**
 * 1,000 이상을 K/M으로 줄인다. 999 → '999', 1,234 → '1.2K', 12,345 → '12K', 1,234,567 → '1.2M'.
 * 반올림이 아니라 버림 — 좋아요·조회수가 실제보다 많아 보이면 안 되므로 1,999는 '2K'가 아닌 '1.9K',
 * 999,999는 '1M'이 아닌 '999K'로 둔다.
 */
export const formatCompactNumber = (value: number): string => {
  if (!Number.isFinite(value) || value < 1_000) {
    return String(value)
  }

  const unit = COMPACT_UNITS.find(({ threshold }) => value >= threshold) ?? COMPACT_UNITS[1]
  const scaled = value / unit.threshold
  // 10 미만일 때만 소수 첫째 자리를 남겨 표시 폭을 일정하게 유지한다(1.2K / 12K / 123K).
  const compact = scaled < 10 ? Math.floor(scaled * 10) / 10 : Math.floor(scaled)

  return `${compact}${unit.suffix}`
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
