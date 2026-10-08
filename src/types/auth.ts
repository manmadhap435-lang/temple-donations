import type { UserRole } from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  mobileNumber: string
  street: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  userId: number
  fullName: string
  email: string
  mobileNumber: string
  role: UserRole
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export interface AuthUser {
  userId: number
  fullName: string
  email: string
  mobileNumber: string
  role: UserRole
}
