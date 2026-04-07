import { openUrl } from "@/shared/lib/browser";
import render from "@/shared/ui/render";

const REVIEW_FORM_GUIDE_URL = "https://kim-junseo.notion.site/23a49b91c9c58027bce1f6ad0cee5989?pvs=74";

export const ReviewFormGuide = () => {
  return (
    <GuideContainer>
      <GuideText>작성 전 가이드를 꼭 확인해주세요</GuideText>
      <GuideLink
        href={REVIEW_FORM_GUIDE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => {
          event.preventDefault();
          openUrl(REVIEW_FORM_GUIDE_URL);
        }}
      >
        리뷰 작성 가이드
      </GuideLink>
    </GuideContainer>
  );
};

const GuideContainer = render.section("flex justify-between bg-border px-20 py-14");

const GuideText = render.span("font-14-r text-gray-500");

const GuideLink = render.a("cursor-pointer font-14-m text-[#818181] underline");
