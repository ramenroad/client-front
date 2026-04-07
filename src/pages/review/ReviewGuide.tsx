import { RaisingText } from "@/shared/ui/text";
import render from "@/shared/ui/render";

const ReviewGuide = () => {
  return (
    <ReviewGuideContainer>
      <ReviewGuideText size={14} weight="r">
        작성 전 가이드를 꼭 확인해주세요
      </ReviewGuideText>
      <ReviewGuideAnchor
        size={14}
        weight="m"
        onClick={() => {
          window.open("https://kim-junseo.notion.site/23a49b91c9c58027bce1f6ad0cee5989?pvs=74", "_blank");
        }}
      >
        리뷰 작성 가이드
      </ReviewGuideAnchor>
    </ReviewGuideContainer>
  );
};

const ReviewGuideContainer = render.section("px-20 py-14 bg-border flex justify-between");

const ReviewGuideText = render.extend(RaisingText, "text-gray-500");

const ReviewGuideAnchor = render.extend(RaisingText, "text-[#818181] cursor-pointer underline");

export default ReviewGuide;
