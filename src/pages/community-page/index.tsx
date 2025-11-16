import tw from "twin.macro";
import { NavigationBar, NavigationItem } from "../../components/navigation-bar";
import { IconNotification, IconPen } from "../../components/Icon";
import { COMMUNITY_NAVIGATION_ITEMS } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleCard } from "../../components/article/ArticleCard";
import { Line } from "../../components/common/Line";

const dummyBoard = {
  _id: "1",
  userId: {
    _id: "1",
    nickname: "해피",
    profileImageUrl: "https://ramenroad-dev.s3.amazonaws.com/images/profiles/5.jpg.webp",
  },
  category: "이벤트",
  title: "강남 라멘 맛있는 곳 추천해주세요!",
  body: "갑자기 돈코츠 라멘 먹고싶은데 괜찮은 곳 추천 가능할까요? 너무 배고프네요ㅠ 추천 감사합니다. 만나서 반갑습니다. 안녕하세요, 저는 김종운입니다.",
  commentCount: 0,
  likeCount: 0,
  viewCount: 0,
  ImageUrls: ["https://png.pngtree.com/png-clipart/20240831/original/pngtree-shoyu-ramen-png-image_15897747.png"],
  createdAt: "2021-01-01",
  updatedAt: "2021-01-01",
};

export const CommunityPage = () => {
  const { tab } = useParams();

  // URL의 tab 파라미터에 해당하는 아이템을 찾거나 기본값 사용
  const initialItem = COMMUNITY_NAVIGATION_ITEMS.find((item) => item.value === tab) || COMMUNITY_NAVIGATION_ITEMS[0];
  const navigate = useNavigate();

  const handleNavigationItemClick = (item: NavigationItem) => {
    navigate(`/community/${item.value}`);
  };

  return (
    <Layout>
      <TitleBar>
        <Title>커뮤니티</Title>
        <IconNotification activate />
      </TitleBar>
      <NavigationBar
        items={COMMUNITY_NAVIGATION_ITEMS}
        defaultActiveValue={initialItem.value}
        onItemClick={handleNavigationItemClick}
      />
      <IconPenWrapper>
        <IconPen />
      </IconPenWrapper>
      <ArticleList>
        {Array.from({ length: 10 }).map((_, index) => (
          <>
            <ArticleCard key={index} board={dummyBoard} />
            <Line />
          </>
        ))}
      </ArticleList>
    </Layout>
  );
};

const Layout = tw.main`
  flex flex-col items-center
  w-full
  h-full
  box-border
	overflow-hidden
`;

const TitleBar = tw.header`
  flex items-center justify-between
  w-full h-44
	px-20
  box-border
	flex-shrink-0
`;

const Title = tw.h1`
  font-20-sb text-black
`;

const IconPenWrapper = tw.div`
  absolute bottom-77 right-20
	rounded-full
	w-50 h-50
	bg-orange
	flex items-center justify-center
	cursor-pointer
	shadow-md
	z-10
`;

const ArticleList = tw.div`
  flex flex-col
  w-full
  overflow-y-auto
  flex-1
`;
