import { type ComponentType, useEffect, useMemo, useState } from 'react'
import CountUpModule, { type CountUpProps } from 'react-countup'
import storeImage from '@/assets/images/store.png'
import { checkBusinessStatus, OpenStatus, type BusinessHour } from '@/entities/ramenya/model'
import { getBrowserCurrentLocation } from '@/shared/lib/geolocation'
import { calculateDistance } from '@/shared/lib/number'
import type { Coordinate } from '@/shared/lib/naver-map'
import { IconStar } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RamenyaTag } from '@/shared/ui/tag'
import { RaisingText } from '@/shared/ui/text'
import { RamenyaOpenStatus } from './RamenyaOpenStatus'

type DistanceParts = {
  decimals: number
  unit: string
  value: number
}

const CountUp = (
  typeof CountUpModule === 'function' ? CountUpModule : (CountUpModule as { default: ComponentType<CountUpProps> }).default
) as ComponentType<CountUpProps>

const parseDistance = (distance: string): DistanceParts | null => {
  const distanceMatch = distance.match(/^([\d.]+)(.+)$/)

  if (!distanceMatch) {
    return null
  }

  const value = Number(distanceMatch[1])
  const unit = distanceMatch[2]

  if (!Number.isFinite(value)) {
    return null
  }

  return {
    value,
    unit,
    decimals: unit === 'km' ? 2 : 0,
  }
}

