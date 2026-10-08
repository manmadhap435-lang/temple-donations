import type { ApiResponse, PagedResponse } from '../types/api'
import type { Notification } from '../types'
import { apiClient } from './client'

export const notificationApi = {
  getMy: (pageNumber = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<PagedResponse<Notification>>>('/api/notifications', {
      params: { pageNumber, pageSize },
    }),

  getUnread: (pageNumber = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<PagedResponse<Notification>>>('/api/notifications/unread', {
      params: { pageNumber, pageSize },
    }),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ unreadCount: number }>>('/api/notifications/count/unread'),

  markAsRead: (id: number) =>
    apiClient.put<ApiResponse<object>>(`/api/notifications/${id}/read`),

  markAllAsRead: () => apiClient.put<ApiResponse<object>>('/api/notifications/read-all'),

  publish: (payload: {
    title: string
    message: string
    notificationType?: string
    targetType?: string
    expiryDate?: string
    targetUserId?: number
  }) => apiClient.post<ApiResponse<object>>('/api/admin/notifications/publish', payload),
}
