import { checkBusinessStatus } from './business-hours'
import { OpenStatus } from './constants'
import { SortType, type FilterOptions } from './filter'
import type { RamenyaSummary } from './types'
import { calculateDistanceValue } from '@/shared/lib/number'
import type { Coordinate } from '@/shared/lib/naver-map'

const matchesOpenFilter = (ramenya: RamenyaSummary) => {
  return checkBusinessStatus(ramenya.businessHours).status === OpenStatus.OPEN
}

const matchesGenreFilter = (ramenya: RamenyaSummary, genres: string[]) => {
  return genres.every((selectedGenre) => ramenya.genre.includes(selectedGenre))
}

const sortByDistance = (ramenyas: RamenyaSummary[], currentLocation?: Coordinate | null) => {
  if (!currentLocation) {
    return ramenyas
  }

  return [...ramenyas].sort(
    (a, b) =>
      calculateDistanceValue(currentLocation, { latitude: a.latitude, longitude: a.longitude }) -
      calculateDistanceValue(currentLocation, { latitude: b.latitude, longitude: b.longitude }),
  )
}

export const filterRamenyas = (
  ramenyas: RamenyaSummary[],
  filterOptions: FilterOptions,
  currentLocation?: Coordinate | null,
) => {
  let filtered = ramenyas

  if (filterOptions.isOpen) {
    filtered = filtered.filter(matchesOpenFilter)
  }

  if (filterOptions.genre.length > 0) {
    filtered = filtered.filter((ramenya) => matchesGenreFilter(ramenya, filterOptions.genre))
  }

  if (filterOptions.sort === SortType.DISTANCE) {
    return sortByDistance(filtered, currentLocation)
  }

  if (filterOptions.sort === SortType.RATING) {
    return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  return filtered
}
