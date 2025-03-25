import { Ramenya } from "../../types";
import { checkBusinessStatus } from "../../util";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import storeImage from "../../assets/images/store.png";
import { OpenStatus } from "../../constants";
import CountUp from "react-countup";
import { useEffect, useMemo } from "react";
import {
  setCurrentLocation,
  useLocationStore,
} from "../../store/location/useLocationStore.ts";
import { calculateDistance } from "../../util/number.ts";
import { IconStarSmall, IconTalk } from "../Icon";

interface RamenyaCardProps {
  ramenya: Ramenya;
}

const RamenyaCard = (props: RamenyaCardProps) => {
  const { ramenya } = props;
  const navigate = useNavigate();
  const { current } = useLocationStore();

  const currentDistance = useMemo(() => {
    return calculateDistance(current, {
      latitude: ramenya.latitude,
      longitude: ramenya.longitude,
    });
  }, [ramenya, current]);

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
    <Wrapper
      key={ramenya._id}
      onClick={() => navigate(`/detail/${ramenya._id}`)}
    >
      <Layout>
        <RamenyaThumbnail
          src={ramenya.thumbnailUrl || storeImage}
          isImageExist={!!ramenya.thumbnailUrl}
          alt={"Thumbnail"}
        />
        <RamenyaDescription>
          <RamenyaDescriptionHeader>
            <RamenyaTitle>{ramenya.name}</RamenyaTitle>
            <RamenyaReviewBox>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconStarSmall
                  key={star}
                  color={
                    ramenya.reviewCount > 0 && Math.round(ramenya.rating) >= star
                      ? "#FFCC00"
                      : "#E1E1E1"
                  }
                />
              ))}
              <RamenyaScore>{ramenya.rating.toFixed(1)}</RamenyaScore>
              <RamenyaReviewCount>({ramenya.reviewCount})</RamenyaReviewCount>
            </RamenyaReviewBox>
            <RamenyaLocation>
              {current.latitude !== 0 && (
                <>
                  <RamenyaDistance>
                    <StyledCountUp
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

              <RamenyaAddress>{ramenya.address}</RamenyaAddress>
            </RamenyaLocation>
          </RamenyaDescriptionHeader>
          <RamenyaCardBottomSection>
            <RamenyaOpenStatusWrapper>
              <RamenyaOpenStatus
                status={checkBusinessStatus(ramenya.businessHours).status}
              >
                {checkBusinessStatus(ramenya.businessHours).status}
              </RamenyaOpenStatus>
              {checkBusinessStatus(ramenya.businessHours).todayHours
                ?.operatingTime && (
                  <>
                    <span>·</span>
                    <RamenyaOpenTime>
                      {checkBusinessStatus(ramenya.businessHours).todayHours
                        ?.operatingTime || ""}
                    </RamenyaOpenTime>
                  </>
                )}
            </RamenyaOpenStatusWrapper>
            <RamenyaTagWrapper>
              {ramenya.genre.map((genre, index) => (
                <RamenyaTag key={index}>{genre}</RamenyaTag>
              ))}
            </RamenyaTagWrapper>
          </RamenyaCardBottomSection>
        </RamenyaDescription>
      </Layout>
      <RamenyaOneLineReview>
        <IconTalk />
        <OneLineReviewText>
          {ramenya.ramenroadReview.oneLineReview}
        </OneLineReviewText>
      </RamenyaOneLineReview>
    </Wrapper>
  );
};

const StyledCountUp = tw(CountUp)`
  text-gray-700
`;

const Wrapper = tw.section`
  w-full cursor-pointer
  box-border px-20 pt-20
`;

const Layout = tw.section`
  w-full flex gap-16 items-center
`;

const RamenyaThumbnail = styled.img(
  ({ isImageExist }: { isImageExist: boolean }) => [
    tw`w-100 h-100 object-cover rounded-lg flex-shrink-0
    border border-solid border-border`,
    !isImageExist ? tw`object-contain` : tw`object-cover`,
  ]
);

const RamenyaDescription = tw.section`
  flex flex-col h-full min-w-0 w-full justify-center gap-12
`;


const RamenyaDescriptionHeader = tw.section`
  flex flex-col h-full justify-center
  gap-2
`;

const RamenyaReviewBox = tw.section`
  flex items-center gap-2
`;

const RamenyaScore = tw.span`
  font-12-m text-black
`;


const RamenyaTitle = tw.span`
  font-16-sb h-19
`;


const RamenyaReviewCount = tw.span`
  font-12-r text-gray-700
`;

const RamenyaLocation = tw.section`
  flex gap-4 items-center
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

const RamenyaOpenStatus = styled.span(({ status }: { status: OpenStatus }) => [
  status === OpenStatus.OPEN
    ? tw`text-green`
    : status === OpenStatus.BREAK
      ? tw`text-orange`
      : tw`text-red`,
]);

const RamenyaOpenTime = tw.span`
  font-12-r
`;

const RamenyaTagWrapper = tw.section`
  flex gap-4
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

const RamenyaOneLineReview = tw.section`
  bg-border rounded-md my-20 h-34 flex items-center gap-8 text-gray-700 font-12-r px-10
  overflow-hidden
`;

const OneLineReviewText = tw.span`
  truncate min-w-0 flex-1
`;

export default RamenyaCard;