const useResolvedCurrentLocation = (currentLocation?: Coordinate | null) => {
  const [browserCurrentLocation, setBrowserCurrentLocation] = useState<Coordinate | null>(null)

  useEffect(() => {
    if (currentLocation) {
      return
    }

    let isCancelled = false

    getBrowserCurrentLocation().then((nextLocation) => {
      if (!isCancelled) {
        setBrowserCurrentLocation(nextLocation)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [currentLocation])

  return currentLocation ?? browserCurrentLocation
}

export type RamenyaCardItem = {
  _id?: string
  name?: string
  thumbnailUrl?: string
  reviewCount?: number
  rating?: number
  address?: string
  latitude?: number
  longitude?: number
  businessHours?: BusinessHour[]
  genre?: string[]
}

interface RamenyaCardProps extends RamenyaCardItem {
  isReview?: boolean
  isMapCard?: boolean
  isSelected?: boolean
  currentLocation?: Coordinate | null
  width?: number | string
  onClick?: () => void
}

export const RamenyaCard = ({
  _id,
  name,
  thumbnailUrl,
  reviewCount,
  rating,
  address,
  latitude,
  longitude,
  businessHours,
  genre,
  isReview,
  isMapCard,
  isSelected,
  currentLocation,
  width,
  onClick,
}: RamenyaCardProps) => {
  const businessStatus = useMemo(() => checkBusinessStatus(businessHours ?? []), [businessHours])
  const resolvedCurrentLocation = useResolvedCurrentLocation(currentLocation)
  const currentDistance = useMemo(
    () =>
      calculateDistance(
        resolvedCurrentLocation,
        latitude !== undefined && longitude !== undefined
          ? {
              latitude,
              longitude,
            }
          : null,
      ),
    [resolvedCurrentLocation, latitude, longitude],
  )
  const distanceParts = useMemo(() => parseDistance(currentDistance), [currentDistance])
  const openStatus = businessStatus.status
  const displayHours = openStatus === OpenStatus.BREAK ? businessStatus.todayHours?.breakTime : businessStatus.todayHours?.operatingTime
  const hasRating = typeof rating === 'number' && rating > 0
  const shouldShowReview = isReview !== false

  return (
    <RamenyaCardWrapper
      type="button"
      data-clickable={Boolean(onClick)}
      data-map-card={Boolean(isMapCard)}
      data-selected={Boolean(isSelected)}
      onClick={onClick}
      style={width ? { width } : undefined}
      aria-label={name ? `${name} 상세보기` : '라멘야 상세보기'}
      data-id={_id}
    >
      <RamenyaCardLayout>
        <RamenyaThumbnail
          src={thumbnailUrl || storeImage}
          data-has-image={Boolean(thumbnailUrl)}
          data-map-card={Boolean(isMapCard)}
          alt={name ? `${name} 대표 이미지` : '라멘야 대표 이미지'}
        />
        <RamenyaInformationWrapper>
          <RamenyaDescriptionHeader>
            <RamenyaName size={16} weight="sb">
              {name}
            </RamenyaName>
            {shouldShowReview && (
              <RamenyaReviewBox>
                <IconStar inactive={!hasRating} />
                <RamenyaScore>{hasRating ? rating.toFixed(1) : '-'}</RamenyaScore>
                <RamenyaReviewCount>({reviewCount ?? 0})</RamenyaReviewCount>
              </RamenyaReviewBox>
            )}
            {address && (
              <RamenyaLocation>
                {distanceParts && (
                  <>
                    <RamenyaDistance>
                      <CountUp
                        key={currentDistance}
                        start={0}
                        end={distanceParts.value}
                        duration={1}
                        decimals={distanceParts.decimals}
                      />
                      {distanceParts.unit}
                    </RamenyaDistance>
                    <VerticalLine />
                  </>
                )}
                <RamenyaAddress>{address}</RamenyaAddress>
              </RamenyaLocation>
            )}
          </RamenyaDescriptionHeader>
          <RamenyaCardBottomSection>
            <RamenyaOpenStatusWrapper>
              <RamenyaOpenStatus status={openStatus} className="font-12-r" />
              {displayHours && (
                <>
                  <Dot />
                  <RamenyaOpenTime>{displayHours}</RamenyaOpenTime>
                </>
              )}
            </RamenyaOpenStatusWrapper>
            <RamenyaTagWrapper>
              {genre?.map((ramenyaGenre) => <RamenyaTag key={ramenyaGenre}>{ramenyaGenre}</RamenyaTag>)}
            </RamenyaTagWrapper>
          </RamenyaCardBottomSection>
        </RamenyaInformationWrapper>
      </RamenyaCardLayout>
    </RamenyaCardWrapper>
  )
}

const RamenyaCardWrapper = render.button(
  'box-border w-full cursor-default border-0 bg-white p-20 text-left shadow-none outline-none transition-colors data-[clickable=true]:cursor-pointer data-[map-card=true]:rounded-12 data-[map-card=true]:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] data-[selected=true]:bg-[#FFF8F3]',
)

const RamenyaCardLayout = render.section('flex w-full items-center gap-16')

const RamenyaThumbnail = render.img(
  'h-100 w-100 shrink-0 rounded-8 border border-solid border-border object-contain data-[has-image=true]:object-cover data-[map-card=true]:h-110 data-[map-card=true]:w-110',
)

const RamenyaInformationWrapper = render.section('flex h-full min-w-0 flex-1 flex-col justify-center gap-8')

const RamenyaDescriptionHeader = render.section('flex h-full flex-col justify-center')

const RamenyaReviewBox = render.section('mt-2 flex items-center gap-2')

const RamenyaScore = render.span('font-12-m text-black')

const RamenyaName = render.extend(RaisingText, 'truncate text-black')

const RamenyaReviewCount = render.span('font-12-r text-gray-700')

const RamenyaLocation = render.section('mt-2 flex w-full min-w-0 items-center gap-4')

const RamenyaDistance = render.section('font-14-m flex h-17 shrink-0 items-center text-gray-900')

const VerticalLine = render.span('h-10 w-1 shrink-0 bg-gray-100')

const RamenyaAddress = render.span('font-14-r h-17 min-w-0 flex-1 truncate text-gray-700')

const RamenyaOpenStatusWrapper = render.span('font-12-r flex h-18 items-center gap-2')

const RamenyaOpenTime = render.span('font-12-r text-gray-700')

const RamenyaTagWrapper = render.section('flex flex-wrap gap-4')

const RamenyaCardBottomSection = render.section('flex flex-col gap-4')

const Dot = render.span('h-2 w-2 rounded-full bg-gray-700')
