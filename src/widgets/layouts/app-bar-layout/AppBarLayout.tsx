import { Outlet } from 'react-router-dom'
import { useAppEnv } from '@/shared/app-env'
import render from '@/shared/ui/render'
import { Footer } from '@/widgets/footer'
import AppBar from '@/widgets/navigation/app-bar'

const AppBarLayout = () => {
  // 앱: 웹 하단 AppBar(4-탭 네비)만 숨김 — 네이티브 탭바가 대체. Footer/Space는 웹과 동일하게 유지하고,
  // Space 높이만 네이티브 탭바 높이(--app-bottom-space)로 바꿔 Footer가 탭바에 가리지 않게 한다.
  const { isApp } = useAppEnv()

  return (
    <>
      <Outlet />
      <Footer />
      <Space />
      {!isApp && <AppBar />}
    </>
  )
}

const Space = render.div('h-[var(--app-bottom-space)] min-h-[var(--app-bottom-space)]')

export default AppBarLayout
