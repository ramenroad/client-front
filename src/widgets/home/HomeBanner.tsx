import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBannerQuery } from '@/entities/curation/api'
import { useBannerNavigation } from '@/entities/curation/model'
import { Banner as BannerCarousel } from '@/entities/curation/ui'

export const HomeBanner = () => {
  const navigate = useNavigate()
  const { bannerQuery } = useBannerQuery()
  const handleBannerClick = useBannerNavigation()
  const [currentIndex, setCurrentIndex] = useState(0)

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
