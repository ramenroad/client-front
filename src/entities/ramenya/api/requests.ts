import { apiClient } from '@/shared/api'
import type {
  NearbyRamenyaParams,
  NearbyRamenyasResponse,
  RamenyaDetail,
  RamenyaListParams,
  RamenyaSummary,
} from '../model'

const RAMENYA_PATH = '/v1/ramenya'

export const ramenyaApi = {
  getNearby(params: NearbyRamenyaParams) {
    return apiClient.get<NearbyRamenyasResponse>(`${RAMENYA_PATH}/nearby`, { params })
  },

  getAll(params?: RamenyaListParams) {
    return apiClient.get<RamenyaSummary[]>(`${RAMENYA_PATH}/all`, { params })
  },

  getRegions() {
    return apiClient.get<string[]>(`${RAMENYA_PATH}/regions`)
  },

  getById(id: string) {
    return apiClient.get<RamenyaDetail>(`${RAMENYA_PATH}/${id}`)
  },
}
