import React from 'react';
import { getAdminInfo } from '../utils/adminHelper';

interface NavbarProps {
  isAdmin: boolean;
  loggedInAdmin?: string;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenDonate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  loggedInAdmin,
  onOpenLogin,
  onLogout,
  onOpenDonate,
}) => {
  const adminInfo = loggedInAdmin ? getAdminInfo(loggedInAdmin) : null;

  return (
    <nav className="topbar">
      <div className="logo-container">
        <h1 className="temple-title-small">
          PALA POLAMMA THALLI
        </h1>
      </div>

      <div
        className="auth-container"
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #d4af37, #aa820a)',
            color: '#2b0606',
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
          }}
          onClick={onOpenDonate}
        >
          🙏 Donate Online (విరాళం)
        </button>

        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {adminInfo && (
              <div
                className="navbar-admin-indicator"
                title={`Logged in as ${adminInfo.name} [${adminInfo.initial}]`}
              >
                <span className="admin-avatar-navbar">{adminInfo.initial}</span>
                <span className="admin-name-navbar">{adminInfo.name}</span>
                <span style={{ opacity: 0.85, fontSize: '0.74rem' }}>[{adminInfo.initial}]</span>
              </div>
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={onLogout}
              style={{ padding: '7px 14px', fontSize: '0.84rem' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenLogin}
          >
            Admin Login
          </button>
        )}
      </div>
    </nav>
  );
};
