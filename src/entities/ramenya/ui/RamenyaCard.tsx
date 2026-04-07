import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import CountUp from "react-countup";
import storeImage from "@/assets/images/store.png";
import { setCurrentLocation, useLocationStore } from "@/entities/location/model";
import { checkBusinessStatus } from "@/entities/ramenya/lib";
import { OpenStatus, type Ramenya } from "@/entities/ramenya/model";
import { calculateDistance } from "@/shared/lib/number";
import { IconStar } from "@/shared/ui/icon";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

interface RamenyaCardProps extends Partial<Ramenya> {
  isReview?: boolean;
  width?: number | string;
  isMapCard?: boolean;
}

const RamenyaCard = ({
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
}: RamenyaCardProps) => {
  const navigate = useNavigate();
  const { current } = useLocationStore();

  const currentDistance = useMemo(() => {
    if (!latitude || !longitude) {
      return "";
    }

    return calculateDistance(current, {
      latitude,
      longitude,
    });
  }, [current, latitude, longitude]);

  const openStatus = useMemo(() => checkBusinessStatus(businessHours || []).status, [businessHours]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

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
  }, []);

  return (
    <RamenyaCardWrapper
      isMapCard={isMapCard}
      key={_id}
      onClick={() => navigate(`/detail/${_id}`)}
      style={{ ...(width ? { width } : {}) }}
    >
      <RamenyaCardLayout>
        <RamenyaThumbnail
          src={thumbnailUrl || storeImage}
          isImageExist={!!thumbnailUrl}
          alt="Thumbnail"
          isMapCard={isMapCard}
        />
        <RamenyaInformationWrapper>
          <RamenyaDescriptionHeader>
            <RamenyaName size={16} weight="sb">
              {name}
            </RamenyaName>
            {isReview !== false && (
              <RamenyaReviewBox>
                <IconStar inactive={!rating || rating <= 0} />
                <RamenyaScore>{rating && rating.toFixed(1)}</RamenyaScore>
                <RamenyaReviewCount>({reviewCount})</RamenyaReviewCount>
              </RamenyaReviewBox>
            )}
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
              {genre?.map((ramenyaGenre, index) => (
                <RamenyaTag key={index}>{ramenyaGenre}</RamenyaTag>
              ))}
            </RamenyaTagWrapper>
          </RamenyaCardBottomSection>
        </RamenyaInformationWrapper>
      </RamenyaCardLayout>
    </RamenyaCardWrapper>
  );
};

const RamenyaCardWrapper = styled.section<{ isMapCard?: boolean }>(({ isMapCard }) => ({
  width: "99%",
  cursor: "pointer",
  boxSizing: "border-box",
  padding: "20px",
  backgroundColor: "#ffffff",
  ...(isMapCard
    ? {
        borderRadius: "12px",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }
    : {}),
}));

const RamenyaCardLayout = render.section("w-full flex gap-16 items-center");

const RamenyaThumbnail = styled.img<{ isImageExist: boolean; isMapCard?: boolean }>(({ isImageExist, isMapCard }) => ({
  objectFit: isImageExist ? "cover" : "contain",
  borderRadius: "0.5rem",
  flexShrink: 0,
  border: "1px solid #f4f4f5",
  ...(isMapCard ? { width: "110px", height: "110px" } : { width: "100px", height: "100px" }),
}));

const RamenyaInformationWrapper = render.section("flex flex-col h-full min-w-0 w-full justify-center gap-8");

const RamenyaDescriptionHeader = render.section("flex flex-col h-full justify-center");

const RamenyaReviewBox = render.section("flex items-center gap-2 mt-2");

const RamenyaScore = render.span("font-12-m text-black");

const RamenyaName = render.extend(RaisingText, "text-black");

const RamenyaReviewCount = render.span("font-12-r text-gray-700");

const RamenyaLocation = render.section("flex gap-4 items-center mt-2");

const VerticalLine = render.span("w-1 h-10 bg-gray-100");

const RamenyaAddress = render.span(
  "font-14-r text-gray-700 truncate whitespace-nowrap overflow-hidden text-ellipsis flex-1 h-17 leading-17",
);

const RamenyaOpenStatusWrapper = render.span("flex gap-2 items-center font-12-r h-14");

export const RamenyaOpenStatus = styled.span<{ status: OpenStatus }>(({ status }) => ({
  color:
    status === OpenStatus.BEFORE_OPEN
      ? "#585858"
      : status === OpenStatus.OPEN
        ? "#59bc12"
        : status === OpenStatus.BREAK
          ? "#f3a216"
          : status === OpenStatus.DAY_OFF
            ? "#ff5454"
            : status === OpenStatus.CLOSED
              ? "#838383"
              : undefined,
}));

const RamenyaOpenTime = render.span("font-12-r");

const RamenyaTagWrapper = render.section("flex gap-4 flex-wrap");

const RamenyaTag = render.span("font-10-r text-gray-700 rounded-sm bg-border p-3 leading-10");

const RamenyaDistance = render.section("font-14-m text-gray-900 flex items-center h-17");

const RamenyaCardBottomSection = render.section("flex flex-col gap-4");

const Dot = render.span("w-2 h-2 bg-gray-700 rounded-full");

export default RamenyaCard;
