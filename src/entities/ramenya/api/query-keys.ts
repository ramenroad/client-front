import type { NearbyRamenyaParams, RamenyaListParams } from '../model'

export const ramenyaQueryKeys = {
  all: () => ['ramenya'] as const,
  nearby: (params?: NearbyRamenyaParams | null) =>
    [
      ...ramenyaQueryKeys.all(),
      'nearby',
      params?.latitude,
      params?.longitude,
      params?.radius,
    ] as const,
  list: (params?: RamenyaListParams) => [...ramenyaQueryKeys.all(), 'list', params] as const,
  detail: (id: string) => [...ramenyaQueryKeys.all(), 'detail', id] as const,
  regions: () => [...ramenyaQueryKeys.all(), 'regions'] as const,
}
