export const COMMUNITY_NOTIFICATION_READ_STORAGE_KEY = 'community.notifications.read'

export interface CommunityNotificationItem {
  id: string
  title: string
  message: string
  excerpt?: string
  timeLabel: string
  unread?: boolean
}

export const COMMUNITY_NOTIFICATION_MOCKS: readonly CommunityNotificationItem[] = [
  {
    id: 'comment-1',
    title: '새 댓글 알림',
    message: '회원님의 게시글에 박영희님이 댓글을 남겼습니다.',
    excerpt: '이런 정보 너무 좋아요 앞으로도 많이 많이 작성해주세요!',
    timeLabel: '5분 전',
    unread: true,
  },
  {
    id: 'like-1',
    title: '좋아요 알림',
    message: '회원님의 게시글에 라이징님이 좋아요를 눌렀습니다.',
    timeLabel: '12분 전',
    unread: true,
  },
  {
    id: 'like-2',
    title: '좋아요 알림',
    message: '회원님의 게시글에 해피님 외 3명이 좋아요를 눌렀습니다.',
    timeLabel: '1시간 전',
  },
] as const
