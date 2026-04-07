import { useEffect, useRef, type MutableRefObject } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { type Ramenya } from "@/entities/ramenya/model";
import RamenyaCard from "@/entities/ramenya/ui";
import render from "@/shared/ui/render";

interface ResultCardOverlayProps {
  ramenyaList: Ramenya[];
  selectedMarker: Ramenya | null;
  onMarkerSelect: (marker: Ramenya) => void;
  isMovingRef?: MutableRefObject<boolean>;
}

export const ResultCardOverlay = ({
  ramenyaList,
  selectedMarker,
  onMarkerSelect,
  isMovingRef,
}: ResultCardOverlayProps) => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperCore | null>(null);

  const handleSwiperSlideChange = (swiper: SwiperCore) => {
    if (isMovingRef?.current) {
      return;
    }

    const currentData = ramenyaList[swiper.realIndex];
    if (!currentData || currentData._id === selectedMarker?._id) {
      return;
    }

    onMarkerSelect(currentData);
  };

  useEffect(() => {
    if (!selectedMarker || !ramenyaList.length || !swiperRef.current) {
      return;
    }

    const targetIndex = ramenyaList.findIndex((ramenya) => ramenya._id === selectedMarker._id);

    if (targetIndex >= 0) {
      if (swiperRef.current.slideToLoop) {
        swiperRef.current.slideToLoop(targetIndex);
      } else {
        swiperRef.current.slideTo(targetIndex);
      }
    }
  }, [selectedMarker, ramenyaList]);

  if (!ramenyaList.length) {
    return null;
  }

  return (
    <Container>
      <SwiperWrapper>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          key={ramenyaList[0]?._id}
          onSlideChange={handleSwiperSlideChange}
          slidesPerView={1.1}
          loop={true}
          centeredSlides={true}
          spaceBetween={10}
          style={{
            width: "100%",
            minHeight: "120px",
            maxWidth: "400px",
          }}
        >
          {ramenyaList.map((ramenya) => (
            <SwiperSlide key={ramenya._id}>
              <RamenyaCard
                isMapCard={true}
                _id={ramenya._id}
                name={ramenya.name}
                rating={ramenya.rating}
                latitude={ramenya.latitude}
                longitude={ramenya.longitude}
                address={ramenya.address}
                businessHours={ramenya.businessHours}
                genre={ramenya.genre}
                reviewCount={ramenya.reviewCount}
                thumbnailUrl={ramenya.thumbnailUrl}
                width={"350px"}
                onClick={() => navigate(`/detail/${ramenya._id}`)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperWrapper>
    </Container>
  );
};

const Container = render.div(
  "pointer-events-none absolute bottom-70 left-0 right-0 z-10 box-border flex w-full justify-center",
);

const SwiperWrapper = render.div("flex w-full justify-center pointer-events-auto");
