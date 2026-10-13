import React from 'react';
import type { TabType } from '../types/temple';

interface HeroSectionProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdmin: boolean;
  pendingTransactionsCount: number;
  onOpenDonate?: () => void;
  quote: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeTab,
  setActiveTab,
  isAdmin,
  pendingTransactionsCount,
  quote,
}) => {
  return (
    <header className="hero-section">
      <div className="hero-content">
        <div className="hero-subtitle">
          <span className="om-symbol cinzel-font">ॐ</span> OM SRI PALA POLAMMA THALLI
        </div>

        <div className="hero-location cinzel-font">
          — RAVIVALASA, ANDHRA PRADESH —
        </div>

        <p className="hero-description">
          Seek the Divine Blessings of Goddess Pala Polamma Thalli.
          <br />
          Join us in building Temple at New Colony, Ravivalasa.<br></br>

          <br />
          Every Contribution Counts. Every Donation Brings Us Closer to Our Divine Dream.
          <br />

          <strong style={{ color: 'var(--primary-gold)' }}>
            "{quote}"
          </strong>
        </p>

        {/* Navigation Buttons */}
        <div
          className="hero-actions"
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className={`btn-primary ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={
              activeTab === 'dashboard'
                ? {
                  background: 'var(--primary-gold)',
                  color: 'var(--bg-dark-maroon)',
                }
                : undefined
            }
          >
            Dashboard
          </button>

          <button
            type="button"
            className={`btn-primary ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
            style={
              activeTab === 'donations'
                ? {
                  background: 'var(--primary-gold)',
                  color: 'var(--bg-dark-maroon)',
                }
                : undefined
            }
          >
            Donors
          </button>

          <button
            type="button"
            className={`btn-primary ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
            style={
              activeTab === 'expenses'
                ? {
                  background: 'var(--primary-gold)',
                  color: 'var(--bg-dark-maroon)',
                }
                : undefined
            }
          >
            Expenses
          </button>

          {/* TRANSACTIONS TAB - ADMIN LOGIN ONLY */}
          {isAdmin && (
            <button
              type="button"
              className={`btn-primary ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
              style={
                activeTab === 'transactions'
                  ? {
                    background: 'var(--primary-gold)',
                    color: 'var(--bg-dark-maroon)',
                  }
                  : undefined
              }
            >
              Transactions {pendingTransactionsCount > 0 ? `(${pendingTransactionsCount} ⏳)` : ''}
            </button>
          )}
        </div>
      </div>

      {/* Temple Deity Image */}
      <div className="hero-image-wrapper">
        <img
          src="/assets/palaplamma.jpg"
          alt="Pala Polamma Thalli"
          className="main-deity"
          onError={(event) => {
            event.currentTarget.src =
              'https://via.placeholder.com/400x600/3a0a0a/d4af37?text=Palapolamma+Thalli';
          }}
        />
      </div>
    </header>
  );
};
