import type { ApiResponse } from '../types/api'
import type { UserProfile, UpdateUserProfileRequest } from '../types/user'
import { apiClient } from './client'

export const userApi = {
  getProfile: () => apiClient.get<ApiResponse<UserProfile>>('/api/users/me'),

  updateProfile: (payload: UpdateUserProfileRequest) =>
    apiClient.put<ApiResponse<object>>('/api/users/me', payload),
}
