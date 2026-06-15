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

const MapScreen = render.main(
  'relative h-[calc(100dvh-var(--app-bar-space))] w-full overflow-hidden box-border',
)

export default MapLayout
