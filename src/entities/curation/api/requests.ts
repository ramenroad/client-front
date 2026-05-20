import { apiClient } from '@/shared/api'
import type { Banner, RamenyaGroup } from '../model'

export const curationApi = {
  getBanners() {
    return apiClient.get<Banner[]>('/banner')
  },

  getRamenyaGroups() {
    return apiClient.get<RamenyaGroup[]>('/v1/ramenya/group/all')
  },
}
