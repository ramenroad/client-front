import ramenroadLogo from '@/assets/images/logo.png'
import render from '@/shared/ui/render'

export const RamenroadLogo = () => <Logo src={ramenroadLogo} alt="Ramenroad" />

const Logo = render.img('h-24')
