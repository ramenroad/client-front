import { useApiMutation, type ApiMutationOptions } from '@/shared/api'
import type { CreateRamenCalendarEntryRequest, RamenCalendarEntry } from '../model'
import { ramenCalendarMutationKeys } from './query-keys'
import { ramenCalendarApi } from './requests'
import type { UpdateRamenCalendarEntryVariables } from './types'

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

export function useUpdateRamenCalendarEntryMutation(
  options?: ApiMutationOptions<RamenCalendarEntry, UpdateRamenCalendarEntryVariables>,
) {
  return useApiMutation<RamenCalendarEntry, UpdateRamenCalendarEntryVariables>(
    ({ id, data }) => ramenCalendarApi.update(id, data),
    {
      mutationKey: ramenCalendarMutationKeys.update(),
      ...options,
    },
  )
}
