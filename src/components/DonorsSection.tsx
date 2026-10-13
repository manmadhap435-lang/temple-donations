import React, { useState, useMemo, useRef } from 'react';
import type { Donation } from '../types/temple';
import { getAdminInfo, extractAdminNotation } from '../utils/adminHelper';

interface DonorsSectionProps {
  isAdmin: boolean;
  loggedInAdmin?: string;
  donations: Donation[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  years: number[];
  pendingTransactionsCount: number;
  onNavigateToTransactions: () => void;
  onOpenDonate: () => void;
  // Admin form
  dName: string;
  setDName: (v: string) => void;
  dAmount: string;
  setDAmount: (v: string) => void;
  dComments: string;
  setDComments: (v: string) => void;
  dDate: string;
  setDDate: (v: string) => void;
  onAddDonation: (e: React.FormEvent) => void;
  // Inline edit
  editingDonationId: string | null;
  setEditingDonationId: (id: string | null) => void;
  editingDonationAmount: string;
  setEditingDonationAmount: (v: string) => void;
  onUpdateDonationAmount: (id: string) => void;
}

export const DonorsSection: React.FC<DonorsSectionProps> = ({
  isAdmin,
  loggedInAdmin,
  donations,
  selectedYear,
  setSelectedYear,
  years,
  pendingTransactionsCount,
  onNavigateToTransactions,
  onOpenDonate,
  dName,
  setDName,
  dAmount,
  setDAmount,
  dComments,
  setDComments,
  dDate,
  setDDate,
  onAddDonation,
  editingDonationId,
  setEditingDonationId,
  editingDonationAmount,
  setEditingDonationAmount,
  onUpdateDonationAmount,
}) => {
  const [donorSearch, setDonorSearch] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Filter donations by donor name, amount, or comments
  const displayedDonations = useMemo(() => {
    if (!donorSearch.trim()) return donations;
    const query = donorSearch.trim().toLowerCase();
    return donations.filter((d) => {
      const nameMatch = d.name.toLowerCase().includes(query);
      const amountMatch =
        d.amount !== null && d.amount !== undefined && d.amount.toString().includes(query);
      const commentText = isAdmin
        ? (d.comments || '')
        : (d.comments ? d.comments.replace(/\[[A-Za-z]\]/g, '').trim() : '');
      const commentMatch = commentText.toLowerCase().includes(query);
      return nameMatch || amountMatch || commentMatch;
    });
  }, [donations, donorSearch, isAdmin]);


  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 120);
  };

  const scrollToTop = () => {
    tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <section className="donations-section fade-in">
      {/* Header */}
      <div className="section-header">
        <h2 className="cinzel-font" style={{ margin: 0 }}>
          Our Generous Donors
        </h2>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenDonate}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #f1c40f)',
              color: '#2b0606',
              fontWeight: 700,
              padding: '8px 16px',
              fontSize: '0.85rem',
            }}
          >
            + Donate Online (UPI)
          </button>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="year-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pending Transactions Alert Banner (ADMIN ONLY) */}
      {isAdmin && pendingTransactionsCount > 0 && (
        <div
          style={{
            background: 'rgba(255, 193, 7, 0.12)',
            border: '1.5px solid #ffc107',
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ color: '#ffe082', fontWeight: 700, fontSize: '0.92rem' }}>
              ⏳ {pendingTransactionsCount} online UPI donation(s) are awaiting admin verification!
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Once verified, they will appear here in the official donors list and add to total balance.
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={onNavigateToTransactions}
            style={{
              background: 'var(--primary-gold)',
              color: 'var(--bg-dark-maroon)',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            Go to Transactions Table ➔
          </button>
        </div>
      )}

      {/* Admin Add Donation Form */}
      {isAdmin && (
        <div className="admin-form glass">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <h3 style={{ margin: 0 }}>Add New Donation</h3>
            {loggedInAdmin && (
              <div className="admin-active-badge">
                <span>Adding as:</span>
                <span className="admin-avatar-small">{getAdminInfo(loggedInAdmin).initial}</span>
                <strong>{getAdminInfo(loggedInAdmin).name}</strong>
                <span style={{ opacity: 0.85, fontSize: '0.78rem' }}>[{getAdminInfo(loggedInAdmin).initial}]</span>
              </div>
            )}
          </div>
          <form onSubmit={onAddDonation}>
            <input
              type="text"
              placeholder="Donor Name"
              value={dName}
              onChange={(e) => setDName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={dAmount}
              onChange={(e) => setDAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <input
              type="text"
              placeholder="Comments "
              value={dComments}
              onChange={(e) => setDComments(e.target.value)}
            />
            <input
              type="date"
              value={dDate}
              onChange={(e) => setDDate(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Submit Donation
            </button>
          </form>
        </div>
      )}

      {/* Search Bar for Donors */}
      <div className="search-bar-row">
        <div className="search-bar-box">
          <input
            type="text"
            placeholder="🔍 Search donor by Name or Amount (₹)..."
            value={donorSearch}
            onChange={(e) => setDonorSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 38px 9px 16px',
              fontSize: '0.88rem',
              borderRadius: '22px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-light)',
            }}
          />
          {donorSearch && (
            <button
              type="button"
              onClick={() => setDonorSearch('')}
              title="Clear search"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                fontSize: '0.9rem',
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="search-count-label" style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Showing <strong>{displayedDonations.length}</strong> of <strong>{donations.length}</strong> donor{donations.length === 1 ? '' : 's'}
          {donorSearch && (
            <span> matching "<strong style={{ color: 'var(--primary-gold)' }}>{donorSearch}</strong>"</span>
          )}
        </div>
      </div>

      {/* Donors Table with Smooth Responsive Scrolling & Sticky Headers */}
      <div className="table-scroll-wrapper">
        <div
          ref={tableContainerRef}
          className="table-container"
          onScroll={handleTableScroll}
        >
          <table>
            <thead>
              <tr>
                <th style={{ width: '105px' }}>Date</th>
                <th>Name</th>
                <th style={{ width: '130px' }}>Amount</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {displayedDonations.length > 0 ? (
                displayedDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td>
                      {new Date(donation.donation_date).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ fontWeight: 600 }}>{donation.name}</td>
                    <td style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                      {isAdmin && editingDonationId === donation.id ? (
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <input
                            type="number"
                            value={editingDonationAmount}
                            onChange={(e) => setEditingDonationAmount(e.target.value)}
                            style={{ width: '90px', padding: '3px 6px', fontSize: '0.85rem' }}
                          />
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => onUpdateDonationAmount(donation.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => setEditingDonationId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>
                            {donation.amount !== null
                              ? `₹${donation.amount.toLocaleString('en-IN')}`
                              : '-'}
                          </span>
                          {donation.is_edited && (
                            <small style={{ fontSize: '0.7em', color: 'var(--text-muted)' }}>
                              (Edited)
                            </small>
                          )}
                          {isAdmin && (
                            <button
                              type="button"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                textDecoration: 'underline',
                                padding: 0,
                              }}
                              onClick={() => {
                                setEditingDonationId(donation.id);
                                setEditingDonationAmount(
                                  donation.amount ? donation.amount.toString() : ''
                                );
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      {(() => {
                        const isVerified = donation.comments?.toLowerCase().includes('verified upi');
                        const utrMatch = donation.comments?.match(/UTR[:\s]*([a-zA-Z0-9]+)/i);
                        const utr = utrMatch ? utrMatch[1] : null;

                        // Extract admin notation like [J], [K], [E], [R]
                        const adminNotation = extractAdminNotation(donation.comments);

                        const cleanComment = donation.comments
                          ? donation.comments
                            .replace(/\[[A-Za-z]\]/g, '')
                            .replace(/\[UPI_[^\]]+\]\s*/gi, '')
                            .replace(/\(Verified UPI[^)]*\)/gi, '')
                            .trim()
                          : '';

                        return (
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flexWrap: 'wrap',
                              }}
                            >
                              {isVerified && (
                                <span
                                  style={{
                                    background: 'rgba(46, 204, 113, 0.2)',
                                    color: '#2ecc71',
                                    border: '1px solid #2ecc71',
                                    padding: '2px 2px',
                                    borderRadius: '5px',
                                    fontSize: '0.5rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  ✓ Verified UPI
                                </span>
                              )}

                              {isAdmin && adminNotation && (
                                <span
                                  className="admin-notation-tag"
                                  title={`Added by Admin: ${adminNotation.name} [${adminNotation.initial}]`}
                                >
                                  <span className="admin-initial-icon">{adminNotation.initial}</span>
                                </span>
                              )}

                              {isAdmin && utr && (
                                <span
                                  style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--text-light)',
                                    background: 'rgba(255,255,255,0.08)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    letterSpacing: '0.5px',
                                  }}
                                >
                                  UTR: <strong>{utr}</strong>
                                </span>
                              )}
                            </div>

                            <div
                              style={{
                                marginTop: isVerified || (isAdmin && adminNotation) ? '4px' : '0',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {cleanComment || (isVerified ? 'Online UPI Donation' : (isAdmin && adminNotation ? 'Cash / Direct' : '-'))}
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center" style={{ padding: '35px 20px', color: 'var(--text-muted)' }}>
                    {donorSearch.trim()
                      ? `No donors found matching "${donorSearch}". Try searching by another name or amount.`
                      : `No donations found for the year ${selectedYear}.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Floating Scroll to Top Button */}
        {showScrollTop && (
          <button
            type="button"
            className="table-scroll-top-btn"
            onClick={scrollToTop}
            title="Scroll to top of donors list"
          >
            ↑ Top
          </button>
        )}
      </div>

      {/* Table Summary & Scroll Hint */}



    </section>
  );
};
