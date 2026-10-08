import { NavLink } from 'react-router-dom'
import {
  Bell,
  ClipboardList,
  Gift,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
  User,
  Users,
  FolderTree,
  FileText,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/api'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const villagerNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { to: '/complaints', label: 'My Complaints', icon: <ClipboardList size={18} /> },
  { to: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { to: '/schemes', label: 'Schemes', icon: <FileText size={18} /> },
  { to: '/donations', label: 'Donations', icon: <Gift size={18} /> },
  { to: '/announcements', label: 'Announcements', icon: <Megaphone size={18} /> },
  { to: '/profile', label: 'Profile', icon: <User size={18} /> },
]

const secretaryNav: NavItem[] = [
  { to: '/secretary', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/secretary/complaints', label: 'Complaints', icon: <ClipboardList size={18} /> },
  { to: '/secretary/applications', label: 'Applications', icon: <FileText size={18} /> },
  { to: '/secretary/notifications', label: 'Publish Notice', icon: <Megaphone size={18} /> },
]

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  { to: '/admin/categories', label: 'Categories', icon: <FolderTree size={18} /> },
  { to: '/admin/schemes', label: 'Schemes', icon: <FileText size={18} /> },
  { to: '/admin/donations', label: 'Donations', icon: <Gift size={18} /> },
  { to: '/admin/notifications', label: 'Notifications', icon: <Bell size={18} /> },
]

function getNavForRole(role: UserRole): NavItem[] {
  if (role === 'ADMIN') return adminNav
  if (role === 'SECRETARY') return secretaryNav
  return villagerNav
}

export function Sidebar() {
  const { user, logout } = useAuth()
  if (!user) return null

  const navItems = getNavForRole(user.role)

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">RP</div>
        <div>
          <strong>Ravivalasa</strong>
          <span>Panchayat Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={item.to === '/dashboard' || item.to === '/admin' || item.to === '/secretary'}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <Settings size={16} />
          <div>
            <strong>{user.fullName}</strong>
            <span>{user.role}</span>
          </div>
        </div>
        <button type="button" className="logout-btn" onClick={() => logout()}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
