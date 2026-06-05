import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCommunityBoardsInfiniteQuery } from '@/entities/community/api'
import {
  COMMUNITY_BOARD_LIST_TABS,
  COMMUNITY_NOTIFICATION_MOCKS,
  COMMUNITY_NOTIFICATION_READ_STORAGE_KEY,
  type CommunityBoardListTabKey,
} from '@/entities/community/model'
import { getCommunityBoardPopularityScore } from '@/entities/community/lib'
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
  const popularHintShownRef = useRef(false)
  const [selectedTabKey, setSelectedTabKey] = useState<CommunityBoardListTabKey>('all')
  const selectedTab = COMMUNITY_BOARD_LIST_TABS.find((tab) => tab.key === selectedTabKey) ?? COMMUNITY_BOARD_LIST_TABS[0]
  const communityBoardListQuery = useCommunityBoardsInfiniteQuery({
    limit: COMMUNITY_LIST_LIMIT,
    category: selectedTab.category,
  })

  const boards = useMemo(
    () => communityBoardListQuery.data?.pages.flatMap((page) => page.boards) ?? [],
    [communityBoardListQuery.data],
  )

  const displayedBoards = useMemo(() => {
    if (!selectedTab.isUiOnly) {
      return boards
    }

    return [...boards].sort((left, right) => {
      return (
        getCommunityBoardPopularityScore(right) - getCommunityBoardPopularityScore(left) ||
        new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
      )
    })
  }, [boards, selectedTab.isUiOnly])

  const observerRef = useIntersectionObserver({
    enabled: Boolean(communityBoardListQuery.hasNextPage && !communityBoardListQuery.isFetchingNextPage),
    onIntersect: () => {
      void communityBoardListQuery.fetchNextPage()
    },
    rootMargin: '120px',
  })

  const handleTabClick = (tabKey: CommunityBoardListTabKey) => {
    const nextTab = COMMUNITY_BOARD_LIST_TABS.find((tab) => tab.key === tabKey)

    if (nextTab?.isUiOnly && !popularHintShownRef.current) {
      openToast('인기순은 현재 불러온 게시글 기준으로만 정렬돼요.')
      popularHintShownRef.current = true
    }

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
    selectedTab,
    selectedTabKey,
    displayedBoards,
    hasUnreadNotifications: hasUnreadCommunityNotifications(),
    isLoading: communityBoardListQuery.isPending,
    isError: communityBoardListQuery.isError,
    observerRef,
    handleTabClick,
    handleWriteClick,
    handleNotificationClick: () => navigate('/community/notifications'),
  }
}
