import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from '../components/ProtectedRoute'
import { AuthLayout, MainLayout, PublicLayout } from '../components/layout/MainLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ConfirmEmailPage } from '../pages/auth/ConfirmEmailPage'
import { HomePage } from '../pages/public/HomePage'
import { VillagerDashboard } from '../pages/villager/VillagerDashboard'
import { ProfilePage } from '../pages/villager/ProfilePage'
import { MyComplaintsPage } from '../pages/villager/MyComplaintsPage'
import { NewComplaintPage } from '../pages/villager/NewComplaintPage'
import { ComplaintDetailPage } from '../pages/villager/ComplaintDetailPage'
import { NotificationsPage } from '../pages/villager/NotificationsPage'
import { SchemesPage } from '../pages/villager/SchemesPage'
import { DonationsPage } from '../pages/villager/DonationsPage'
import { AnnouncementsPage } from '../pages/villager/AnnouncementsPage'
import { SecretaryDashboard } from '../pages/secretary/SecretaryDashboard'
import { SecretaryComplaintsPage } from '../pages/secretary/SecretaryComplaintsPage'
import { SecretaryComplaintDetailPage } from '../pages/secretary/SecretaryComplaintDetailPage'
import { SecretaryApplicationsPage } from '../pages/secretary/SecretaryApplicationsPage'
import { PublishNotificationPage } from '../pages/secretary/PublishNotificationPage'
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage'
import { AdminSchemesPage } from '../pages/admin/AdminSchemesPage'
import { AdminDonationsPage } from '../pages/admin/AdminDonationsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route path="/confirm-email" element={<ConfirmEmailPage />} />

      <Route element={<ProtectedRoute allowedRoles={['VILLAGER']} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<VillagerDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/complaints" element={<MyComplaintsPage />} />
          <Route path="/complaints/new" element={<NewComplaintPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['SECRETARY', 'ADMIN']} />}>
        <Route element={<MainLayout />}>
          <Route path="/secretary" element={<SecretaryDashboard />} />
          <Route path="/secretary/complaints" element={<SecretaryComplaintsPage />} />
          <Route path="/secretary/complaints/:id" element={<SecretaryComplaintDetailPage />} />
          <Route path="/secretary/applications" element={<SecretaryApplicationsPage />} />
          <Route path="/secretary/notifications" element={<PublishNotificationPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/schemes" element={<AdminSchemesPage />} />
          <Route path="/admin/donations" element={<AdminDonationsPage />} />
          <Route path="/admin/notifications" element={<PublishNotificationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
