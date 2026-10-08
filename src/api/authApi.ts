import type { ApiResponse } from '../types/api'
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth'
import { apiClient } from './client'

export const authApi = {
  register: (payload: RegisterRequest) =>
    apiClient.post<ApiResponse<{ userId: number; email: string }>>('/api/auth/register', payload),

  login: (payload: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', payload),

  confirmEmail: (token: string) =>
    apiClient.get<ApiResponse<object>>('/api/auth/confirm-email', { params: { token } }),

  logout: (refreshToken: string) =>
    apiClient.post<ApiResponse<object>>('/api/auth/logout', { refreshToken }),
}
