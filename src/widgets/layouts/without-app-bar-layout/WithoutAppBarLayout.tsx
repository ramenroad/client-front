import { Outlet } from 'react-router-dom'
import { Footer } from '@/widgets/footer'

const WithoutAppBarLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}

export default WithoutAppBarLayout
