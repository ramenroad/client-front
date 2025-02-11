import tw from "twin.macro";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBannerQuery } from "../../hooks/queries/useBannerQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

export const Banner = () => {
  const navigate = useNavigate();
  const { data: bannerData } = useBannerQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!bannerData?.length) return null;

  const sortedBannerData = [...bannerData].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <Wrapper>
      <SwiperContainer>
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
                src={banner.bannerImageUrl}
                alt="banner"
                onClick={() => {
                  const url = banner.redirectUrl;
                  if (url.startsWith("http://") || url.startsWith("https://")) {
                    window.open(url, "_blank");
                  } else {
                    navigate(url);
                  }
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainer>
      <BannerButtonWrapper onClick={() => navigate("/banner")}>
        <PresentNumber>{currentIndex + 1}</PresentNumber>
        <Divide>/</Divide>
        <TotalNumber>{bannerData.length} +</TotalNumber>
      </BannerButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = tw.div`
  flex flex-col w-full overflow-hidden
`;

const SwiperContainer = tw.div`
  w-350 h-200 relative
`;

const BannerImage = tw.img`
  w-full h-full object-cover rounded-8 cursor-pointer
`;

const BannerButtonWrapper = tw.div`
  flex items-center justify-center
  absolute bottom-12 right-12
  bg-black/50 rounded-full
  pl-6 pr-4 z-10
  cursor-pointer
`;

const PresentNumber = tw.div`
  font-12-m text-white
`;

const Divide = tw.div`
  font-12-m text-white/60
`;

const TotalNumber = tw.div`
  font-12-m text-white/60
`;
