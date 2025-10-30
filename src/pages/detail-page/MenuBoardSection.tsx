import { useNavigate } from "react-router-dom";
import { IconMenuBoard, IconArrowRight } from "../../components/Icon";
import tw from "twin.macro";
import { RaisingText } from "../../components/common/RamenroadText";
import { Button } from "../../components/common/Button";
import { Line } from "../../components/common/Line";

interface MenuBoardSectionProps {
  menuBoard: { _id: string; imageUrl: string }[];
  ramenyaId: string;
}

export const MenuBoardSection = ({ menuBoard, ramenyaId }: MenuBoardSectionProps) => {
  const navigate = useNavigate();
  const isMenuBoardEmpty = menuBoard.length === 0;

  return (
    <SectionWrapper>
      <TitleWrapper>
        <Title size={18} weight="sb">
          메뉴판
        </Title>
      </TitleWrapper>

      {isMenuBoardEmpty ? (
        <MenuboardEmptyContainer>
          <IconMenuBoard />
          <MenuBoardEmptyDescription size={16} weight="r">
            등록된 메뉴판이 없습니다
          </MenuBoardEmptyDescription>
          <MenuBoardEmptyCaption size={14} weight="r">
            첫 등록의 주인공이 되어주세요!
          </MenuBoardEmptyCaption>
          <MenuBoardSubmitbutton onClick={() => navigate(`/menu-board-submit/${ramenyaId}`)}>
            등록하기
          </MenuBoardSubmitbutton>
        </MenuboardEmptyContainer>
      ) : (
        <MenuBoardContainer>
          <MenuBoardImageContainer>
            {menuBoard.map((menu) => (
              <MenuBoardImage key={menu._id} src={menu.imageUrl} />
            ))}
          </MenuBoardImageContainer>
          <Line />
          <Button variant="gray">
            <span>전체 메뉴판 보기</span>
            <MenuBoardAllArrowRight color="#888888" />
          </Button>
        </MenuBoardContainer>
      )}
    </SectionWrapper>
  );
};

// 스타일 컴포넌트들
const SectionWrapper = tw.div`
  flex flex-col gap-14
  px-20 py-32
`;

const TitleWrapper = tw.div``;

const Title = tw(RaisingText)`
  text-black
`;

const MenuboardEmptyContainer = tw.div`
  flex flex-col items-center justify-center
`;

const MenuBoardEmptyDescription = tw(RaisingText)`
  text-black pt-8 pb-4
`;

const MenuBoardEmptyCaption = tw(RaisingText)`
  text-gray-70 pb-16
`;

const MenuBoardSubmitbutton = tw.div`
  flex w-fit py-10 px-32
  box-border
  justify-center items-center
  font-16-m
  bg-brightOrange rounded-100 gap-2
  cursor-pointer
  text-orange
`;

const MenuBoardContainer = tw.div`
  flex flex-col gap-10
`;

const MenuBoardImageContainer = tw.div`
  flex gap-10
  w-full
  rounded-8 overflow-x-auto
`;

const MenuBoardImage = tw.img`
  w-110 h-110 object-cover
  rounded-8
  cursor-pointer
`;

const MenuBoardAllArrowRight = tw(IconArrowRight)`
  pl-2
`;
