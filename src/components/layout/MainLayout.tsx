import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="brand-icon lg">RP</div>
          <h1>Ravivalasa Panchayat</h1>
          <p>Digital village governance portal</p>
        </div>
        <Outlet />
      </div>
      <div className="auth-hero">
        <h2>Serving Our Village Together</h2>
        <p>
          Register complaints, track resolutions, apply for schemes, and stay updated with
          village announcements — all in one place.
        </p>
      </div>
    </div>
  )
}

export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="brand-icon">RP</div>
        <div>
          <strong>Ravivalasa Panchayat</strong>
        </div>
        <nav className="public-nav">
          <a href="/login">Login</a>
          <a href="/register" className="btn btn-primary btn-sm">
            Register
          </a>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
