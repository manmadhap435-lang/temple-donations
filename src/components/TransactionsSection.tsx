import React from 'react';
import type { TempleTransaction, TransactionFilterType } from '../types/temple';

interface TransactionsSectionProps {
  allTransactions: TempleTransaction[];
  filteredTransactions: TempleTransaction[];
  transactionFilter: TransactionFilterType;
  setTransactionFilter: (filter: TransactionFilterType) => void;
  transactionSearch: string;
  setTransactionSearch: (search: string) => void;
  totalVerifiedOnlineAmount?: number;
  approvedTransactionsCount: number;
  pendingTransactionsCount: number;
  rejectedTransactionsCount: number;
  onOpenDonate: () => void;
  onApproveTransaction: (tx: TempleTransaction) => void;
  onRejectTransaction: (tx: TempleTransaction) => void;
  onDeleteTransaction: (tx: TempleTransaction) => void;
}

export const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  allTransactions,
  filteredTransactions,
  transactionFilter,
  setTransactionFilter,
  transactionSearch,
  setTransactionSearch,
  approvedTransactionsCount,
  pendingTransactionsCount,
  rejectedTransactionsCount,
  onOpenDonate,
  onApproveTransaction,
  onRejectTransaction,
  onDeleteTransaction,
}) => {
  return (
    <section className="transactions-section fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--primary-gold)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            🛡️ Admin Only
          </span>
          <h4 className="cinzel-font" style={{ margin: '4px 0 0 0' }}>
            Transactions Management (ఆన్‌లైన్ లావాదేవీలు)
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>💡 అడ్మిన్ బ్యాంక్ ఖాతాలో డబ్బులు జమ అయినట్లు SMS / స్టేట్మెంట్తో సరిచూసి <strong>'Approve'</strong> చేయగానే, ఆ విరాళం అధికారిక <strong>'Donors'</strong> జాబితాలో కనిపిస్తుంది.</div>
          </p>
        </div>

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
            + Add Online Donation (UPI)
          </button>
        </div>
      </div>

      {/* Summary Cards */}


      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setTransactionFilter('all')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              background: transactionFilter === 'all' ? 'var(--primary-gold)' : 'rgba(255,255,255,0.06)',
              color: transactionFilter === 'all' ? 'var(--bg-dark-maroon)' : 'var(--text-light)',
              border: '1px solid var(--primary-gold)',
            }}
          >
            All ({allTransactions.length})
          </button>
          <button
            type="button"
            onClick={() => setTransactionFilter('pending')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              background: transactionFilter === 'pending' ? '#ffc107' : 'rgba(255,255,255,0.06)',
              color: transactionFilter === 'pending' ? '#2b0606' : 'var(--text-light)',
              border: '1px solid #ffc107',
              fontWeight: transactionFilter === 'pending' ? 700 : 500,
            }}
          >
            ⏳ Pending ({pendingTransactionsCount})
          </button>
          <button
            type="button"
            onClick={() => setTransactionFilter('approved')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              background: transactionFilter === 'approved' ? '#2ecc71' : 'rgba(255,255,255,0.06)',
              color: transactionFilter === 'approved' ? '#2b0606' : 'var(--text-light)',
              border: '1px solid #2ecc71',
            }}
          >
            ✅ Approved ({approvedTransactionsCount})
          </button>
          <button
            type="button"
            onClick={() => setTransactionFilter('rejected')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              background: transactionFilter === 'rejected' ? '#e74c3c' : 'rgba(255,255,255,0.06)',
              color: transactionFilter === 'rejected' ? '#ffffff' : 'var(--text-light)',
              border: '1px solid #e74c3c',
            }}
          >
            ❌ Rejected ({rejectedTransactionsCount})
          </button>
        </div>

        {/* Search Box */}
        <div className="search-bar-box" style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="🔍 Search devotee, UTR, comment, amount..."
            value={transactionSearch}
            onChange={(e) => setTransactionSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px',
              fontSize: '0.85rem',
              borderRadius: '20px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-light)',
            }}
          />
          {transactionSearch && (
            <button
              type="button"
              onClick={() => setTransactionSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                fontSize: '0.85rem',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Date</th>
              <th>Devotee Name</th>
              <th style={{ width: '110px' }}>Amount</th>
              <th>UTR Number</th>
              <th>Comments</th>
              <th style={{ width: '110px' }}>Status</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Admin Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  style={{
                    background:
                      tx.status === 'PENDING'
                        ? 'rgba(255, 193, 7, 0.05)'
                        : tx.status === 'REJECTED'
                          ? 'rgba(231, 76, 60, 0.05)'
                          : undefined,
                  }}
                >
                  {/* Date Column */}
                  <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {new Date(tx.transaction_date).toLocaleDateString('en-IN')}
                  </td>

                  {/* Devotee Name Column */}
                  <td style={{ fontWeight: 600 }}>{tx.name}</td>

                  {/* Amount Column */}
                  <td style={{ color: 'var(--primary-gold)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {tx.amount !== null ? `₹${tx.amount.toLocaleString('en-IN')}` : '—'}
                  </td>

                  {/* UTR Column */}
                  <td>
                    {tx.utr_number ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            background: 'rgba(255,255,255,0.08)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.82rem',
                            letterSpacing: '0.5px',
                            color: 'var(--text-light)',
                          }}
                        >
                          {tx.utr_number}
                        </span>
                        <button
                          type="button"
                          title="Copy UTR"
                          onClick={() => {
                            navigator.clipboard.writeText(tx.utr_number);
                            alert(`UTR ${tx.utr_number} copied to clipboard!`);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            fontSize: '0.85rem',
                          }}
                        >
                          📋
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>N/A</span>
                    )}
                  </td>

                  {/* Comments / Gotra */}
                  <td style={{ fontSize: '0.85rem' }}>
                    <div>{tx.comments || 'General Donation'}</div>
                    {tx.rejection_reason && (
                      <div style={{ marginTop: '4px', color: '#ff8a80', fontSize: '0.78rem' }}>
                        <strong>Reason:</strong> {tx.rejection_reason}
                      </div>
                    )}
                  </td>

                  {/* Status Badge Column */}
                  <td>
                    {tx.status === 'PENDING' ? (
                      <span
                        style={{
                          background: 'rgba(255, 193, 7, 0.2)',
                          color: '#ffc107',
                          border: '1px solid #ffc107',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ⏳ Pending
                      </span>
                    ) : tx.status === 'APPROVED' ? (
                      <span
                        style={{
                          background: 'rgba(46, 204, 113, 0.2)',
                          color: '#2ecc71',
                          border: '1px solid #2ecc71',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✓ Verified
                      </span>
                    ) : (
                      <span
                        style={{
                          background: 'rgba(231, 76, 60, 0.2)',
                          color: '#e74c3c',
                          border: '1px solid #e74c3c',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✗ Rejected
                      </span>
                    )}
                  </td>

                  {/* Admin Actions Column */}
                  <td style={{ textAlign: 'center' }}>
                    {tx.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => onApproveTransaction(tx)}
                          title="Confirm payment received in bank statement and list as official Donor"
                          style={{
                            background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(46, 204, 113, 0.3)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectTransaction(tx)}
                          title="Reject if payment is not received or UTR does not match bank statement"
                          style={{
                            background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(231, 76, 60, 0.3)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    ) : tx.status === 'APPROVED' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: '#2ecc71', fontWeight: 600 }}>
                          ✓ Approved
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(tx)}
                          title="Permanently delete entry from database"
                          style={{
                            background: 'rgba(231, 76, 60, 0.15)',
                            border: '1px solid #e74c3c',
                            color: '#ffb3b3',
                            borderRadius: '4px',
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: '#e74c3c', fontWeight: 600 }}>
                          ✗ Rejected
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(tx)}
                          title="Permanently delete entry from database"
                          style={{
                            background: 'rgba(231, 76, 60, 0.2)',
                            border: '1px solid #e74c3c',
                            color: '#ffb3b3',
                            borderRadius: '4px',
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '35px 20px', color: 'var(--text-muted)' }}>
                  {allTransactions.length === 0
                    ? 'No online UPI transactions found yet. Devotees can donate via "+ Donate Online (UPI)".'
                    : 'No transactions match the selected filter or search keyword.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
