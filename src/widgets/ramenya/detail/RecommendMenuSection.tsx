import { formatNumber } from "@/shared/lib/number";
import { Line } from "@/shared/ui/line";
import render from "@/shared/ui/render";

interface RecommendMenuSectionProps {
  recommendedMenu: { name: string; price: number }[];
}

export const RecommendMenuSection = ({ recommendedMenu }: RecommendMenuSectionProps) => {
  return (
    <RecommendWrapper>
      <ReviewTitle>라이징 추천 메뉴</ReviewTitle>
      <RecommendBox>
        <RecommendMenuContainer>
          {recommendedMenu.map((menu, index) => (
            <>
              <RecommendMenuBox key={menu.name}>
                <RecommendMenuInfo>
                  <RecommendMenuName>{menu.name}</RecommendMenuName>
                  <RecommendMenuPrice>{formatNumber(menu.price)}원</RecommendMenuPrice>
                </RecommendMenuInfo>
              </RecommendMenuBox>
              {index !== recommendedMenu.length - 1 && <Line />}
            </>
          ))}
        </RecommendMenuContainer>
      </RecommendBox>
    </RecommendWrapper>
  );
};

// 스타일 컴포넌트들
const ReviewTitle = render.div("font-18-sb text-black");

const RecommendBox = render.div("flex flex-col gap-8");

const RecommendMenuContainer = render.div("flex flex-col gap-14");

const RecommendMenuBox = render.div("flex flex-col gap-12");

const RecommendMenuInfo = render.div("flex flex-col");

const RecommendMenuName = render.div("font-14-m text-black");

const RecommendMenuPrice = render.div("font-14-sb");

const RecommendWrapper = render.div("flex flex-col gap-16 px-20 py-32");
