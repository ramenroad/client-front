import { useApiQuery, type ApiQueryOptions } from '@/shared/api'
import type { Banner, RamenyaGroup } from '../model'
import { curationQueryKeys } from './query-keys'
import { curationApi } from './requests'

export function useBannerQuery(options?: ApiQueryOptions<Banner[]>) {
  const bannerQuery = useApiQuery<Banner[]>({
    queryKey: curationQueryKeys.banners(),
    queryFn: curationApi.getBanners,
    select: (banners) => (Array.isArray(banners) ? [...banners].sort((a, b) => a.priority - b.priority) : []),
    ...options,
  })

  return { bannerQuery }
}

export function useRamenyaGroupQuery(options?: ApiQueryOptions<RamenyaGroup[]>) {
  const ramenyaGroupQuery = useApiQuery<RamenyaGroup[]>({
    queryKey: curationQueryKeys.ramenyaGroups(),
    queryFn: curationApi.getRamenyaGroups,
    ...options,
  })

  return { ramenyaGroupQuery }
}
