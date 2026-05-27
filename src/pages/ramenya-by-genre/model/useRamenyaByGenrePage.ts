import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRamenyaListQuery } from '@/entities/ramenya/api'
import {
  filterRamenyas,
  genreDescriptions,
  initialFilterOptions,
  SortType,
  type FilterOptions,
  type RamenyaType,
} from '@/entities/ramenya/model'
import { getBrowserCurrentLocation } from '@/shared/lib/geolocation'
import type { Coordinate } from '@/shared/lib/naver-map'

const GENRE_FILTER_STORAGE_KEY = 'genrePageFilterOptions'

const isFilterOptions = (value: unknown): value is FilterOptions => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const sortValues = Object.values(SortType)
  const candidate = value as Partial<FilterOptions>
  return (
    typeof candidate.isOpen === 'boolean' &&
    typeof candidate.sort === 'string' &&
    sortValues.includes(candidate.sort as SortType) &&
    Array.isArray(candidate.genre)
  )
}

const readStoredFilterOptions = () => {
  if (typeof window === 'undefined') {
    return initialFilterOptions
  }

  try {
    const rawValue = window.sessionStorage.getItem(GENRE_FILTER_STORAGE_KEY)
    const parsed: unknown = rawValue ? JSON.parse(rawValue) : null
    return isFilterOptions(parsed) ? parsed : initialFilterOptions
  } catch {
    return initialFilterOptions
  }
}

const writeStoredFilterOptions = (filterOptions: FilterOptions) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(GENRE_FILTER_STORAGE_KEY, JSON.stringify(filterOptions))
}

export const useRamenyaByGenrePage = () => {
  const navigate = useNavigate()
  const { genre = '' } = useParams()
  const [filterOptions, setFilterOptions] = useState(readStoredFilterOptions)
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null)
  const ramenyaListQuery = useRamenyaListQuery({ genre }, { enabled: Boolean(genre) })

  useEffect(() => {
    let isCancelled = false

    getBrowserCurrentLocation().then((nextLocation) => {
      if (!isCancelled) {
        setCurrentLocation(nextLocation)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    writeStoredFilterOptions(filterOptions)
  }, [filterOptions])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [genre])

  const ramenyas = useMemo(
    () => filterRamenyas(ramenyaListQuery.data ?? [], filterOptions, currentLocation),
    [currentLocation, filterOptions, ramenyaListQuery.data],
  )

  return {
    genre: genre as RamenyaType,
    genreDescription: genreDescriptions[genre as RamenyaType] ?? '',
    filterOptions,
    setFilterOptions,
    currentLocation,
    ramenyas,
    isLoading: ramenyaListQuery.isLoading,
    isError: ramenyaListQuery.isError,
    navigate,
  }
}
