import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import {
  IconBar,
  IconCall,
  IconDropDown,
  IconDropDownSelected,
  IconInstagram,
  IconLocate,
  IconStar,
  IconTag,
  IconTime,
} from "@/shared/ui/icon";
import { checkBusinessStatus, checkBusinessStatusSpecial } from "@/entities/ramenya/lib";
import { DAY_MAP, OpenStatus, type RamenyaDetail } from "@/entities/ramenya/model";
import { RamenyaOpenStatus } from "@/entities/ramenya/ui";
import render from "@/shared/ui/render";
import DetailIconTag from "./DetailIconTag";

interface RamenyaInformationSectionProps {
  ramenyaData: RamenyaDetail | undefined;
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
  const businessHours = ramenyaData?.businessHours ?? [];
  const businessStatus = checkBusinessStatus(businessHours);
  const businessStatusSpecial = checkBusinessStatusSpecial(businessHours);
  const sortedBusinessHours = sortBusinessHoursByCurrentDay(businessHours);
  const genres = ramenyaData?.genre ?? [];
  const rating = ramenyaData?.rating ?? 0;
  const reviewCount = ramenyaData?.reviewCount ?? 0;

  return (
    <MarketDetailWrapper>
      <MarketDetailTitle>{ramenyaData?.name}</MarketDetailTitle>
      <MarketDetailBoxContainer>
        <MarketDetailBox>
          <DetailIconTag icon={<IconStar inactive />} text="평점" />
          <MarketDetailReviewBox>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((star) => {
                if (reviewCount === 0) {
                  return <IconStar key={star} inactive />;
                }

                if (rating >= star) {
                  return <IconStar key={star} />;
                }

                if (rating >= star - 0.5) {
                  return <IconStar key={star} size={14} isHalf />;
                }

                return <IconStar key={star} inactive />;
              })}
            </StarContainer>
            <MarketDetailReviewScore>{ramenyaData?.rating?.toFixed(1) || "0.0"}</MarketDetailReviewScore>
          </MarketDetailReviewBox>
        </MarketDetailBox>

        <MarketDetailBox>
          <DetailIconTag icon={<IconTag />} text="장르" />
          <MarketDetailGenreBox>
            {genres.map((genre, index) => (
              <MarketDetailGenre key={genre}>
                {genre}
                {index < genres.length - 1 && <IconBar />}
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
            <OperatingTimeTextContainer>
              <RamenyaOpenStatus status={businessStatus.status}>{businessStatus.status}</RamenyaOpenStatus>
              <TimeHeader>
                {todayBusinessHour?.isOpen ? todayBusinessHour.operatingTime : businessStatusSpecial.closeInformation}
                {isTimeExpanded ? (
                  <StyledIconDropDownSelected onClick={() => setIsTimeExpanded(false)} />
                ) : (
                  <StyledIconDropDown onClick={() => setIsTimeExpanded(true)} />
                )}
              </TimeHeader>
              {isTimeExpanded && (
                <BusinessHoursWrapper>
                  {businessStatusSpecial.daily.allSame ? (
                    <BusinessHoursContainer today={true}>
                      <BusinessHoursDay>매일</BusinessHoursDay>
                      <BusinessHoursTime>
                        <BusinessHoursTextLine>{businessStatusSpecial.daily.operatingTime}</BusinessHoursTextLine>
                        {businessStatusSpecial.daily.breakTime && (
                          <BusinessHoursTextLine>
                            {businessStatusSpecial.daily.breakTime} {OpenStatus.BREAK}
                          </BusinessHoursTextLine>
                        )}
                      </BusinessHoursTime>
                    </BusinessHoursContainer>
                  ) : (
                    sortedBusinessHours.map((businessHour) => (
                      <BusinessHoursContainer key={businessHour.day} today={todayBusinessHour?.day === businessHour.day}>
                        <BusinessHoursDay>{DAY_MAP[businessHour.day]}</BusinessHoursDay>
                        <BusinessHoursTime>
                          {businessHour.isOpen ? (
                            <BusinessHoursTextGroup>
                              <BusinessHoursTextLine>{businessHour.operatingTime}</BusinessHoursTextLine>
                              {businessHour.breakTime && (
                                <BreakTimeText>
                                  <BreakTimeValue>{businessHour.breakTime}</BreakTimeValue>
                                  <BreakTimeValue>{OpenStatus.BREAK}</BreakTimeValue>
                                </BreakTimeText>
                              )}
                            </BusinessHoursTextGroup>
                          ) : (
                            <BusinessHoursTextLine>매주 휴무</BusinessHoursTextLine>
                          )}
                        </BusinessHoursTime>
                      </BusinessHoursContainer>
                    ))
                  )}
                </BusinessHoursWrapper>
              )}
            </OperatingTimeTextContainer>
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
              <InstagramLink href={ramenyaData.instagramProfile} target="_blank" rel="noopener noreferrer">
                {ramenyaData.instagramProfile}
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

const MarketDetailWrapper = render.div("flex flex-col gap-16 px-20 pt-20 pb-32");

const MarketDetailTitle = render.div("font-22-sb");

const MarketDetailBox = render.div("flex items-start gap-16");

const MarketDetailReviewBox = render.div("flex items-center gap-4");

const MarketDetailReviewScore = render.div("font-14-r text-black");

const MarketDetailGenreBox = render.div("flex flex-wrap items-center gap-8 font-14-r text-black");

const MarketDetailBoxAddressText = render.div("font-14-r");

const MarketDetailGenre = render.div("flex items-center gap-8 font-14-r");

const MarketDetailBoxContainer = render.div("flex flex-col gap-12");

const MarketDetailBoxContent = render.div("max-w-254 break-words font-14-r");

const OperatingTimeTextContainer = render.div("flex flex-col items-start gap-6");

const TimeHeader = render.div("flex items-center gap-4");

const StyledIconDropDown = render.extend(IconDropDown, "cursor-pointer");

const StyledIconDropDownSelected = render.extend(IconDropDownSelected, "cursor-pointer");

const BusinessHoursWrapper = render.div("flex flex-col gap-8");

interface BusinessHoursContainerProps extends ComponentProps<"div"> {
  today: boolean;
}

const BusinessHoursContainerBase = render.div("flex gap-7");

const BusinessHoursContainer = ({ today, className, ...props }: BusinessHoursContainerProps) => {
  return <BusinessHoursContainerBase {...props} className={twMerge(today ? "font-semibold" : "", className ?? "")} />;
};

const BusinessHoursDay = render.span();

const BusinessHoursTime = render.div("flex flex-col gap-4");

const BusinessHoursTextGroup = render.div("flex flex-col gap-4");

const BusinessHoursTextLine = render.div("text-inherit");

const BreakTimeText = render.div("flex items-center gap-4");

const BreakTimeValue = render.span("text-inherit");

const PhoneNumberText = render.div("font-14-r");

const InstagramLink = render.a("font-14-r text-blue");

const StarContainer = render.div("flex items-center gap-2");
