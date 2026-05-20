import { useMemo } from 'react'
import render from '@/shared/ui/render'
import { RamenyaTag } from '@/shared/ui/tag'
import { RaisingText } from '@/shared/ui/text'
import { useResultListOverlay } from './model/useResultListOverlay'
import type { MapResultSheetHeight } from './model/sheetHeight'

export interface ResultListItem<T> {
  id: string
  name: string
  address: string
  genre: string[]
  thumbnailUrl: string
  rating: number
  reviewCount: number
  ramenya: T
}

interface ResultListOverlayProps<T> {
  items: ResultListItem<T>[]
  height: MapResultSheetHeight
  title?: string
  selectedId?: string | null
  isLoading?: boolean
  onHeightChange: (height: MapResultSheetHeight) => void
  onSelect: (item: T) => void
}

export const ResultListOverlay = <T,>({
  height,
  items,
  title = '주변 라멘야',
  selectedId,
  isLoading,
  onHeightChange,
  onSelect,
}: ResultListOverlayProps<T>) => {
  const itemIds = useMemo(() => items.map((item) => item.id), [items])
  const { containerStyle, dragHandleProps, registerItemRef } = useResultListOverlay({
    currentHeight: height,
    itemIds,
    selectedId,
    onHeightChange,
  })

  return (
    <OverlayContainer style={containerStyle}>
      <DragHandle {...dragHandleProps}>
        <Handle aria-hidden="true" />
      </DragHandle>
      <Header>
        <HeaderTitle size={16} weight="sb">
          {title}
        </HeaderTitle>
        <CountText size={12} weight="r">
          {isLoading ? '검색 중' : `${items.length}곳`}
        </CountText>
      </Header>

      {items.length === 0 ? (
        <EmptyState>
          <RaisingText size={16} weight="sb">
            검색 결과가 없어요
          </RaisingText>
          <EmptyDescription size={14} weight="r">
            지도를 움직인 뒤 현 지도에서 검색해보세요.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <ResultList>
          {items.map((item) => (
            <ResultCard
              key={item.id}
              ref={registerItemRef(item.id)}
              type="button"
              onClick={() => onSelect(item.ramenya)}
              data-selected={selectedId === item.id}
            >
              <ThumbnailWrapper>
                {item.thumbnailUrl ? (
                  <Thumbnail src={item.thumbnailUrl} alt={item.name} />
                ) : (
                  <ThumbnailFallback aria-hidden="true" />
                )}
              </ThumbnailWrapper>
              <Content>
                <TitleRow>
                  <StoreName size={16} weight="sb">
                    {item.name}
                  </StoreName>
                  {item.genre[0] && <RamenyaTag>{item.genre[0]}</RamenyaTag>}
                </TitleRow>
                <AddressText size={12} weight="r">
                  {item.address}
                </AddressText>
                <MetaText size={12} weight="r">
                  평점 {item.rating.toFixed(1)} · 리뷰 {item.reviewCount}
                </MetaText>
              </Content>
            </ResultCard>
          ))}
        </ResultList>
      )}
    </OverlayContainer>
  )
}

const OverlayContainer = render.section(
  'absolute bottom-0 left-0 right-0 z-30 flex min-h-0 flex-col overflow-hidden rounded-t-[20px] bg-white px-16 pt-6 pb-16 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] [isolation:isolate] [transform:translateZ(0)] [will-change:height]',
)

const DragHandle = render.div(
  'mx-auto mb-8 flex h-20 w-full cursor-grab touch-none select-none items-center justify-center outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-orange/40',
)

const Handle = render.div('h-4 w-36 rounded-[50px] bg-gray-100')

const Header = render.div('mb-10 flex items-center justify-between')

const HeaderTitle = render.extend(RaisingText, 'text-gray-900')

const CountText = render.extend(RaisingText, 'text-gray-500')

const EmptyState = render.div('flex flex-1 flex-col items-center justify-center gap-4 text-center')

const EmptyDescription = render.extend(RaisingText, 'text-gray-500')

const ResultList = render.div('flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto pb-8')

const ResultCard = render.button(
  'flex w-full cursor-pointer gap-12 rounded-[12px] border border-solid border-transparent bg-white p-8 text-left shadow-none outline-none data-[selected=true]:border-orange data-[selected=true]:bg-light-orange',
)

const ThumbnailWrapper = render.div('h-76 w-76 min-w-76 overflow-hidden rounded-[8px] bg-gray-50')

const Thumbnail = render.img('h-full w-full object-cover')

const ThumbnailFallback = render.div('h-full w-full bg-gray-100')

const Content = render.div('flex min-w-0 flex-1 flex-col gap-4')

const TitleRow = render.div('flex min-w-0 items-center gap-6')

const StoreName = render.extend(RaisingText, 'truncate text-gray-900')

const AddressText = render.extend(RaisingText, 'truncate text-gray-500')

const MetaText = render.extend(RaisingText, 'text-gray-700')
