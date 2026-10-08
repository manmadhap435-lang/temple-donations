import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types/api'
import type { LoginResponse } from '../types/auth'
import {
  clearStoredAuth,
  getStoredAuth,
  isTokenExpired,
  setStoredAuth,
} from '../utils/storage'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

function isStaticToken(token: string | undefined): boolean {
  return token?.startsWith('static-') === true
}

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let refreshQueue: Array<(token: string | null) => void> = []

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = getStoredAuth()
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (isStaticToken(getStoredAuth()?.accessToken)) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const auth = getStoredAuth()
    if (!auth?.refreshToken) {
      clearStoredAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) {
            reject(error)
            return
          }
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(apiClient(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post<ApiResponse<LoginResponse>>(
        `${baseURL}/api/auth/refresh`,
        { refreshToken: auth.refreshToken },
      )

      if (!data.success || !data.data) {
        throw new Error('Refresh failed')
      }

      const updated = {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        accessTokenExpiresAt: data.data.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.data.refreshTokenExpiresAt,
        user: {
          userId: data.data.userId,
          fullName: data.data.fullName,
          email: data.data.email,
          mobileNumber: data.data.mobileNumber,
          role: data.data.role,
        },
      }
      setStoredAuth(updated)
      processQueue(updated.accessToken)
      originalRequest.headers.Authorization = `Bearer ${updated.accessToken}`
      return apiClient(originalRequest)
    } catch {
      processQueue(null)
      clearStoredAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

export async function ensureValidToken(): Promise<boolean> {
  const auth = getStoredAuth()
  if (!auth) return false
  if (!isTokenExpired(auth.accessTokenExpiresAt)) return true

  try {
    const { data } = await axios.post<ApiResponse<LoginResponse>>(
      `${baseURL}/api/auth/refresh`,
      { refreshToken: auth.refreshToken },
    )
    if (!data.success || !data.data) return false

    setStoredAuth({
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      accessTokenExpiresAt: data.data.accessTokenExpiresAt,
      refreshTokenExpiresAt: data.data.refreshTokenExpiresAt,
      user: {
        userId: data.data.userId,
        fullName: data.data.fullName,
        email: data.data.email,
        mobileNumber: data.data.mobileNumber,
        role: data.data.role,
      },
    })
    return true
  } catch {
    clearStoredAuth()
    return false
  }
}
