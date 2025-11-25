import tw from "twin.macro";
import { NavigationBar, NavigationItem } from "../../components/navigation-bar";
import { IconNotification, IconPen } from "../../components/Icon";
import { COMMUNITY_NAVIGATION_ITEMS } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Fragment } from "react";
import { ArticleCard } from "../../components/article/ArticleCard";
import { Line } from "../../components/common/Line";
import { useArticleQuery } from "../../hooks/queries/community";
import { Article } from "../../types/community";

export const CommunityPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const { articleQuery } = useArticleQuery();
  console.log(articleQuery.data);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // URL의 tab 파라미터에 해당하는 아이템을 찾거나 기본값 사용
  const initialItem = COMMUNITY_NAVIGATION_ITEMS.find((item) => item.value === tab) || COMMUNITY_NAVIGATION_ITEMS[0];

  // 무한스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && articleQuery.hasNextPage && !articleQuery.isFetchingNextPage) {
          articleQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [articleQuery]);

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
      <IconPenWrapper onClick={() => navigate(`/community/submit/new`)}>
        <IconPen />
      </IconPenWrapper>
      <ArticleList>
        {articleQuery.isLoading && <div>Loading...</div>}
        {articleQuery.data?.pages.flatMap((page) =>
          page.boards.map((article: Article) => (
            <Fragment key={article._id}>
              <ArticleCard article={article} onClick={() => navigate(`/community/detail/${article._id}`)} />
              <Line />
            </Fragment>
          )),
        )}
        {articleQuery.hasNextPage && (
          <div ref={loadMoreRef} style={{ height: "20px" }}>
            {articleQuery.isFetchingNextPage && <div>Loading more...</div>}
          </div>
        )}
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
