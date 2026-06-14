import type { Id, ISODateString } from '@/shared/model'

// 'YYYY-MM-DD' 날짜 전용 문자열(시각 없음). 풀 ISO datetime이 아님을 표시하는 별칭.
export type CalendarDateString = string

export type RamenCalendarEntry = {
  _id: Id
  visitDate: CalendarDateString
  ramenyaName: string
  ramenyaId?: Id | null
  menus: string[]
  createdAt?: ISODateString
  updatedAt?: ISODateString
}

export type CreateRamenCalendarEntryRequest = {
  visitDate: CalendarDateString
  ramenyaName: string
  ramenyaId?: Id | null
  menus: string[]
}

// month는 1~12 (서버 컨벤션), JS Date의 0~11이 아님.
export type RamenCalendarListParams = {
  year: number
  month: number
}
