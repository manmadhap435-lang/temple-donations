import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '../api/authApi'
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth'
import type { UserRole } from '../types/api'
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
  type StoredAuth,
} from '../utils/storage'
import { getApiErrorMessage } from '../utils/format'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginRequest) => Promise<AuthUser>
  register: (payload: RegisterRequest) => Promise<string>
  logout: () => Promise<void>
  hasRole: (...roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STATIC_ACCOUNTS: Array<StoredAuth['user'] & { password: string }> = [
  {
    userId: 1,
    fullName: 'Ravivalasa Villager',
    email: 'villager@ravivalasa.local',
    mobileNumber: '9000000001',
    role: 'VILLAGER',
    password: 'Villager@123',
  },
  {
    userId: 2,
    fullName: 'Panchayat Secretary',
    email: 'secretary@ravivalasa.local',
    mobileNumber: '9000000002',
    role: 'SECRETARY',
    password: 'Secretary@123',
  },
  {
    userId: 3,
    fullName: 'Panchayat Administrator',
    email: 'admin@ravivalasa.local',
    mobileNumber: '9000000003',
    role: 'ADMIN',
    password: 'Admin@123',
  },
]

function mapStoredUser(stored: StoredAuth): AuthUser {
  return {
    userId: stored.user.userId,
    fullName: stored.user.fullName,
    email: stored.user.email,
    mobileNumber: stored.user.mobileNumber,
    role: stored.user.role as UserRole,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const stored = getStoredAuth()
      if (!stored) {
        setIsLoading(false)
        return
      }

      const account = STATIC_ACCOUNTS.find(
        (candidate) => candidate.email === stored.user.email,
      )
      if (account) setUser(mapStoredUser(stored))
      else clearStoredAuth()
      setIsLoading(false)
    }
    init()
  }, [])

  const login = useCallback(async (payload: LoginRequest) => {
    const account = STATIC_ACCOUNTS.find(
      (candidate) => candidate.email.toLowerCase() === payload.email.toLowerCase()
        && candidate.password === payload.password,
    )
    if (!account) {
      throw new Error('Invalid demo email or password')
    }

    const auth: StoredAuth = {
      accessToken: `static-${account.role.toLowerCase()}-access-token`,
      refreshToken: `static-${account.role.toLowerCase()}-refresh-token`,
      accessTokenExpiresAt: '2099-12-31T23:59:59.000Z',
      refreshTokenExpiresAt: '2099-12-31T23:59:59.000Z',
      user: {
        userId: account.userId,
        fullName: account.fullName,
        email: account.email,
        mobileNumber: account.mobileNumber,
        role: account.role,
      },
    }
    setStoredAuth(auth)
    const mapped = mapStoredUser(auth)
    setUser(mapped)
    return mapped
  }, [])

  const register = useCallback(async (payload: RegisterRequest) => {
    const { data } = await authApi.register(payload)
    if (!data.success) {
      throw new Error(data.message || 'Registration failed')
    }
    return data.message
  }, [])

  const logout = useCallback(async () => {
    const stored = getStoredAuth()
    try {
      if (stored?.refreshToken) {
        await authApi.logout(stored.refreshToken)
      }
    } catch {
      // ignore logout API errors
    } finally {
      clearStoredAuth()
      setUser(null)
    }
  }, [])

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      hasRole,
    }),
    [user, isLoading, login, register, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useAuthErrorMessage(error: unknown): string {
  return getApiErrorMessage(error)
}
