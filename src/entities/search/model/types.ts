import type { Id } from '@/shared/model'

export type SearchBusinessHour = {
  day: string
  operatingTime?: string
  breakTime?: string
  isOpen: boolean
}

export type SearchParams = {
  query: string
  latitude?: number
  longitude?: number
  radius?: number
  inLocation?: boolean
}

export type SearchResult = {
  _id: Id
  name: string
  genre: string[]
  address: string
  latitude: number
  longitude: number
  businessHours: SearchBusinessHour[]
  thumbnailUrl: string
  menus: string[]
  rating: number
  reviewCount: number
}

export type RecentSearchKeyword = {
  _id: Id
  keyword: string
}

export type RecentSearchRamenyaInfo = {
  _id: Id
  businessHours: SearchBusinessHour[]
}

export type RecentSearchRamenyaName = {
  _id: Id
  keyword: string
  ramenyaId?: RecentSearchRamenyaInfo | Id
}

export type RecentSearchKeywordsResponse = {
  searchKeywords: RecentSearchKeyword[]
  ramenyaNames: RecentSearchRamenyaName[]
}

export type DeleteRecentSearchKeywordsRequest = {
  keywordId: string[]
}

export type AutocompleteRamenyaResult = {
  _id: Id
  name: string
  businessHours: SearchBusinessHour[]
}

export type AutocompleteKeywordResult = {
  _id: Id
  name: string
  businessHours: SearchBusinessHour[]
}

export type AutocompleteResponse = {
  ramenyaSearchResults: AutocompleteRamenyaResult[]
  keywordSearchResults: AutocompleteKeywordResult[]
}
