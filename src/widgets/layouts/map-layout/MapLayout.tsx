import { Outlet } from 'react-router-dom'
import render from '@/shared/ui/render'
import AppBar from '@/widgets/navigation/app-bar'

const MapLayout = () => {
  return (
    <>
      <MapScreen>
        <Outlet />
      </MapScreen>
      <AppBar />
    </>
  )
}

const MapScreen = render.main('relative h-[calc(100dvh-62px)] w-full overflow-hidden box-border')

export default MapLayout
