import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api'
import type { Banner, RamenyaGroup } from '../model'
import { curationQueryKeys } from './query-keys'
import { curationApi } from './requests'

export function useBannerQuery(
  options?: Omit<UseQueryOptions<Banner[], ApiError, Banner[]>, 'queryKey' | 'queryFn'>,
) {
  const bannerQuery = useQuery<Banner[], ApiError, Banner[]>({
    queryKey: curationQueryKeys.banners(),
    queryFn: curationApi.getBanners,
    select: (banners) => (Array.isArray(banners) ? [...banners].sort((a, b) => a.priority - b.priority) : []),
    ...options,
  })

  return { bannerQuery }
}

export function useRamenyaGroupQuery(
  options?: Omit<UseQueryOptions<RamenyaGroup[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  const ramenyaGroupQuery = useQuery<RamenyaGroup[], ApiError>({
    queryKey: curationQueryKeys.ramenyaGroups(),
    queryFn: curationApi.getRamenyaGroups,
    ...options,
  })

  return { ramenyaGroupQuery }
}
