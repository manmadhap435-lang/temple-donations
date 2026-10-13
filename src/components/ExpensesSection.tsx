import React, { useState, useMemo, useRef } from 'react';
import type { Expense } from '../types/temple';
import { getAdminInfo, extractAdminNotation } from '../utils/adminHelper';

interface ExpensesSectionProps {
  isAdmin: boolean;
  loggedInAdmin?: string;
  expenses: Expense[];
  // Admin form
  eAmount: string;
  setEAmount: (v: string) => void;
  eReason: string;
  setEReason: (v: string) => void;
  eDate: string;
  setEDate: (v: string) => void;
  onAddExpense: (e: React.FormEvent) => void;
  // Inline edit
  editingExpenseId: string | null;
  setEditingExpenseId: (id: string | null) => void;
  editingExpenseAmount: string;
  setEditingExpenseAmount: (v: string) => void;
  onUpdateExpenseAmount: (id: string) => void;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  isAdmin,
  loggedInAdmin,
  expenses,
  eAmount,
  setEAmount,
  eReason,
  setEReason,
  eDate,
  setEDate,
  onAddExpense,
  editingExpenseId,
  setEditingExpenseId,
  editingExpenseAmount,
  setEditingExpenseAmount,
  onUpdateExpenseAmount,
}) => {
  const [expenseSearch, setExpenseSearch] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Filter expenses by reason, amount, or date
  const displayedExpenses = useMemo(() => {
    if (!expenseSearch.trim()) return expenses;
    const query = expenseSearch.trim().toLowerCase();
    return expenses.filter((exp) => {
      const reasonText = isAdmin
        ? (exp.reason || '')
        : (exp.reason ? exp.reason.replace(/\[[A-Za-z]\]/g, '').trim() : '');
      const reasonMatch = reasonText.toLowerCase().includes(query);
      const amountMatch =
        exp.amount !== null && exp.amount !== undefined && exp.amount.toString().includes(query);
      const dateMatch = new Date(exp.expense_date).toLocaleDateString('en-IN').includes(query);
      return reasonMatch || amountMatch || dateMatch;
    });
  }, [expenses, expenseSearch, isAdmin]);

  // Calculate sum of displayed expenses
  const totalExpenseAmount = useMemo(() => {
    return displayedExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  }, [displayedExpenses]);

  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 120);
  };

  const scrollToTop = () => {
    tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="expenses-section fade-in">
      <div className="section-header">
        <h2 className="cinzel-font">Temple Expenses</h2>
      </div>

      {/* Admin Expense Form */}
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
            <h3 style={{ margin: 0 }}>Add New Expense</h3>
            {loggedInAdmin && (
              <div className="admin-active-badge">
                <span>Adding as:</span>
                <span className="admin-avatar-small">{getAdminInfo(loggedInAdmin).initial}</span>
                <strong>{getAdminInfo(loggedInAdmin).name}</strong>
                <span style={{ opacity: 0.85, fontSize: '0.78rem' }}>[{getAdminInfo(loggedInAdmin).initial}]</span>
              </div>
            )}
          </div>
          <form onSubmit={onAddExpense}>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={eAmount}
              onChange={(e) => setEAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
            <input
              type="text"
              placeholder="Reason (e.g. Pooja materials, Prasadam, Electrical)"
              value={eReason}
              onChange={(e) => setEReason(e.target.value)}
              required
            />
            <input
              type="date"
              value={eDate}
              onChange={(e) => setEDate(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Submit Expense
            </button>
          </form>
        </div>
      )}

      {/* Search Bar for Expenses */}
      <div className="search-bar-row">
        <div className="search-bar-box">
          <input
            type="text"
            placeholder="🔍 Search expense by Reason, Amount (₹), or Date..."
            value={expenseSearch}
            onChange={(e) => setExpenseSearch(e.target.value)}
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
          {expenseSearch && (
            <button
              type="button"
              onClick={() => setExpenseSearch('')}
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
          Showing <strong>{displayedExpenses.length}</strong> of <strong>{expenses.length}</strong> expense{expenses.length === 1 ? '' : 's'}
          {expenseSearch && (
            <span> matching "<strong style={{ color: 'var(--primary-gold)' }}>{expenseSearch}</strong>"</span>
          )}
        </div>
      </div>

      {/* Expenses Table with Smooth Responsive Scrolling & Sticky Headers */}
      <div className="table-scroll-wrapper">
        <div
          ref={tableContainerRef}
          className="table-container"
          onScroll={handleTableScroll}
        >
          <table>
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Date</th>
                <th>Reason</th>
                <th style={{ width: '140px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayedExpenses.length > 0 ? (
                displayedExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      {new Date(expense.expense_date).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      {(() => {
                        const adminNotation = extractAdminNotation(expense.reason);
                        const cleanReason = expense.reason
                          ? expense.reason.replace(/\[[A-Za-z]\]/g, '').trim()
                          : '';

                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span>{cleanReason || (isAdmin ? expense.reason : '-')}</span>
                            {isAdmin && adminNotation && (
                              <span
                                className="admin-notation-tag"
                                title={`Recorded by Admin: ${adminNotation.name} [${adminNotation.initial}]`}
                              >
                                <span className="admin-initial-icon">{adminNotation.initial}</span>
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                      {isAdmin && editingExpenseId === expense.id ? (
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <input
                            type="number"
                            value={editingExpenseAmount}
                            onChange={(e) => setEditingExpenseAmount(e.target.value)}
                            style={{ width: '90px', padding: '3px 6px', fontSize: '0.85rem' }}
                          />
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => onUpdateExpenseAmount(expense.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => setEditingExpenseId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>₹{expense.amount.toLocaleString('en-IN')}</span>
                          {expense.is_edited && (
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
                                setEditingExpenseId(expense.id);
                                setEditingExpenseAmount(expense.amount.toString());
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center" style={{ padding: '35px 20px', color: 'var(--text-muted)' }}>
                    {expenseSearch.trim()
                      ? `No expenses found matching "${expenseSearch}". Try searching by another reason or amount.`
                      : 'No expenses recorded yet.'}
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
            title="Scroll to top of expenses list"
          >
            ↑ Top
          </button>
        )}
      </div>

      {/* Table Summary & Scroll Hint */}

    </section>
  );
};
