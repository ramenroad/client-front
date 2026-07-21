import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { useRamenyaGroupQuery } from '@/entities/curation/api'
import { useCrossTabNavigate } from '@/shared/app-env'
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
  // 탭 인지 네비게이션 — 홈에서 /map(지도 탭 소유)으로 갈 땐 in-place 이동이 아니라 지도 탭 전환으로 위임.
  const navigate = useCrossTabNavigate()
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
          openToast('이 브라우저에서는 위치 정보를 지원하지 않습니다.', undefined, 'error')
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
          openToast('현재 위치를 확인하지 못했습니다. 위치 권한을 확인해주세요.', undefined, 'error')
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

  // 홈 검색은 항상 전역 검색이다. SearchOverlay는 엔터를 '이 근처에서 찾기'(isNearBy)로 넘기지만,
  // 홈에는 기준이 될 지도 뷰포트가 없다 — 그대로 nearBy를 붙이면 지도가 기본 중심(연남동) 반경으로
  // 검색을 좁혀, 다른 지역 매장은 결과에서 통째로 빠진다(전역 폴백은 결과가 0건일 때만 돈다).
  // 위치로 좁히는 건 실제 뷰포트가 있는 지도 화면에서만 의미가 있다.
  const handleSearchKeywordSelect = useCallback(
    (keyword: string) => {
      navigate(buildMapPath({ keyword }))
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
