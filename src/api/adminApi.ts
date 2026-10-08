import type { ApiResponse, PagedResponse } from '../types/api'
import type { AdminUser, AdminRole, DashboardSummary, ComplaintCategory } from '../types'
import type { Scheme } from '../types'
import { apiClient } from './client'

export const adminApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardSummary>>('/api/admin/dashboard'),

  getUsers: (params: {
    pageNumber?: number
    pageSize?: number
    search?: string
    role?: string
    isActive?: boolean
  }) => apiClient.get<ApiResponse<PagedResponse<AdminUser>>>('/api/admin/users', { params }),

  createSecretary: (payload: {
    fullName: string
    email: string
    mobileNumber: string
    password: string
  }) => apiClient.post<ApiResponse<{ userId: number; email: string }>>(
    '/api/admin/users/secretary',
    payload,
  ),

  updateUserStatus: (id: number, isActive: boolean, reason?: string) =>
    apiClient.put<ApiResponse<object>>(`/api/admin/users/${id}/status`, { isActive, reason }),

  updateUserRole: (id: number, roleName: string) =>
    apiClient.put<ApiResponse<object>>(`/api/admin/users/${id}/role`, { roleName }),

  getRoles: () => apiClient.get<ApiResponse<AdminRole[]>>('/api/admin/roles'),

  getCategories: (includeInactive = true) =>
    apiClient.get<ApiResponse<ComplaintCategory[]>>('/api/admin/complaint-categories', {
      params: { includeInactive },
    }),

  createCategory: (categoryName: string, description?: string) =>
    apiClient.post<ApiResponse<object>>('/api/admin/complaint-categories', {
      categoryName,
      description,
    }),

  updateCategory: (id: number, payload: { categoryName: string; description?: string; isActive: boolean }) =>
    apiClient.put<ApiResponse<object>>(`/api/admin/complaint-categories/${id}`, payload),

  getSchemes: (includeInactive = true) =>
    apiClient.get<ApiResponse<Scheme[]>>('/api/admin/schemes', { params: { includeInactive } }),

  createScheme: (payload: {
    schemeName: string
    description: string
    eligibility?: string
    startDate?: string
    endDate?: string
  }) => apiClient.post<ApiResponse<object>>('/api/admin/schemes', payload),

  updateScheme: (
    id: number,
    payload: {
      schemeName: string
      description: string
      eligibility?: string
      isActive: boolean
      startDate?: string
      endDate?: string
    },
  ) => apiClient.put<ApiResponse<object>>(`/api/admin/schemes/${id}`, payload),
}
