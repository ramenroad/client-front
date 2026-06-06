import { IconRefresh } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

interface RefreshOverlayProps {
  onRefresh: () => void
}

export const RefreshOverlay = ({ onRefresh }: RefreshOverlayProps) => {
  return (
    <Container onClick={onRefresh}>
      <RefreshButton type="button">
        <IconRefresh />
        <RefreshText size={12} weight="m">
          현 지도에서 검색
        </RefreshText>
      </RefreshButton>
    </Container>
  )
}

const Container = render.div('absolute-center-x absolute top-80 z-10')

const RefreshButton = render.button(
  'z-10 flex h-34 w-125 cursor-pointer items-center gap-4 rounded-full border-none bg-white pl-14 pr-16 py-8 shadow outline-none',
)

const RefreshText = render.extend(RaisingText, 'whitespace-nowrap text-gray-700')
