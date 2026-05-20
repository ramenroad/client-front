import type { SearchParams } from '../model'

export const searchQueryKeys = {
  results: (params?: SearchParams | null) =>
    [
      'search',
      'results',
      params?.query,
      params?.latitude,
      params?.longitude,
      params?.radius,
      params?.inLocation,
    ] as const,
  autocomplete: (query: string) => ['search', 'autocomplete', query] as const,
  recentSearchKeywords: () => ['search', 'recent'] as const,
}

export const searchMutationKeys = {
  deleteRecentSearchKeywords: () => ['search', 'recent', 'delete'] as const,
}
