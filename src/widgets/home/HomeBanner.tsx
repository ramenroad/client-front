import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBannerQuery, type Banner as BannerItem } from "@/entities/curation/model";
import { isExternalUrl, openUrl } from "@/shared/lib/browser";
import { Banner as BannerCarousel } from "@/entities/curation/ui";

export const HomeBanner = () => {
  const navigate = useNavigate();
  const { bannerQuery } = useBannerQuery();
  const { data: bannerData } = bannerQuery;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleBannerClick = (banner: BannerItem) => {
    if (isExternalUrl(banner.redirectUrl)) {
      openUrl(banner.redirectUrl);
      return;
    }

    navigate(banner.redirectUrl);
  };

  return (
    <BannerCarousel
      banners={bannerData ?? []}
      currentIndex={currentIndex}
      onBannerClick={handleBannerClick}
      onMoreClick={() => navigate("/banner")}
      onSlideChange={setCurrentIndex}
    />
  );
};
