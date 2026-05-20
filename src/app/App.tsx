import { AppRouter } from './router'
import MobileFrame from '@/widgets/app-shell/mobile-frame'

export function App() {
  return (
    <MobileFrame>
      <AppRouter />
    </MobileFrame>
  )
}
