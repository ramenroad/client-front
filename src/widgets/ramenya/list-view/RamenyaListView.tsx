import { Fragment, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { RamenyaCard, type RamenyaCardItem } from '@/entities/ramenya/ui'
import type { Coordinate } from '@/shared/lib/naver-map'
import render from '@/shared/ui/render'

interface RamenyaListViewProps {
  ramenyas?: RamenyaCardItem[]
  emptyContent?: ReactNode
  centered?: boolean
  dividerInset?: boolean
  isReview?: boolean
  currentLocation?: Coordinate | null
  onItemClick?: (ramenya: RamenyaCardItem) => void
}

export const RamenyaListView = ({
  ramenyas,
  emptyContent = null,
  centered = false,
  dividerInset = false,
  isReview,
  currentLocation,
  onItemClick,
}: RamenyaListViewProps) => {
  const navigate = useNavigate()

  if (!ramenyas) {
    return null
  }

  if (ramenyas.length === 0) {
    return <>{emptyContent}</>
  }

  return (
    <ListWrapper data-centered={centered}>
      {ramenyas.map((ramenya, index) => (
        <Fragment key={ramenya._id ?? `${ramenya.name}-${index}`}>
          <RamenyaCard
            {...ramenya}
            isReview={isReview}
            currentLocation={currentLocation}
            onClick={() => {
              if (onItemClick) {
                onItemClick(ramenya)
                return
              }

              if (ramenya._id) {
                navigate(`/detail/${ramenya._id}`)
              }
            }}
          />
          {index !== ramenyas.length - 1 && <Divider className={dividerInset ? 'mx-20' : undefined} />}
        </Fragment>
      ))}
    </ListWrapper>
  )
}

const ListWrapper = render.div('flex w-full flex-col data-[centered=true]:items-center data-[centered=true]:justify-center')

const Divider = render.div('box-border h-1 w-full bg-border')
