import type { ApiResponse, PagedResponse } from '../types/api'
import type {
  ComplaintCategory,
  ComplaintDetail,
  ComplaintSummary,
  CreateComplaintRequest,
  ComplaintAttachment,
} from '../types/complaint'
import { apiClient } from './client'

export const complaintApi = {
  getCategories: (includeInactive = false) =>
    apiClient.get<ApiResponse<ComplaintCategory[]>>('/api/complaints/categories', {
      params: { includeInactive },
    }),

  create: (payload: CreateComplaintRequest) =>
    apiClient.post<ApiResponse<{ complaintId: number; complaintNumber: string }>>(
      '/api/complaints',
      payload,
    ),

  getMy: (params: {
    pageNumber?: number
    pageSize?: number
    search?: string
    status?: string
    categoryId?: number
  }) =>
    apiClient.get<ApiResponse<PagedResponse<ComplaintSummary>>>('/api/complaints/my', { params }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<ComplaintDetail>>(`/api/complaints/${id}`),

  escalate: (id: number, escalationReason: string) =>
    apiClient.post<ApiResponse<object>>(`/api/complaints/${id}/escalate`, { escalationReason }),

  close: (id: number, remarks?: string) =>
    apiClient.post<ApiResponse<object>>(`/api/complaints/${id}/close`, { remarks }),

  confirmResolution: (id: number, isResolved: boolean, remarks?: string) =>
    apiClient.post<ApiResponse<object>>(`/api/complaints/${id}/confirm-resolution`, {
      isResolved,
      remarks,
    }),

  reopen: (id: number, reopenReason: string) =>
    apiClient.post<ApiResponse<object>>(`/api/complaints/${id}/reopen`, { reopenReason }),

  getResolutionPending: (pageNumber = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<PagedResponse<ComplaintSummary>>>(
      '/api/complaints/resolution-pending',
      { params: { pageNumber, pageSize } },
    ),

  uploadAttachment: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<ComplaintAttachment>>(
      `/api/complaints/${id}/attachments`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
  },

  getAttachments: (id: number) =>
    apiClient.get<ApiResponse<ComplaintAttachment[]>>(`/api/complaints/${id}/attachments`),
}

export const secretaryComplaintApi = {
  getAll: (params: {
    pageNumber?: number
    pageSize?: number
    search?: string
    status?: string
    categoryId?: number
    priority?: string
    street?: string
    fromDate?: string
    toDate?: string
  }) =>
    apiClient.get<ApiResponse<PagedResponse<ComplaintSummary>>>(
      '/api/secretary/complaints',
      { params },
    ),

  getById: (id: number) =>
    apiClient.get<ApiResponse<ComplaintDetail>>(`/api/secretary/complaints/${id}`),

  updateStatus: (id: number, newStatus: string, remarks = '') =>
    apiClient.put<ApiResponse<object>>(`/api/secretary/complaints/${id}/status`, {
      newStatus,
      remarks,
    }),

  reply: (id: number, responseText: string, estimatedResolutionDate?: string) =>
    apiClient.post<ApiResponse<object>>(`/api/secretary/complaints/${id}/reply`, {
      responseText,
      estimatedResolutionDate,
    }),

  assign: (id: number, assignedToUserId: number) =>
    apiClient.put<ApiResponse<object>>(`/api/secretary/complaints/${id}/assign`, {
      assignedToUserId,
    }),

  getReopened: (pageNumber = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<PagedResponse<ComplaintSummary>>>(
      '/api/secretary/complaints/reopened',
      { params: { pageNumber, pageSize } },
    ),

  autoEscalate: (id: number, escalationReason: string) =>
    apiClient.post<ApiResponse<object>>(`/api/secretary/complaints/${id}/auto-escalate`, {
      escalationReason,
    }),
}
