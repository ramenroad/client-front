import { useNavigate } from 'react-router-dom'
import { useBannerQuery } from '@/entities/curation/api'
import type { Banner } from '@/entities/curation/model'
import { isExternalUrl, openUrl } from '@/shared/lib/browser'

export const useBannerPage = () => {
  const navigate = useNavigate()
  const { bannerQuery } = useBannerQuery()

  const handleBannerClick = (banner: Banner) => {
    if (isExternalUrl(banner.redirectUrl)) {
      openUrl(banner.redirectUrl)
      return
    }

    navigate(banner.redirectUrl)
  }

  return {
    banners: bannerQuery.data ?? [],
    isLoading: bannerQuery.isLoading,
    isError: bannerQuery.isError,
    handleBannerClick,
    handleCloseClick: () => navigate('/'),
  }
}
