import tw from "twin.macro";
import { formatNumber } from "../../util/number";
import { Line } from "../../components/common/Line";

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
const ReviewTitle = tw.div`
  font-18-sb
  text-black
`;

const RecommendBox = tw.div`
  flex flex-col gap-8
`;

const RecommendMenuContainer = tw.div`
  flex flex-col gap-14
`;

const RecommendMenuBox = tw.div`
  flex flex-col gap-12
`;

const RecommendMenuInfo = tw.div`
  flex flex-col
`;

const RecommendMenuName = tw.div`
  font-14-m text-black
`;

const RecommendMenuPrice = tw.div`
  font-14-sb
`;

const RecommendWrapper = tw.div`
  flex flex-col gap-16
  px-20 py-32
`;
