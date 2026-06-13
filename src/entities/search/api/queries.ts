import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { AutocompleteResponse, RecentSearchKeywordsResponse, SearchParams, SearchResult } from '../model'
import { searchQueryKeys } from './query-keys'
import { searchApi } from './requests'

export function useSearchResultsQuery(params: SearchParams | null, options?: ApiQueryOptions<SearchResult[]>) {
  return useApiQuery<SearchResult[]>({
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

export function useSearchAutocompleteQuery(query: string, options?: ApiQueryOptions<AutocompleteResponse>) {
  return useApiQuery<AutocompleteResponse>({
    queryKey: searchQueryKeys.autocomplete(query),
    queryFn: () => searchApi.getAutocomplete(query),
    enabled: query.trim().length > 0,
    ...options,
  })
}

export function useRecentSearchKeywordsQuery(options?: ApiQueryOptions<RecentSearchKeywordsResponse>) {
  return useApiQuery<RecentSearchKeywordsResponse>({
    queryKey: searchQueryKeys.recentSearchKeywords(),
    queryFn: searchApi.getRecentSearchKeywords,
    ...options,
  })
}
