import { apiClient } from '@/shared/api'
import type {
  CreateRamenCalendarEntryRequest,
  RamenCalendarEntry,
  RamenCalendarListParams,
  UpdateRamenCalendarEntryRequest,
} from '../model'

const RAMEN_CALENDAR_PATH = '/ramen-calendar'

export const ramenCalendarApi = {
  list(params: RamenCalendarListParams) {
    return apiClient.get<RamenCalendarEntry[]>(RAMEN_CALENDAR_PATH, { params })
  },
  create(data: CreateRamenCalendarEntryRequest) {
    return apiClient.post<RamenCalendarEntry, CreateRamenCalendarEntryRequest>(RAMEN_CALENDAR_PATH, data)
  },
  update(id: string, data: UpdateRamenCalendarEntryRequest) {
    return apiClient.patch<RamenCalendarEntry, UpdateRamenCalendarEntryRequest>(`${RAMEN_CALENDAR_PATH}/${id}`, data)
  },
  remove(id: string) {
    return apiClient.delete<void>(`${RAMEN_CALENDAR_PATH}/${id}`)
  },
}
