import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { RamenCalendarEntry } from '../model'
import { ramenCalendarQueryKeys } from './query-keys'
import { ramenCalendarApi } from './requests'

export function useRamenCalendarEntriesQuery(
  year: number,
  month: number,
  options?: ApiQueryOptions<RamenCalendarEntry[]>,
) {
  return useApiQuery<RamenCalendarEntry[]>({
    queryKey: ramenCalendarQueryKeys.list({ year, month }),
    queryFn: () => ramenCalendarApi.list({ year, month }),
    ...options,
  })
}
