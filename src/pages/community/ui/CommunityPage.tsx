import { CommunityBellIcon, CommunityBoardCard, CommunityWriteIcon } from '@/entities/community/ui'
import render from '@/shared/ui/render'
import AppBar from '@/widgets/navigation/app-bar'
import { useCommunityPage } from '../model/useCommunityPage'

const CommunityPage = () => {
  const {
    tabs,
    selectedTab,
    selectedTabKey,
    displayedBoards,
    hasUnreadNotifications,
    isLoading,
    isError,
    observerRef,
    handleTabClick,
    handleWriteClick,
    handleNotificationClick,
  } = useCommunityPage()

  return (
    <>
      <Page>
        <StickyHeader>
          <Header>
            <Title>커뮤니티</Title>
            <IconButton type="button" onClick={handleNotificationClick} aria-label="알림 페이지로 이동">
              <CommunityBellIcon hasBadge={hasUnreadNotifications} />
            </IconButton>
          </Header>
          <TabList>
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                type="button"
                className={selectedTabKey === tab.key ? 'border-gray-800 font-16-sb text-gray-800' : ''}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </TabButton>
            ))}
          </TabList>
        </StickyHeader>

        {selectedTab.isUiOnly ? <PopularHint>현재는 UI 기준 인기 정렬만 지원해요.</PopularHint> : null}

        <BoardList>
          {isLoading ? (
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

          {isError ? <StatusBox>게시글을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</StatusBox> : null}

          {!isLoading && !isError && displayedBoards.length === 0 ? <StatusBox>아직 등록된 게시글이 없어요.</StatusBox> : null}

          {displayedBoards.map((board) => (
            <CommunityBoardCard key={board._id} board={board} />
          ))}
          <ObserverTarget ref={observerRef} />
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
  )
}

const Page = render.section('relative min-h-[100dvh] w-full bg-white')

const StickyHeader = render.div('sticky top-0 z-20 bg-white')

const Header = render.div('flex items-center justify-between px-20 pb-16 pt-20')

const Title = render.h1('m-0 font-20-sb text-black')

const IconButton = render.button('flex h-24 w-24 cursor-pointer items-center justify-center border-none bg-transparent p-0')

const TabList = render.div('flex items-center border-0 border-b border-solid border-border px-8')

const TabButton = render.button(
  'h-44 cursor-pointer border-0 border-b-[1.2px] border-solid border-transparent bg-transparent px-12 font-16-r text-gray-500',
)

const PopularHint = render.div('mx-20 mt-12 rounded-8 bg-light-orange px-12 py-8 font-12-r text-orange')

const BoardList = render.div('flex flex-col pb-24')

const SkeletonList = render.div('flex flex-col')

const SkeletonCard = render.div('border-0 border-b border-solid border-border px-20 py-18')

const SkeletonChip = render.div('mb-8 h-20 w-44 rounded-4 bg-border')

const SkeletonTitle = render.div('h-24 w-220 rounded-8 bg-border')

const SkeletonBody = render.div('mt-8 h-18 w-full rounded-8 bg-border')

const StatusBox = render.div('px-20 py-80 text-center font-16-r text-gray-500')

const FloatingWriteLayer = render.div('fixed bottom-82 left-1/2 z-30 flex w-390 -translate-x-1/2 justify-end px-20')

const FloatingWriteButton = render.button(
  'flex h-56 w-56 cursor-pointer items-center justify-center rounded-full border-none bg-orange p-0 shadow-[0px_4px_10px_rgba(0,0,0,0.16)]',
)

const ObserverTarget = render.div('h-1')

const BottomSpace = render.div('h-55 min-h-55')

export default CommunityPage
