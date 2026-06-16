import { CommunityBoardCard } from '@/entities/community/ui'
import { useAppEnv } from '@/shared/app-env'
import { IconNotification, IconWriteButton } from '@/shared/ui/icon'
import render from '@/shared/ui/render'
import AppBar from '@/widgets/navigation/app-bar'
import { useCommunityPage } from '../model/useCommunityPage'

const CommunityPage = () => {
  const {
    tabs,
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

  // 앱: 웹 하단 AppBar는 미렌더(네이티브 탭바가 대체) — 중복 방지. 하단 예약은 --app-bottom-space로 유지.
  const { isApp } = useAppEnv()

  return (
    <>
      <Page>
        <StickyHeader>
          <Header>
            <Title>커뮤니티</Title>
            <IconButton type="button" onClick={handleNotificationClick} aria-label="알림 페이지로 이동">
              <IconNotification indicator={hasUnreadNotifications} />
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
            <IconWriteButton />
          </FloatingWriteButton>
        </FloatingWriteLayer>

        <BottomSpace />
      </Page>
      {!isApp && <AppBar />}
    </>
  )
}

// 앱: #root 상단 안전영역 패딩을 음수 마진으로 상쇄해 페이지가 화면 최상단에서 시작 → sticky 헤더가 상태바 영역까지 덮는다.
const Page = render.section('relative mt-[calc(-1*var(--safe-top))] min-h-[100dvh] w-full bg-white')

// 제목 + 탭(전체/이벤트/신장개업/질문)을 함께 상단 고정. top-0으로 상태바까지 덮고, pt-[--safe-top]으로 내용은 상태바 아래에 둔다.
const StickyHeader = render.div('sticky top-0 z-20 bg-white pt-[var(--safe-top)]')

const Header = render.div('flex items-center justify-between px-20 pb-16 pt-20')

const Title = render.h1('m-0 font-20-sb text-black')

const IconButton = render.button('flex h-24 w-24 cursor-pointer items-center justify-center border-none bg-transparent p-0')

const TabList = render.div('flex items-center border-0 border-b border-solid border-border px-8')

const TabButton = render.button(
  'h-44 cursor-pointer border-0 border-b-[1.2px] border-solid border-transparent bg-transparent px-12 font-16-r text-gray-500',
)

const BoardList = render.div('flex flex-col pb-24')

const SkeletonList = render.div('flex flex-col')

const SkeletonCard = render.div('border-0 border-b border-solid border-border px-20 py-18')

const SkeletonChip = render.div('mb-8 h-20 w-44 rounded-4 bg-border')

const SkeletonTitle = render.div('h-24 w-220 rounded-8 bg-border')

const SkeletonBody = render.div('mt-8 h-18 w-full rounded-8 bg-border')

const StatusBox = render.div('px-20 py-80 text-center font-16-r text-gray-500')

// 버튼 SVG에 그림자용 10px 여백이 내장돼 있어, 우측 패딩 10px이면 원이 우측 20px에 위치.
const FloatingWriteLayer = render.div('fixed bottom-82 left-1/2 z-30 flex w-390 -translate-x-1/2 justify-end pr-10')

const FloatingWriteButton = render.button(
  'flex cursor-pointer items-center justify-center border-none bg-transparent p-0 transition-transform hover:scale-105',
)

const ObserverTarget = render.div('h-1')

// 웹 55(AppBar 스페이서) / 앱 네이티브 탭바 높이(--app-bottom-space=--safe-bottom). AppBarLayout Space와 동일.
const BottomSpace = render.div('h-[var(--app-bottom-space)] min-h-[var(--app-bottom-space)]')

export default CommunityPage
