import { Outlet } from 'react-router-dom'
import { useAppEnv } from '@/shared/app-env'
import render from '@/shared/ui/render'
import { Footer } from '@/widgets/footer'
import AppBar from '@/widgets/navigation/app-bar'

const AppBarLayout = () => {
  // 앱에선 웹 AppBar/Space/Footer 미렌더 — 네이티브 탭바가 대체(W2/D1, G12: Footer도 숨김).
  const { isApp } = useAppEnv()

  return (
    <>
      <Outlet />
      {!isApp && (
        <>
          <Footer />
          <Space />
          <AppBar />
        </>
      )}
    </>
  )
}

const Space = render.div('h-55 min-h-55')

export default AppBarLayout
