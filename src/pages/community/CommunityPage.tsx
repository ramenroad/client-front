import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@/widgets/navigation/app-bar";
import {
  COMMUNITY_BOARD_LIST_TABS,
  COMMUNITY_NOTIFICATION_MOCKS,
  COMMUNITY_NOTIFICATION_READ_STORAGE_KEY,
  type CommunityBoardListTabKey,
  useCommunityBoardListQuery,
} from "@/entities/community/model";
import { getCommunityBoardPopularityScore } from "@/entities/community/lib";
import { CommunityBellIcon, CommunityBoardCard, CommunityWriteIcon } from "@/entities/community/ui";
import { useSignInStore } from "@/entities/viewer/model";
import { useToast } from "@/shared/ui/toast";
import render from "@/shared/ui/render";

const COMMUNITY_LIST_LIMIT = 20;

const CommunityPage = () => {
  const navigate = useNavigate();
  const { isSignIn } = useSignInStore();
  const { openToast } = useToast();
  const popularHintShownRef = useRef(false);
  const [selectedTabKey, setSelectedTabKey] = useState<CommunityBoardListTabKey>("all");
  const selectedTab =
    COMMUNITY_BOARD_LIST_TABS.find((tab) => tab.key === selectedTabKey) ?? COMMUNITY_BOARD_LIST_TABS[0];
  const hasUnreadNotifications =
    typeof window === "undefined"
      ? COMMUNITY_NOTIFICATION_MOCKS.some((notification) => notification.unread)
      : localStorage.getItem(COMMUNITY_NOTIFICATION_READ_STORAGE_KEY) !== "read" &&
        COMMUNITY_NOTIFICATION_MOCKS.some((notification) => notification.unread);

  const { communityBoardListQuery } = useCommunityBoardListQuery({
    page: 1,
    limit: COMMUNITY_LIST_LIMIT,
    category: selectedTab.category,
  });

  const displayedBoards = useMemo(() => {
    const boards = communityBoardListQuery.data?.boards ?? [];

    if (!selectedTab.isUiOnly) {
      return boards;
    }

    return [...boards].sort((left, right) => {
      return (
        getCommunityBoardPopularityScore(right) - getCommunityBoardPopularityScore(left) ||
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }, [communityBoardListQuery.data?.boards, selectedTab.isUiOnly]);

  const handleTabClick = (tabKey: CommunityBoardListTabKey) => {
    const nextTab = COMMUNITY_BOARD_LIST_TABS.find((tab) => tab.key === tabKey);

    if (nextTab?.isUiOnly && !popularHintShownRef.current) {
      openToast("인기순은 현재 불러온 게시글 기준으로만 정렬돼요.");
      popularHintShownRef.current = true;
    }

    setSelectedTabKey(tabKey);
  };

  const handleWriteClick = () => {
    if (!isSignIn) {
      openToast("로그인 후 게시글을 작성할 수 있어요.");
      navigate("/login");
      return;
    }

    navigate("/community/write");
  };

  return (
    <>
      <Page>
        <StickyHeader>
          <Header>
            <Title>커뮤니티</Title>
            <IconButton
              type="button"
              onClick={() => navigate("/community/notifications")}
              aria-label="알림 페이지로 이동"
            >
              <CommunityBellIcon hasBadge={hasUnreadNotifications} />
            </IconButton>
          </Header>
          <TabList>
            {COMMUNITY_BOARD_LIST_TABS.map((tab) => (
              <TabButton
                key={tab.key}
                type="button"
                className={
                  selectedTabKey === tab.key ? "border-b-[1.2px] border-gray-800 text-gray-800 font-16-sb" : ""
                }
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </TabButton>
            ))}
          </TabList>
        </StickyHeader>

        {selectedTab.isUiOnly ? <PopularHint>현재는 UI 기준 인기 정렬만 지원해요.</PopularHint> : null}

        <BoardList>
          {communityBoardListQuery.isPending ? (
            <SkeletonList>
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={`community-skeleton-${index}`}>
                  <SkeletonChip />
                  <SkeletonTitle />
                  <SkeletonBody />
                  <SkeletonBody className="w-180" />
                </SkeletonCard>
              ))}
            </SkeletonList>
          ) : null}

          {communityBoardListQuery.isError ? (
            <StatusBox>게시글을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</StatusBox>
          ) : null}

          {!communityBoardListQuery.isPending && !communityBoardListQuery.isError && displayedBoards.length === 0 ? (
            <StatusBox>아직 등록된 게시글이 없어요.</StatusBox>
          ) : null}

          {displayedBoards.map((board) => (
            <CommunityBoardCard key={board._id} board={board} />
          ))}
        </BoardList>

        <FloatingWriteLayer>
          <FloatingWriteButton type="button" onClick={handleWriteClick} aria-label="게시글 작성">
            <CommunityWriteIcon />
          </FloatingWriteButton>
        </FloatingWriteLayer>

        <BottomSpace />
      </Page>
      <AppBar />
    </>
  );
};

const Page = render.section("relative min-h-[100dvh] w-full bg-white");

const StickyHeader = render.div("sticky top-0 z-20 bg-white");

const Header = render.div("flex items-center justify-between px-20 pt-20 pb-16");

const Title = render.div("font-20-sb text-black");

const IconButton = render.button("flex h-24 w-24 items-center justify-center border-none bg-transparent p-0");

const TabList = render.div("flex items-center border-0 border-b border-solid border-border px-8");

const TabButton = render.button(
  "h-44 border-0 border-b-[1.2px] border-solid border-transparent bg-transparent px-12 font-16-r text-gray-500",
);

const PopularHint = render.div("mx-20 mt-12 rounded-[8px] bg-light-orange px-12 py-8 font-12-r text-orange");

const BoardList = render.div("flex flex-col pb-24");

const SkeletonList = render.div("flex flex-col");

const SkeletonCard = render.div("border-0 border-b border-solid border-border px-20 py-18");

const SkeletonChip = render.div("mb-8 h-20 w-44 rounded-[4px] bg-border");

const SkeletonTitle = render.div("h-24 w-220 rounded-[6px] bg-border");

const SkeletonBody = render.div("mt-8 h-18 w-full rounded-[6px] bg-border");

const StatusBox = render.div("px-20 py-80 text-center font-16-r text-gray-500");

const FloatingWriteLayer = render.div("fixed bottom-82 left-1/2 z-30 flex w-390 -translate-x-1/2 justify-end px-20");

const FloatingWriteButton = render.button(
  "flex h-56 w-56 items-center justify-center rounded-full border-none bg-orange p-0 shadow-[0px_4px_10px_rgba(0,0,0,0.16)]",
);

const BottomSpace = render.div("h-55 min-h-55");

export default CommunityPage;
