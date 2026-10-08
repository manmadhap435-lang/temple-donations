import type { ApiResponse, PagedResponse } from '../types/api'
import type { Announcement, Application, Scheme } from '../types'
import { apiClient } from './client'

export const applicationApi = {
  getSchemes: (search?: string) =>
    apiClient.get<ApiResponse<Scheme[]>>('/api/applications/schemes', { params: { search } }),

  create: (schemeId: number, remarks?: string) =>
    apiClient.post<ApiResponse<{ applicationId: number; applicationNumber: string }>>(
      '/api/applications',
      { schemeId, remarks },
    ),

  getMy: (pageNumber = 1, pageSize = 10, status?: string) =>
    apiClient.get<ApiResponse<PagedResponse<Application>>>('/api/applications/my', {
      params: { pageNumber, pageSize, status },
    }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Application>>(`/api/applications/${id}`),

  getAll: (params: {
    pageNumber?: number
    pageSize?: number
    search?: string
    schemeId?: number
    status?: string
    fromDate?: string
    toDate?: string
  }) => apiClient.get<ApiResponse<PagedResponse<Application>>>('/api/applications', { params }),

  updateStatus: (id: number, newStatus: string, remarks?: string) =>
    apiClient.put<ApiResponse<object>>(`/api/applications/${id}/status`, { newStatus, remarks }),
}

export const announcementApi = {
  getPublished: (pageNumber = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<PagedResponse<Announcement>>>('/api/announcements', {
      params: { pageNumber, pageSize },
    }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Announcement>>(`/api/announcements/${id}`),
}
