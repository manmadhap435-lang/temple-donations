import React, { useState, useEffect } from 'react';

const OdometerNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1200;
    const incrementTime = 25;
    const steps = Math.ceil(duration / incrementTime);
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.ceil(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>₹{displayValue.toLocaleString('en-IN')}</span>;
};

interface MiniStatsProps {
  totalDonations: number;
  totalExpenses: number;
  currentBalance: number;
}

export const MiniStats: React.FC<MiniStatsProps> = ({
  totalDonations,
  totalExpenses,
  currentBalance,
}) => {
  return (
    <div className="mini-stats">
      <div className="mini-stat-card">
        <span className="mini-stat-label">Total Collected:</span>
        <span className="mini-stat-value" style={{ color: '#ffffff' }}>
          <OdometerNumber value={totalDonations} />
        </span>
      </div>

      <div className="mini-stat-card">
        <span className="mini-stat-label">Total Expenses:</span>
        <span className="mini-stat-value" style={{ color: '#ffffff' }}>
          <OdometerNumber value={totalExpenses} />
        </span>
      </div>

      <div className="mini-stat-card mini-stat-card-balance">
        <span className="mini-stat-label">Current Balance:</span>
        <span
          className="mini-stat-value"
          style={{
            color: currentBalance >= 0 ? '#2ecc71' : '#e74c3c',
            fontWeight: 800,
          }}
        >
          <OdometerNumber value={currentBalance} />
        </span>
      </div>
    </div>
  );
};
