import {
  IconBar,
  IconCall,
  IconDropDown,
  IconDropDownSelected,
  IconInstagram,
  IconLocate,
  IconTag,
  IconTime,
  IconStar,
} from "../../components/Icon";
import tw from "twin.macro";
import DetailIconTag from "./DetailIconTag";
import { checkBusinessStatus, checkBusinessStatusSpecial } from "../../util";
import { RamenyaOpenStatus } from "../../components/ramenya-card/RamenyaCard";
import { DAY_MAP, OpenStatus } from "../../constants";
import styled from "@emotion/styled";
import { RemenyaDetail } from "../../types";

interface RamenyaInformationSectionProps {
  ramenyaData: RemenyaDetail | undefined;
  isTimeExpanded: boolean;
  setIsTimeExpanded: (expanded: boolean) => void;
  todayBusinessHour: { day: string; isOpen: boolean; operatingTime: string; breakTime?: string } | undefined;
  sortBusinessHoursByCurrentDay: (
    businessHours: { day: string; isOpen: boolean; operatingTime: string; breakTime?: string }[],
  ) => { day: string; isOpen: boolean; operatingTime: string; breakTime?: string }[];
}

export const RamenyaInformationSection = ({
  ramenyaData,
  isTimeExpanded,
  setIsTimeExpanded,
  sortBusinessHoursByCurrentDay,
  todayBusinessHour,
}: RamenyaInformationSectionProps) => {
  return (
    <MarketDetailWrapper>
      <MarketDetailTitle>{ramenyaData?.name}</MarketDetailTitle>
      <MarketDetailBoxContainer>
        <MarketDetailBox>
          <DetailIconTag icon={<IconStar inactive />} text="평점" />
          <MarketDetailReviewBox>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = ramenyaData?.rating || 0;
                const reviewCount = ramenyaData?.reviewCount || 0;

                if (reviewCount === 0) {
                  return <IconStar key={star} inactive />;
                }

                if (rating >= star) {
                  return <IconStar key={star} />;
                } else if (rating >= star - 0.5) {
                  return <IconStar size={14} isHalf key={star} />;
                } else {
                  return <IconStar key={star} inactive />;
                }
              })}
            </StarContainer>
            <MarketDetailReviewScore>{ramenyaData?.rating?.toFixed(1) || "0.0"}</MarketDetailReviewScore>
          </MarketDetailReviewBox>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconTag />} text="장르" />
          <MarketDetailGenreBox>
            {ramenyaData?.genre.map((genre: string, index: number) => (
              <MarketDetailGenre key={genre}>
                {genre} {index !== ramenyaData?.genre.length - 1 && <IconBar />}
              </MarketDetailGenre>
            ))}
          </MarketDetailGenreBox>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconLocate />} text="주소" />
          <MarketDetailBoxAddressText>{ramenyaData?.address}</MarketDetailBoxAddressText>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconTime />} text="운영시간" />
          <MarketDetailBoxContent>
            <OperationgTimeTextContainer>
              <RamenyaOpenStatus status={checkBusinessStatus(ramenyaData?.businessHours ?? []).status}>
                {checkBusinessStatus(ramenyaData?.businessHours ?? []).status}
              </RamenyaOpenStatus>
              <TimeHeader>
                {todayBusinessHour?.isOpen
                  ? `${todayBusinessHour.operatingTime}`
                  : checkBusinessStatusSpecial(ramenyaData?.businessHours ?? []).closeInformation}
                {isTimeExpanded ? (
                  <StyledIconDropDownSelected onClick={() => setIsTimeExpanded(false)} />
                ) : (
                  <StyledIconDropDown onClick={() => setIsTimeExpanded(true)} />
                )}
              </TimeHeader>
              {isTimeExpanded && (
                <BusinessHoursWrapper>
                  {checkBusinessStatusSpecial(ramenyaData?.businessHours ?? []).daily.allSame ? (
                    <BusinessHoursContainer today={true}>
                      <BusinessHoursDay>매일</BusinessHoursDay>
                      <BusinessHoursTime>
                        <div>{`${checkBusinessStatusSpecial(ramenyaData?.businessHours ?? []).daily.operatingTime}`}</div>
                        {checkBusinessStatusSpecial(ramenyaData?.businessHours ?? []).daily.breakTime && (
                          <div>{`${checkBusinessStatusSpecial(ramenyaData?.businessHours ?? []).daily.breakTime} ${OpenStatus.BREAK}`}</div>
                        )}
                      </BusinessHoursTime>
                    </BusinessHoursContainer>
                  ) : (
                    sortBusinessHoursByCurrentDay(ramenyaData?.businessHours || []).map((businessHour) => (
                      <BusinessHoursContainer
                        key={businessHour.day}
                        today={todayBusinessHour?.day === businessHour.day}
                      >
                        <BusinessHoursDay>{DAY_MAP[businessHour.day]}</BusinessHoursDay>
                        <BusinessHoursTime>
                          {businessHour.isOpen ? (
                            <div key={businessHour.day}>
                              <div>{`${businessHour.operatingTime}`}</div>
                              {businessHour.breakTime && (
                                <BreakTimeText>
                                  <span>{businessHour.breakTime}</span>
                                  <span>{OpenStatus.BREAK}</span>
                                </BreakTimeText>
                              )}
                            </div>
                          ) : (
                            <div>{`매주 휴무`}</div>
                          )}
                        </BusinessHoursTime>
                      </BusinessHoursContainer>
                    ))
                  )}
                </BusinessHoursWrapper>
              )}
            </OperationgTimeTextContainer>
          </MarketDetailBoxContent>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconCall />} text="전화번호" />
          <MarketDetailBoxContent>
            <PhoneNumberText>{ramenyaData?.contactNumber || "미공개"}</PhoneNumberText>
          </MarketDetailBoxContent>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconInstagram />} text="인스타그램" />
          <MarketDetailBoxContent>
            {ramenyaData?.instagramProfile ? (
              <InstagramLink href={ramenyaData?.instagramProfile} target="_blank" rel="noopener noreferrer">
                {ramenyaData?.instagramProfile}
              </InstagramLink>
            ) : (
              <PhoneNumberText>미공개</PhoneNumberText>
            )}
          </MarketDetailBoxContent>
        </MarketDetailBox>
      </MarketDetailBoxContainer>
    </MarketDetailWrapper>
  );
};

