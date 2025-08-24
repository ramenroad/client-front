import { ComponentProps } from "react";
import tw from "twin.macro";
import { RamenroadText } from "../../components/common/RamenroadText";
import { IconArrowRight } from "../../components/Icon";

export interface SectionProps extends ComponentProps<"article"> {
  title: string;
  subTitle?: string;
  isAdditionalInformation?: boolean;
  onClickAdditionalInformation?: () => void;
}

/**
 * @author 김종운 (CDD)
 *
 * @description 메인 페이지 섹션 컴포넌트
 *
 * @param {string} title
 * @param {string} subTitle
 * @param {boolean} isAdditionalInformation
 * @param {() => void} onClickAdditionalInformation
 * @param {React.ReactNode} children
 * @param {SectionProps} ...props
 * @returns {React.ReactNode}
 */

const Section = ({
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
        <SectionSubTitle size={14} weight="r">
          {subTitle}
        </SectionSubTitle>
      </SectionHeaderContainer>
      {children}
    </SectionContainer>
  );
};

export default Section;

const SectionContainer = tw.article`
  flex flex-col gap-16
  w-full
`;

const SectionHeaderContainer = tw.div`
  flex flex-col
`;

const SectionTitleWrapper = tw.div`
  flex items-center justify-between
`;

const SectionTitle = tw(RamenroadText)`
  text-black
`;

const SectionSubTitle = tw(RamenroadText)`
  text-gray-800
`;

const AdditionalInformationWrapper = tw.div`
  flex items-center gap-2 cursor-pointer
`;

const AdditionalInformationText = tw(RamenroadText)`
  text-gray-700
`;
