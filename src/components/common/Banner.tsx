import tw from 'twin.macro'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useBannerQuery } from '../../hooks/useBannerQuery';

export const Banner = () => {
  const navigate = useNavigate();
  const { data: bannerData } = useBannerQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => 
        prev === (bannerData?.length ?? 0) - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [bannerData?.length]);

  if (!bannerData?.length) return null;

  return (
    <Wrapper>
      <BannerImage 
        src={bannerData[currentIndex].bannerImageUrl} 
        alt="banner"
        onClick={() => {
          const url = bannerData[currentIndex].redirectUrl;
          if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank');
          } else {
            navigate(url);
          }
        }}
      />
      <BannerButtonWrapper onClick={() => navigate("/banner")}>
        <PresentNumber>{currentIndex + 1}</PresentNumber>
        <Divide>/</Divide>
        <TotalNumber>{bannerData.length} +</TotalNumber>
      </BannerButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = tw.div`
  flex w-full overflow-hidden
`

const BannerImage = tw.img`
  w-350 h-200 rounded-8 cursor-pointer
  relative
  transition-transform duration-500 ease-in-out
  transform translate-x-0
`

const BannerButtonWrapper = tw.div`
  flex items-center justify-center
  absolute bottom-20 right-20
  bg-black/50 rounded-full
  pl-6 pr-4
  cursor-pointer
`

const PresentNumber = tw.div`
  font-12-m text-white
`   

const Divide = tw.div`
  font-12-m text-white/60
`

const TotalNumber = tw.div`
  font-12-m text-white/60
`