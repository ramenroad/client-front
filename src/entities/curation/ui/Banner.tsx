import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import type { Banner as BannerItem } from "@/entities/curation/model";
import render from "@/shared/ui/render";

interface BannerProps {
  banners: BannerItem[];
  currentIndex: number;
  onBannerClick: (banner: BannerItem) => void;
  onMoreClick: () => void;
  onSlideChange: (index: number) => void;
}

export const Banner = ({ banners, currentIndex, onBannerClick, onMoreClick, onSlideChange }: BannerProps) => {
  if (!banners.length) {
    return null;
  }

  return (
    <Wrapper>
      <SwiperWrapper>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <BannerImage src={banner.bannerImageUrl} alt={banner.name} onClick={() => onBannerClick(banner)} />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperWrapper>
      <BannerButtonWrapper onClick={onMoreClick}>
        <PresentNumber>{currentIndex + 1}</PresentNumber>
        <Divide>/</Divide>
        <TotalNumber>{banners.length} +</TotalNumber>
      </BannerButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = render.div("relative flex w-full overflow-hidden");

const SwiperWrapper = render.div("w-350 h-140 relative");

const BannerImage = render.img("w-full h-full object-cover rounded-[8px] cursor-pointer");

const BannerButtonWrapper = render.div(
  "flex items-center justify-center absolute bottom-12 right-12 bg-black/50 rounded-full pl-6 pr-4 z-10 cursor-pointer",
);

const PresentNumber = render.div("font-12-m text-white");

const Divide = render.div("font-12-m text-white/60");

const TotalNumber = render.div("font-12-m text-white/60");
