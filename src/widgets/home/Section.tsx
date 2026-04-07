import type { ComponentProps } from "react";
import { RaisingText } from "@/shared/ui/text";
import { IconArrowRight } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

export interface SectionProps extends ComponentProps<"article"> {
  title: string;
  subTitle?: string;
  isAdditionalInformation?: boolean;
  onClickAdditionalInformation?: () => void;
}

export const Section = ({
  title,
  subTitle,
  isAdditionalInformation,
  onClickAdditionalInformation,
  children,
  ...props
}: SectionProps) => {
  return (
    <SectionContainer {...props}>
      <SectionHeaderContainer>
        <SectionTitleWrapper>
          <SectionTitle size={18} weight="sb">
            {title}
          </SectionTitle>
          {isAdditionalInformation && (
            <AdditionalInformationWrapper onClick={() => onClickAdditionalInformation?.()}>
              <AdditionalInformationText size={12} weight="r">
                더보기
              </AdditionalInformationText>
              <IconArrowRight color="#888888" />
            </AdditionalInformationWrapper>
          )}
        </SectionTitleWrapper>
        {subTitle && (
          <SectionSubTitle size={14} weight="r">
            {subTitle}
          </SectionSubTitle>
        )}
      </SectionHeaderContainer>
      {children}
    </SectionContainer>
  );
};

const SectionContainer = render.article("flex flex-col gap-16 w-full");

const SectionHeaderContainer = render.div("flex flex-col");

const SectionTitleWrapper = render.div("flex items-center justify-between");

const SectionTitle = render.extend(RaisingText, "text-black");

const SectionSubTitle = render.extend(RaisingText, "text-gray-800");

const AdditionalInformationWrapper = render.div("flex items-center gap-2 cursor-pointer");

const AdditionalInformationText = render.extend(RaisingText, "text-gray-700");
