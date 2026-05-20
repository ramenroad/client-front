import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api'
import type { NearbyRamenyaParams, NearbyRamenyasResponse, RamenyaDetail, RamenyaListParams, RamenyaSummary } from '../model'
import { ramenyaQueryKeys } from './query-keys'
import { ramenyaApi } from './requests'

export function useNearbyRamenyasQuery(
  params: NearbyRamenyaParams | null,
  options?: Omit<UseQueryOptions<NearbyRamenyasResponse, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<NearbyRamenyasResponse, ApiError>({
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

export function useRamenyaListQuery(
  params?: RamenyaListParams,
  options?: Omit<UseQueryOptions<RamenyaSummary[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<RamenyaSummary[], ApiError>({
    queryKey: ramenyaQueryKeys.list(params),
    queryFn: () => ramenyaApi.getAll(params),
    ...options,
  })
}

export function useRamenyaDetailQuery(
  id: string,
  options?: Omit<UseQueryOptions<RamenyaDetail, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<RamenyaDetail, ApiError>({
    queryKey: ramenyaQueryKeys.detail(id),
    queryFn: () => ramenyaApi.getById(id),
    enabled: Boolean(id),
    ...options,
  })
}

export function useRamenyaRegionsQuery(
  options?: Omit<UseQueryOptions<string[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<string[], ApiError>({
    queryKey: ramenyaQueryKeys.regions(),
    queryFn: ramenyaApi.getRegions,
    ...options,
  })
}
