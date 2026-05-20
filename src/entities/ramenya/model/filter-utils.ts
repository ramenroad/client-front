import { checkBusinessStatus } from './business-hours'
import { OpenStatus } from './constants'
import { SortType, type FilterOptions } from './filter'
import type { RamenyaSummary } from './types'

const matchesOpenFilter = (ramenya: RamenyaSummary) => {
  return checkBusinessStatus(ramenya.businessHours).status === OpenStatus.OPEN
}

const matchesGenreFilter = (ramenya: RamenyaSummary, genres: string[]) => {
  return genres.every((selectedGenre) => ramenya.genre.includes(selectedGenre))
}

export const filterRamenyas = (ramenyas: RamenyaSummary[], filterOptions: FilterOptions) => {
  let filtered = ramenyas

  if (filterOptions.isOpen) {
    filtered = filtered.filter(matchesOpenFilter)
  }

  if (filterOptions.genre.length > 0) {
    filtered = filtered.filter((ramenya) => matchesGenreFilter(ramenya, filterOptions.genre))
  }

  if (filterOptions.sort === SortType.RATING) {
    return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  return filtered
}
