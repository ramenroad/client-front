import { useAppNavigate } from '@/shared/navigation'
import { useBannerQuery } from '@/entities/curation/api'
import { useBannerNavigation } from '@/entities/curation/model'

export const useBannerPage = () => {
  const navigate = useAppNavigate()
  const { bannerQuery } = useBannerQuery()
  const handleBannerClick = useBannerNavigation()

  return {
    banners: bannerQuery.data ?? [],
    isLoading: bannerQuery.isLoading,
    isError: bannerQuery.isError,
    handleBannerClick,
    handleCloseClick: () => navigate('/'),
  }
}
