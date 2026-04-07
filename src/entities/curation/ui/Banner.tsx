import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { useBannerQuery } from "@/entities/curation/model";
import render from "@/shared/ui/render";

export const Banner = () => {
  const navigate = useNavigate();
  const { bannerQuery } = useBannerQuery();
  const { data: bannerData } = bannerQuery;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!bannerData?.length) {
    return null;
  }

  const sortedBannerData = [...bannerData].sort((a, b) => a.priority - b.priority);

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
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        >
          {sortedBannerData.map((banner, index) => (
            <SwiperSlide key={index}>
              <BannerImage
                key={banner._id}
                src={banner.bannerImageUrl}
                alt="banner"
                onClick={() => {
                  const url = banner.redirectUrl;
                  if (url.startsWith("http://") || url.startsWith("https://")) {
                    window.open(url, "_blank");
                    return;
                  }
                  navigate(url);
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperWrapper>
      <BannerButtonWrapper onClick={() => navigate("/banner")}>
        <PresentNumber>{currentIndex + 1}</PresentNumber>
        <Divide>/</Divide>
        <TotalNumber>{bannerData.length} +</TotalNumber>
      </BannerButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = render.div("flex flex-col w-full overflow-hidden");

const SwiperWrapper = render.div("w-350 h-140 relative");

const BannerImage = render.img("w-full h-full object-cover rounded-[8px] cursor-pointer");

const BannerButtonWrapper = render.div(
  "flex items-center justify-center absolute bottom-12 right-12 bg-black/50 rounded-full pl-6 pr-4 z-10 cursor-pointer",
);

const PresentNumber = render.div("font-12-m text-white");

const Divide = render.div("font-12-m text-white/60");

const TotalNumber = render.div("font-12-m text-white/60");
