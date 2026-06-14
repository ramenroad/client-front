import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { CreateRamenCalendarEntryRequest, RamenCalendarEntry } from '../model'
import { ramenCalendarMutationKeys } from './query-keys'
import { ramenCalendarApi } from './requests'

export function useCreateRamenCalendarEntryMutation(
  options?: ApiMutationOptions<RamenCalendarEntry, CreateRamenCalendarEntryRequest>,
) {
  return useApiMutation<RamenCalendarEntry, CreateRamenCalendarEntryRequest>(ramenCalendarApi.create, {
    mutationKey: ramenCalendarMutationKeys.create(),
    ...options,
  })
}

export function useDeleteRamenCalendarEntryMutation(options?: ApiMutationOptions<void, string>) {
  return useApiMutation<void, string>((id: string) => ramenCalendarApi.remove(id), {
    mutationKey: ramenCalendarMutationKeys.delete(),
    ...options,
  })
}
