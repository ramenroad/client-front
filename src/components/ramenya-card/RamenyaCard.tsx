import { Ramenya } from "../../types/index.ts";
import { checkBusinessStatus } from "../../util/index.ts";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import storeImage from "../../assets/images/store.png";
import { OpenStatus } from "../../constants/index.ts";
import CountUp from "react-countup";
import { useEffect, useMemo } from "react";
import { setCurrentLocation, useLocationStore } from "../../store/location/useLocationStore.ts";
import { calculateDistance } from "../../util/number.ts";
import { IconStarSmall } from "../Icon/index.tsx";
import { RamenroadText } from "../common/RamenroadText.tsx";

interface RamenyaCardProps extends Partial<Ramenya> {
  isReview?: boolean;
  width?: number | string;
  isMapCard?: boolean;
}

const RamenyaCard = (props: RamenyaCardProps) => {
  const {
    _id,
    name,
    thumbnailUrl,
    reviewCount,
    rating,
    address,
    businessHours,
    genre,
    latitude,
    longitude,
    isReview,
    isMapCard,
    width,
  } = props;

  const navigate = useNavigate();
  const { current } = useLocationStore();

  const currentDistance = useMemo(() => {
    if (!latitude || !longitude) return "";
    return calculateDistance(current, {
      latitude: latitude,
      longitude: longitude,
    });
  }, [latitude, longitude, current]);

  const openStatus = useMemo(() => {
    return checkBusinessStatus(businessHours || []).status;
  }, [businessHours]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCurrentLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });

      const watchId = navigator.geolocation.watchPosition((pos) => {
        setCurrentLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <RamenyaCardWrapper
      isMapCard={isMapCard}
      key={_id}
      onClick={() => {
        navigate(`/detail/${_id}`);
      }}
      style={{ ...(width ? { width: width } : {}) }}
    >
      <RamenyaCardLayout>
        {/* 카드 왼쪽 영역 */}
        <RamenyaThumbnail
          src={thumbnailUrl || storeImage}
          isImageExist={!!thumbnailUrl}
          alt={"Thumbnail"}
          isMapCard={isMapCard}
        />

        {/* 카드 오른쪽 영역 */}
        <RamenyaInformationWrapper>
          <RamenyaDescriptionHeader>
            {/* 라멘야 이름 */}
            <RamenyaName size={16} weight="sb">
              {name}
            </RamenyaName>

            {/* 라멘야 별점 */}
            {isReview !== false && (
              <RamenyaReviewBox>
                <IconStarSmall color={rating && rating > 0 ? "#FFCC00" : "#E1E1E1"} />
                <RamenyaScore>{rating && rating.toFixed(1)}</RamenyaScore>
                <RamenyaReviewCount>({reviewCount})</RamenyaReviewCount>
              </RamenyaReviewBox>
            )}

            {/* 라멘야 주소 */}
            <RamenyaLocation>
              {current.latitude !== 0 && (
                <>
                  <RamenyaDistance>
                    <CountUp
                      start={0}
                      end={parseFloat(currentDistance.replace(/[^0-9.]/g, ""))}
                      duration={1}
                      decimals={2}
                    />
                    {currentDistance.replace(/[\d.]+/g, "")}
                  </RamenyaDistance>
                  <VerticalLine />
                </>
              )}

              <RamenyaAddress>{address}</RamenyaAddress>
            </RamenyaLocation>
          </RamenyaDescriptionHeader>

          {/* 카드 하단 영역 */}
          <RamenyaCardBottomSection>
            <RamenyaOpenStatusWrapper>
              <RamenyaOpenStatus status={openStatus}>{openStatus}</RamenyaOpenStatus>
              {checkBusinessStatus(businessHours || []).todayHours?.operatingTime && (
                <>
                  <Dot />
                  <RamenyaOpenTime>
                    {openStatus === OpenStatus.BREAK
                      ? checkBusinessStatus(businessHours || []).todayHours?.breakTime
                      : checkBusinessStatus(businessHours || []).todayHours?.operatingTime}
                  </RamenyaOpenTime>
                </>
              )}
            </RamenyaOpenStatusWrapper>
            <RamenyaTagWrapper>
              {genre?.map((genre, index) => <RamenyaTag key={index}>{genre}</RamenyaTag>)}
            </RamenyaTagWrapper>
          </RamenyaCardBottomSection>
        </RamenyaInformationWrapper>
      </RamenyaCardLayout>
    </RamenyaCardWrapper>
  );
};

const RamenyaCardWrapper = styled.section(({ isMapCard }: { isMapCard?: boolean }) => [
  tw` w-[99%] cursor-pointer
  box-border px-20 py-20
  bg-white`,
  isMapCard && tw`rounded-12 shadow-lg`,
]);

const RamenyaCardLayout = tw.section`
  w-full flex gap-16 items-center
`;

const RamenyaThumbnail = styled.img(({ isImageExist, isMapCard }: { isImageExist: boolean; isMapCard?: boolean }) => [
  tw`object-cover rounded-lg flex-shrink-0
    border border-solid border-border`,
  !isImageExist ? tw`object-contain` : tw`object-cover`,
  isMapCard ? tw`w-110 h-110` : tw`w-100 h-100`,
]);

const RamenyaInformationWrapper = tw.section`
  flex flex-col h-full min-w-0 w-full justify-center gap-8
`;

const RamenyaDescriptionHeader = tw.section`
  flex flex-col h-full justify-center
`;

const RamenyaReviewBox = tw.section`
  flex items-center gap-2
  mt-2
`;

const RamenyaScore = tw.span`
  font-12-m text-black
`;

const RamenyaName = tw(RamenroadText)`
  text-black
`;

const RamenyaReviewCount = tw.span`
  font-12-r text-gray-700
`;

const RamenyaLocation = tw.section`
  flex gap-4 items-center
  mt-2
`;

const VerticalLine = tw.span`
  w-1 h-10 bg-gray-100
`;

const RamenyaAddress = tw.span`
  font-14-r text-gray-700 truncate whitespace-nowrap overflow-hidden text-ellipsis flex-1 h-17 leading-17
`;

const RamenyaOpenStatusWrapper = tw.span`
  flex gap-2 items-center font-12-r h-14
`;

export const RamenyaOpenStatus = styled.span(({ status }: { status: OpenStatus }) => [
  status === OpenStatus.BEFORE_OPEN
    ? tw`text-gray-700`
    : status === OpenStatus.OPEN
      ? tw`text-green`
      : status === OpenStatus.BREAK
        ? tw`text-yellow`
        : status === OpenStatus.DAY_OFF
          ? tw`text-red`
          : status === OpenStatus.CLOSED
            ? tw`text-closed`
            : tw``,
]);

const RamenyaOpenTime = tw.span`
  font-12-r
`;

const RamenyaTagWrapper = tw.section`
  flex gap-4 flex-wrap
`;

const RamenyaTag = tw.span`
  font-10-r text-gray-700 rounded-sm bg-border p-3 leading-10
`;

const RamenyaDistance = tw.section`
  font-14-m text-gray-900 flex items-center h-17
`;

const RamenyaCardBottomSection = tw.section`
  flex flex-col gap-4
`;

const Dot = tw.span`
  w-2 h-2 bg-gray-700 rounded-full
`;

export default RamenyaCard;
