import { IconRefresh } from '@/shared/ui/icon'
import render from '@/shared/ui/render'

interface RefreshOverlayProps {
  onRefresh: () => void
}

export const RefreshOverlay = ({ onRefresh }: RefreshOverlayProps) => {
  return (
    <RefreshButton type="button" onClick={onRefresh}>
      <IconRefresh />
      <RefreshText>현 지도에서 검색</RefreshText>
    </RefreshButton>
  )
}

const RefreshButton = render.button(
  'absolute top-76 left-1/2 z-40 flex h-36 -translate-x-1/2 cursor-pointer items-center justify-center gap-6 rounded-[50px] border border-solid border-orange bg-white px-16 text-orange shadow-[0_2px_8px_rgba(0,0,0,0.12)]',
)

const RefreshText = render.span('font-14-sb whitespace-nowrap')
