import { apiClient } from '@/shared/api'
import type {
  AutocompleteResponse,
  DeleteRecentSearchKeywordsRequest,
  RecentSearchKeywordsResponse,
  SearchParams,
  SearchResult,
} from '../model'

const SEARCH_PATH = '/search'

export const searchApi = {
  search(params: SearchParams) {
    return apiClient.get<SearchResult[]>(SEARCH_PATH, { params })
  },

  getRecentSearchKeywords() {
    return apiClient.get<RecentSearchKeywordsResponse>(`${SEARCH_PATH}/recent`)
  },

  deleteRecentSearchKeywords(data: DeleteRecentSearchKeywordsRequest) {
    return apiClient.delete<void>(`${SEARCH_PATH}/recent`, { data })
  },

  getAutocomplete(query: string) {
    return apiClient.get<AutocompleteResponse>(`${SEARCH_PATH}/autocomplete`, {
      params: { query },
    })
  },
}
