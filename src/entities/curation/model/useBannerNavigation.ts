import { useAppNavigate } from '@/shared/navigation'
import { isExternalUrl, openUrl } from '@/shared/lib/browser'
import type { Banner } from './types'

export const useBannerNavigation = () => {
  const navigate = useAppNavigate()

  return (banner: Banner) => {
    if (isExternalUrl(banner.redirectUrl)) {
      openUrl(banner.redirectUrl)
      return
    }

    navigate(banner.redirectUrl)
  }
}
