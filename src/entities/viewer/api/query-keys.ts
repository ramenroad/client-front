export const viewerQueryKeys = {
  all: () => ['viewer'] as const,
  myInfo: () => [...viewerQueryKeys.all(), 'my-info'] as const,
  userInfo: (userId: string) => [...viewerQueryKeys.all(), 'user-info', userId] as const,
}
