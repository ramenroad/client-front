import styled from '@emotion/styled'
import { IconCommunity, IconHome, IconMapAppBar, IconUser } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import { useAppBar } from './model/useAppBar'

const AppBar = () => {
  const { selected, handleHomeClick, handleMapClick, handleCommunityClick, handleMyClick } = useAppBar()

  return (
    <AppBarWrapper role="navigation" aria-label="하단 내비게이션">
      <AppBarContainer>
        <AppBarItem
          type="button"
          onClick={handleHomeClick}
          aria-label="홈으로 이동"
          aria-current={selected.home ? 'page' : undefined}
        >
          <IconHome selected={selected.home} />
          <ItemText selected={selected.home}>홈</ItemText>
        </AppBarItem>

        <AppBarItem
          type="button"
          onClick={handleMapClick}
          aria-label="지도로 이동"
          aria-current={selected.map ? 'page' : undefined}
        >
          <IconMapAppBar selected={selected.map} />
          <ItemText selected={selected.map}>지도</ItemText>
        </AppBarItem>

        <AppBarItem
          type="button"
          onClick={handleCommunityClick}
          aria-label="커뮤니티로 이동"
          aria-current={selected.community ? 'page' : undefined}
        >
          <IconCommunity selected={selected.community} />
          <ItemText selected={selected.community}>커뮤니티</ItemText>
        </AppBarItem>

        <AppBarItem
          type="button"
          onClick={handleMyClick}
          aria-label="마이페이지로 이동"
          aria-current={selected.my ? 'page' : undefined}
        >
          <IconUser selected={selected.my} />
          <ItemText selected={selected.my}>마이</ItemText>
        </AppBarItem>
      </AppBarContainer>
    </AppBarWrapper>
  )
}

const AppBarWrapper = render.div(
  'box-border fixed bottom-0 left-1/2 -translate-x-1/2 w-388 h-62 bg-white border-0 border-t border-border border-solid shadow-[0_-4px_4px_-4px_rgba(0,0,0,0.08)] z-50',
)

const AppBarContainer = render.div('flex items-center justify-center w-full h-full pt-6 pb-12 px-20 box-border')

const AppBarItem = render.button(
  'flex flex-col items-center gap-1 py-[2.5px] w-54 h-44 cursor-pointer box-border border-0 bg-transparent outline-none',
)

const ItemText = styled.span<{ selected: boolean }>(({ selected }) => [
  {
    fontSize: '12px',
    lineHeight: '12px',
    fontWeight: 400,
    color: '#cfcfcf',
    height: '12px',
  },
  selected && {
    color: '#111111',
  },
])

export default AppBar
