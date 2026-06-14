import { apiClient } from '@/shared/api'
import type { CreateRamenCalendarEntryRequest, RamenCalendarEntry, RamenCalendarListParams } from '../model'

const RAMEN_CALENDAR_PATH = '/ramen-calendar'

export const ramenCalendarApi = {
  list(params: RamenCalendarListParams) {
    return apiClient.get<RamenCalendarEntry[]>(RAMEN_CALENDAR_PATH, { params })
  },
  create(data: CreateRamenCalendarEntryRequest) {
    return apiClient.post<RamenCalendarEntry, CreateRamenCalendarEntryRequest>(RAMEN_CALENDAR_PATH, data)
  },
  remove(id: string) {
    return apiClient.delete<void>(`${RAMEN_CALENDAR_PATH}/${id}`)
  },
}
