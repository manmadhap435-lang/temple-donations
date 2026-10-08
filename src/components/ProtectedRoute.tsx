import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/api'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="page-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirect =
      user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'SECRETARY'
          ? '/secretary'
          : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="page-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    const redirect =
      user.role === 'ADMIN'
        ? '/admin'
        : user.role === 'SECRETARY'
          ? '/secretary'
          : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
