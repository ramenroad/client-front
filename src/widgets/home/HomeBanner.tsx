import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBannerQuery } from '@/entities/curation/api'
import type { Banner as BannerItem } from '@/entities/curation/model'
import { Banner as BannerCarousel } from '@/entities/curation/ui'
import { isExternalUrl, openUrl } from '@/shared/lib/browser'

export const HomeBanner = () => {
  const navigate = useNavigate()
  const { bannerQuery } = useBannerQuery()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleBannerClick = (banner: BannerItem) => {
    if (isExternalUrl(banner.redirectUrl)) {
      openUrl(banner.redirectUrl)
      return
    }

    navigate(banner.redirectUrl)
  }

  return (
    <BannerCarousel
      banners={bannerQuery.data ?? []}
      currentIndex={currentIndex}
      onBannerClick={handleBannerClick}
      onMoreClick={() => navigate('/banner')}
      onSlideChange={setCurrentIndex}
    />
  )
}
