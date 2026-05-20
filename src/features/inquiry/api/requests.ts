import { apiClient } from '@/shared/api'
import type { CreateInquiryRequest } from '../model'

export const inquiryApi = {
  create(data: CreateInquiryRequest) {
    return apiClient.post<void>('/mypage/inquiry', data)
  },
}
