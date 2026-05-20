import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRamenyaGroupQuery } from '@/entities/curation/api'
import { useToast } from '@/shared/ui/toast'

type LocationCoordinate = {
  longitude: number
  latitude: number
}

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 60_000,
}

const buildMapPath = (params: Record<string, string | number | boolean | undefined>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === false) {
      return
    }

    searchParams.set(key, value === true ? 'true' : value.toString())
  })

  return `/map?${searchParams.toString()}`
}

const getCurrentPosition = () => {
  return new Promise<LocationCoordinate>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      reject,
      GEOLOCATION_OPTIONS,
    )
  })
}

export const useHomePage = () => {
  const navigate = useNavigate()
  const locationContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const { ramenyaGroupQuery } = useRamenyaGroupQuery()
  const { openToast } = useToast()
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()

    if (!locationContainerRef.current) {
      return
    }

    setIsDragging(true)
    setStartX(event.pageX - locationContainerRef.current.offsetLeft)
    setScrollLeft(locationContainerRef.current.scrollLeft)
  }, [])

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()

      if (!isDragging || !locationContainerRef.current) {
        return
      }

      event.preventDefault()
      const x = event.pageX - locationContainerRef.current.offsetLeft
      const walk = (x - startX) * 2
      locationContainerRef.current.scrollLeft = scrollLeft - walk
    },
    [isDragging, scrollLeft, startX],
  )

  const handleMouseUp = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleLocationBadgeClick = useCallback(
    async (location: LocationCoordinate | null) => {
      if (!location) {
        if (!navigator.geolocation) {
          openToast('이 브라우저에서는 위치 정보를 지원하지 않습니다.')
          return
        }

        try {
          const currentLocation = await getCurrentPosition()
          navigate(
            buildMapPath({
              longitude: currentLocation.longitude,
              latitude: currentLocation.latitude,
            }),
          )
          return
        } catch {
          openToast('현재 위치를 확인하지 못했습니다. 위치 권한을 확인해주세요.')
          return
        }
      }

      navigate(
        buildMapPath({
          longitude: location.longitude,
          latitude: location.latitude,
          level: 14,
          radius: 3241,
        }),
      )
    },
    [navigate, openToast],
  )

  const handleSearchKeywordSelect = useCallback(
    (keyword: string, isNearBy?: boolean) => {
      navigate(
        buildMapPath({
          keyword,
          nearBy: isNearBy,
        }),
      )
    },
    [navigate],
  )

  return {
    ramenyaGroup: ramenyaGroupQuery.data,
    locationContainerRef,
    isDragging,
    isSearchOverlayOpen,
    setIsSearchOverlayOpen,
    searchValue,
    setSearchValue,
    handleOpenSearchOverlay: () => setIsSearchOverlayOpen(true),
    handleLocationBadgeClick,
    handleSearchKeywordSelect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    navigate,
  }
}
