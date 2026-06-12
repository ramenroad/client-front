export const activityQueryKeys = {
  all: ['activity'] as const,
  myPosts: () => [...activityQueryKeys.all, 'my-posts'] as const,
  myComments: () => [...activityQueryKeys.all, 'my-comments'] as const,
  recentViewedRamenya: () => [...activityQueryKeys.all, 'recent-viewed-ramenya'] as const,
}
