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

const MapScreen = render.main('relative h-[calc(100dvh-56px)] w-full overflow-hidden box-border pb-56')

export default MapLayout
