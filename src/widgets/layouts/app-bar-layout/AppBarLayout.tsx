import { Outlet } from 'react-router-dom'
import render from '@/shared/ui/render'
import { Footer } from '@/widgets/footer'
import AppBar from '@/widgets/navigation/app-bar'

const AppBarLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
      <Space />
      <AppBar />
    </>
  )
}

const Space = render.div('h-55 min-h-55')

export default AppBarLayout
