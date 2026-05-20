import { type ReactNode } from "react";
import noResultImage from "@/assets/images/no-results.png";
import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

interface NoResultBoxProps {
  actionButton?: ReactNode;
}

const NoResultBox = ({ actionButton }: NoResultBoxProps) => {
  return (
    <Wrapper>
      <NoResultImage src={noResultImage} />
      <DescriptionWrapper>
        <NoResultTitle size={20} weight="sb">
          검색 결과가 없어요
        </NoResultTitle>
        <NoResultDescription size={16} weight="r">
          <DescriptionLine>찾으시는 정보가 없나요?</DescriptionLine>
          <DescriptionLine>라이징에 제보해 주세요!</DescriptionLine>
        </NoResultDescription>
      </DescriptionWrapper>
      {actionButton}
    </Wrapper>
  );
};

const Wrapper = render.div("flex flex-col items-center justify-center h-full gap-20");

const NoResultImage = render.img("w-110 h-70");

const DescriptionWrapper = render.div("flex flex-col items-center justify-center");

const NoResultTitle = render.extend(RaisingText, "text-gray-800 mb-6 text-center");

const NoResultDescription = render.extend(RaisingText, "flex flex-col text-gray-500 text-center");

const DescriptionLine = render.span("text-inherit");

export default NoResultBox;
