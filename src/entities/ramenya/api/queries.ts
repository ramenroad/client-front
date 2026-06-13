import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { NearbyRamenyaParams, NearbyRamenyasResponse, RamenyaDetail, RamenyaListParams, RamenyaSummary } from '../model'
import { ramenyaQueryKeys } from './query-keys'
import { ramenyaApi } from './requests'

export function useNearbyRamenyasQuery(
  params: NearbyRamenyaParams | null,
  options?: ApiQueryOptions<NearbyRamenyasResponse>,
) {
  return useApiQuery<NearbyRamenyasResponse>({
    queryKey: ramenyaQueryKeys.nearby(params),
    queryFn: () => {
      if (!params) {
        throw new Error('Nearby ramenya params are required.')
      }

      return ramenyaApi.getNearby(params)
    },
    enabled: Boolean(params),
    ...options,
  })
}

export function useRamenyaListQuery(params?: RamenyaListParams, options?: ApiQueryOptions<RamenyaSummary[]>) {
  return useApiQuery<RamenyaSummary[]>({
    queryKey: ramenyaQueryKeys.list(params),
    queryFn: () => ramenyaApi.getAll(params),
    ...options,
  })
}

export function useRamenyaDetailQuery(id: string, options?: ApiQueryOptions<RamenyaDetail>) {
  return useApiQuery<RamenyaDetail>({
    queryKey: ramenyaQueryKeys.detail(id),
    queryFn: () => ramenyaApi.getById(id),
    enabled: Boolean(id),
    ...options,
  })
}

export function useRamenyaRegionsQuery(options?: ApiQueryOptions<string[]>) {
  return useApiQuery<string[]>({
    queryKey: ramenyaQueryKeys.regions(),
    queryFn: ramenyaApi.getRegions,
    ...options,
  })
}
