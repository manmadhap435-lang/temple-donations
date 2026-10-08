import type { ApiResponse, PagedResponse } from '../types/api'
import type { Donation, DonationCategory } from '../types'
import { apiClient } from './client'

export const donationApi = {
  getCategories: (includeInactive = false) =>
    apiClient.get<ApiResponse<DonationCategory[]>>('/api/donations/categories', {
      params: { includeInactive },
    }),

  create: (donationCategoryId: number, amount: number) =>
    apiClient.post<ApiResponse<{ donationId: number; donationNumber: string }>>(
      '/api/donations',
      { donationCategoryId, amount },
    ),

  getMy: (pageNumber = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<PagedResponse<Donation>>>('/api/donations/my', {
      params: { pageNumber, pageSize },
    }),

  getAll: (params: {
    pageNumber?: number
    pageSize?: number
    search?: string
    categoryId?: number
    paymentStatus?: string
    fromDate?: string
    toDate?: string
  }) => apiClient.get<ApiResponse<PagedResponse<Donation>>>('/api/donations', { params }),

  updatePaymentStatus: (
    id: number,
    paymentStatus: string,
    paymentReference?: string,
    transactionDate?: string,
  ) =>
    apiClient.put<ApiResponse<object>>(`/api/donations/${id}/payment-status`, {
      paymentStatus,
      paymentReference,
      transactionDate,
    }),
}
