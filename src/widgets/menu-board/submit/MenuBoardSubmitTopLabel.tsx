import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

export const MenuBoardSubmitTopLabel = () => {
  return (
    <Wrapper>
      <Highlight size={14} weight="m">
        직접 촬영한{" "}
      </Highlight>
      <RaisingText size={14} weight="r">
        메뉴판/키오스크 사진을 등록해주세요
      </RaisingText>
    </Wrapper>
  );
};

const Wrapper = render.div("flex h-44 w-full items-center gap-2 bg-light-orange px-20 py-12 box-border");

const Highlight = render.extend(RaisingText, "text-orange");
