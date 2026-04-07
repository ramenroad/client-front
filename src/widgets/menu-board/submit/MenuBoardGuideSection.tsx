import styled from "@emotion/styled";
import MenuBoardImage1 from "@/assets/images/menu-board/menu-board-1.png";
import MenuBoardImage2 from "@/assets/images/menu-board/menu-board-2.png";
import { IconMenuBoardRightImage, IconMenuBoardWrongImage } from "@/shared/ui/icon";
import render from "@/shared/ui/render";

export const MenuBoardGuideSection = () => {
  return (
    <Section>
      <GuideCard>
        <GuideTitle>메뉴판 제보 가이드</GuideTitle>
        <GuideContent>
          <GuideHighlight>정면</GuideHighlight>에서 촬영한 사진을 등록해 주세요
          <GuideImageGrid>
            <GuideImageItem>
              <GuideImage src={MenuBoardImage1} alt="정면에서 촬영한 메뉴판 예시" />
              <GuideIcon status="right">
                <IconMenuBoardRightImage />
              </GuideIcon>
            </GuideImageItem>
            <GuideImageItem>
              <GuideImage src={MenuBoardImage2} alt="잘못 촬영한 메뉴판 예시" />
              <GuideIcon status="wrong">
                <IconMenuBoardWrongImage />
              </GuideIcon>
            </GuideImageItem>
          </GuideImageGrid>
        </GuideContent>
      </GuideCard>

      <GuideCaption>제보하신 정보는 검수 후 게재됩니다. 감사합니다.</GuideCaption>
    </Section>
  );
};

const Section = render.div("box-border w-full px-20 pt-20");

const GuideCard = render.div("box-border flex h-190 w-full flex-col items-center rounded-[8px] bg-border pt-20 pb-27");

const GuideTitle = render.div("font-14-sb text-gray-800");

const GuideContent = render.div("font-14-m text-gray-800");

const GuideHighlight = render.span("font-14-m text-[#06B526]");

const GuideImageGrid = render.div("flex flex-row gap-20 pt-16");

const GuideImageItem = render.div("relative");

const GuideImage = render.img("h-86 w-86 rounded-[4px] object-cover");

const GuideCaption = render.div("pb-73 pt-14 font-14-m text-gray-500");

const GuideIcon = styled.div<{ status: "right" | "wrong" }>(({ status }) => [
  {
    position: "absolute",
    bottom: "2px",
    right: "-13px",
    display: "flex",
    width: "23px",
    height: "23px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
  },
  status === "right" && { backgroundColor: "#06b526" },
  status === "wrong" && { backgroundColor: "#ff5234" },
]);
