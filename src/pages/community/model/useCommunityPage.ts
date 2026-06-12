import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCommunityBoardsInfiniteQuery } from '@/entities/community/api'
import {
  COMMUNITY_BOARD_LIST_TABS,
  COMMUNITY_NOTIFICATION_MOCKS,
  COMMUNITY_NOTIFICATION_READ_STORAGE_KEY,
  type CommunityBoardListTabKey,
} from '@/entities/community/model'
import { useAuthSession } from '@/entities/session/model'
import { useIntersectionObserver } from '@/shared/lib/useIntersectionObserver'
import { useToast } from '@/shared/ui/toast'

const COMMUNITY_LIST_LIMIT = 20

const hasUnreadCommunityNotifications = () => {
  if (typeof window === 'undefined') {
    return COMMUNITY_NOTIFICATION_MOCKS.some((notification) => notification.unread)
  }

  return (
    localStorage.getItem(COMMUNITY_NOTIFICATION_READ_STORAGE_KEY) !== 'read' &&
    COMMUNITY_NOTIFICATION_MOCKS.some((notification) => notification.unread)
  )
}

export const useCommunityPage = () => {
  const navigate = useNavigate()
  const { isSignIn } = useAuthSession()
  const { openToast } = useToast()
  const [selectedTabKey, setSelectedTabKey] = useState<CommunityBoardListTabKey>('all')
  const selectedTab = COMMUNITY_BOARD_LIST_TABS.find((tab) => tab.key === selectedTabKey) ?? COMMUNITY_BOARD_LIST_TABS[0]
  const communityBoardListQuery = useCommunityBoardsInfiniteQuery({
    limit: COMMUNITY_LIST_LIMIT,
    category: selectedTab.category,
  })

  const displayedBoards = useMemo(
    () => communityBoardListQuery.data?.pages.flatMap((page) => page.boards) ?? [],
    [communityBoardListQuery.data],
  )

  const observerRef = useIntersectionObserver({
    enabled: Boolean(communityBoardListQuery.hasNextPage && !communityBoardListQuery.isFetchingNextPage),
    onIntersect: () => {
      void communityBoardListQuery.fetchNextPage()
    },
    rootMargin: '120px',
  })

  const handleTabClick = (tabKey: CommunityBoardListTabKey) => {
    setSelectedTabKey(tabKey)
  }

  const handleWriteClick = () => {
    if (!isSignIn) {
      openToast('로그인 후 게시글을 작성할 수 있어요.')
      navigate('/login')
      return
    }

    navigate('/community/write')
  }

  return {
    tabs: COMMUNITY_BOARD_LIST_TABS,
    selectedTabKey,
    displayedBoards,
    hasUnreadNotifications: hasUnreadCommunityNotifications(),
    isLoading: communityBoardListQuery.isPending,
    isError: communityBoardListQuery.isError,
    observerRef,
    handleTabClick,
    handleWriteClick,
    // 알림은 아직 서버 미구현(클라 목업)이라 진입 대신 안내 토스트만 노출한다.
    handleNotificationClick: () => openToast('알림 기능은 개발 예정이에요.'),
  }
}
