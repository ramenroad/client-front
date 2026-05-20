import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api'
import type { AutocompleteResponse, RecentSearchKeywordsResponse, SearchParams, SearchResult } from '../model'
import { searchQueryKeys } from './query-keys'
import { searchApi } from './requests'

export function useSearchResultsQuery(
  params: SearchParams | null,
  options?: Omit<UseQueryOptions<SearchResult[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<SearchResult[], ApiError>({
    queryKey: searchQueryKeys.results(params),
    queryFn: () => {
      if (!params) {
        throw new Error('Search params are required.')
      }

      return searchApi.search(params)
    },
    enabled: Boolean(params?.query.trim()),
    ...options,
  })
}

export function useSearchAutocompleteQuery(
  query: string,
  options?: Omit<UseQueryOptions<AutocompleteResponse, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<AutocompleteResponse, ApiError>({
    queryKey: searchQueryKeys.autocomplete(query),
    queryFn: () => searchApi.getAutocomplete(query),
    enabled: query.trim().length > 0,
    ...options,
  })
}

export function useRecentSearchKeywordsQuery(
  options?: Omit<UseQueryOptions<RecentSearchKeywordsResponse, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<RecentSearchKeywordsResponse, ApiError>({
    queryKey: searchQueryKeys.recentSearchKeywords(),
    queryFn: searchApi.getRecentSearchKeywords,
    ...options,
  })
}