// 스타일 컴포넌트들
const MarketDetailWrapper = tw.div`
  flex flex-col gap-16 px-20
  pt-20
  pb-32
`;

const MarketDetailTitle = tw.div`
  font-22-sb
`;

const MarketDetailBox = tw.div`
  flex gap-16 items-start
`;

const MarketDetailReviewBox = tw.div`
  flex gap-4 items-center
`;

const MarketDetailReviewScore = tw.div`
  font-14-r text-black
`;

const MarketDetailGenreBox = tw.div`
  flex gap-8 items-center font-14-r text-black
  flex-wrap
`;

const MarketDetailBoxAddressText = tw.div`
  font-14-r
`;

const MarketDetailGenre = tw.div`
  flex gap-8 items-center font-14-r
`;

const MarketDetailBoxContainer = tw.div`
  flex flex-col gap-12
`;

const MarketDetailBoxContent = tw.div`
  font-14-r max-w-254 break-words
`;

const OperationgTimeTextContainer = tw.div`
  flex flex-col gap-6 items-start
`;

const TimeHeader = tw.div`
  flex gap-4 items-center
`;

const StyledIconDropDown = tw(IconDropDown)`
  cursor-pointer
`;

const StyledIconDropDownSelected = tw(IconDropDownSelected)`
  cursor-pointer
`;

const BusinessHoursWrapper = tw.div`
  flex flex-col gap-8
`;

const BusinessHoursContainer = styled.div<{ today: boolean }>(({ today }) => [
  tw`flex gap-7`,
  today && tw`font-semibold`,
]);

const BusinessHoursDay = tw.span``;

const BusinessHoursTime = tw.div`
  flex flex-col gap-4
`;

const BreakTimeText = tw.div`
  flex gap-4 items-center
`;

const PhoneNumberText = tw.div`
  font-14-r
`;

const InstagramLink = tw.a`
  font-14-r text-blue
`;

const StarContainer = tw.div`
  flex gap-2 items-center
`;
