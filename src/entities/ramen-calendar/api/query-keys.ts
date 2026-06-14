import type { RamenCalendarListParams } from '../model'

export const ramenCalendarQueryKeys = {
  all: ['ramen-calendar'] as const,
  list: (params: RamenCalendarListParams) => [...ramenCalendarQueryKeys.all, 'list', params] as const,
}

export const ramenCalendarMutationKeys = {
  create: () => [...ramenCalendarQueryKeys.all, 'create'] as const,
  delete: () => [...ramenCalendarQueryKeys.all, 'delete'] as const,
}
