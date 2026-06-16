import { Outlet } from 'react-router-dom'
import { useAppEnv } from '@/shared/app-env'
import render from '@/shared/ui/render'
import AppBar from '@/widgets/navigation/app-bar'

const MapLayout = () => {
  // 앱에선 웹 AppBar 미렌더 + 화면 높이는 네이티브 탭바를 WebView 밖에서 처리하므로 100dvh(=--app-bar-space 0).
  const { isApp } = useAppEnv()

  return (
    <>
      <MapScreen>
        <Outlet />
      </MapScreen>
      {!isApp && <AppBar />}
    </>
  )
}

// 맵은 풀블리드 — 앱의 #root 상단 안전영역 패딩을 음수 마진으로 상쇄해 상태바 아래까지 채운다(상단 인셋은 맵 내부 오버레이가 --safe-top으로 처리).
const MapScreen = render.main(
  'relative mt-[calc(-1*var(--safe-top))] h-[calc(100dvh-var(--app-bar-space))] w-full overflow-hidden box-border',
)

export default MapLayout
