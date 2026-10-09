import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import './index.css';

// ======================================================
// TYPES
// ======================================================

interface Donation {
  id: string;
  name: string;
  amount: number | null;
  comments: string;
  donation_date: string;
  is_edited?: boolean;
}

interface Expense {
  id: string;
  amount: number;
  reason: string;
  expense_date: string;
  is_edited?: boolean;
}


// ======================================================
// ODOMETER NUMBER ANIMATION
// ======================================================

const OdometerNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1500;
    const incrementTime = 30;
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

// ======================================================
// QUOTES
// ======================================================

const QUOTES = [

  'రావివలస గడ్డపై కొలువైన పాలపోలమ్మ తల్లి… మా గ్రామానికి రక్షణగా, మా ప్రజలకు ఆశీర్వాదంగా, మా తరతరాల విశ్వాసానికి ప్రతీకగా ఎల్లప్పుడూ మా అందరినీ కాపాడాలి తల్లి.” 🙏 🔱',


  'పాలపోలమ్మ తల్లి దీవెనలే మా బలం… అమ్మ కరుణే మా రక్షణ.',
  'పాలపోలమ్మ నమ్మిన భక్తునికి భయం లేదు; దుర్గమ్మ తల్లి దీవెన ఉన్న జీవితానికి ఓటమి లేదు..',
  'Faith makes all things possible... love makes all things easy.',
  'పాలపోలమ్మ ఆశీస్సులు ఉన్నచోట భయానికి స్థానం లేదు.',
  'పాలపోలమ్మ కరుణ ఉంటే అసాధ్యం ఏదీ లేదు.',
  'Service to humanity is service to God.',
  'పాలపోలమ్మ కరుణతోనే అద్భుతాలు జరుగుతాయి..',
  'పాలపోలమ్మ పాదాలే మా శరణు.',
  'తల్లి ఆశీస్సులతోనే శాంతి, ఐశ్వర్యం సిద్ధిస్తాయి."',
  'ఎన్ని కష్టాలు వచ్చినా అమ్మపై నమ్మకం ఉంటే మనసుకు ఓటమి ఉండదు. ',
  'పాలపోలమ్మ తల్లి మా ఊరి ఆరాధ్య దైవం… మా అందరి నమ్మకానికి నిలువెత్తు రూపం.',
  'Dharma protects those who protect it.',
  'జై పాలపోలమ్మ తల్లి 🙏🌺',
  'అమ్మ కరుణ మనందరికీ కొండంత అండ”',







];

// ======================================================
// APPLICATION
// ======================================================

export default function App() {
  // ====================================================
  // ADMIN LOGIN
  // ====================================================

  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // ====================================================
  // DATA
  // ====================================================

  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // ====================================================
  // NAVIGATION
  // ====================================================

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'donations' | 'expenses'
  >('dashboard');

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // ====================================================
  // QUOTE
  // ====================================================

  const [quoteIndex, setQuoteIndex] = useState(0);

  // ====================================================
  // DONATION FORM
  // ====================================================

  const [dName, setDName] = useState('');
  const [dAmount, setDAmount] = useState('');
  const [dComments, setDComments] = useState('');
  const [dDate, setDDate] = useState('');

  // ====================================================
  // EXPENSE FORM
  // ====================================================

  const [eAmount, setEAmount] = useState('');
  const [eReason, setEReason] = useState('');
  const [eDate, setEDate] = useState('');

  // ====================================================
  // EDIT STATE
  // ====================================================
  const [editingDonationId, setEditingDonationId] = useState<string | null>(null);
  const [editingDonationAmount, setEditingDonationAmount] = useState<string>('');

  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingExpenseAmount, setEditingExpenseAmount] = useState<string>('');

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    void fetchData();

    const interval = setInterval(() => {
      setQuoteIndex((previous) => {
        return (previous + 1) % QUOTES.length;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ====================================================
  // FETCH DATA
  // ====================================================

  const fetchData = async () => {
    try {
      // -----------------------------------------------
      // FETCH DONATIONS
      // -----------------------------------------------

      const {
        data: dData,
        error: dError,
      } = await supabase
        .from('temple_donations')
        .select('*')
        .order('donation_date', {
          ascending: false,
        });

      if (dError) {
        console.error(
          'Error fetching donations:',
          dError
        );
      } else if (dData) {
        setDonations(dData as Donation[]);
      }

      // -----------------------------------------------
      // FETCH EXPENSES
      // -----------------------------------------------

      const {
        data: eData,
        error: eError,
      } = await supabase
        .from('temple_expenses')
        .select('*')
        .order('expense_date', {
          ascending: false,
        });

      if (eError) {
        console.error(
          'Error fetching expenses:',
          eError
        );
      } else if (eData) {
        setExpenses(eData as Expense[]);
      }
    } catch (error) {
      console.error(
        'Unexpected error while fetching data:',
        error
      );
    }
  };

  // ====================================================
  // ADMIN LOGIN
  // ====================================================

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      username === 'janardhan' || 'krishna.n'&&
      password === 'god@7431'
    ) {
      setIsAdmin(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  // ====================================================
  // ADMIN LOGOUT
  // ====================================================

  const handleLogout = () => {
    setIsAdmin(false);
    setUsername('');
    setPassword('');
  };

  // ====================================================
  // ADD DONATION
  // ====================================================

  const handleAddDonation = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    // Validate donor name
    if (!dName.trim()) {
      alert('Please enter donor name.');
      return;
    }

    // Validate date
    if (!dDate) {
      alert('Please select donation date.');
      return;
    }

    // Convert amount
    const amount =
      dAmount.trim() === ''
        ? null
        : Number.parseFloat(dAmount);

    // Validate amount
    if (
      dAmount.trim() !== '' &&
      (amount === null || Number.isNaN(amount) || amount < 0)
    ) {
      alert('Please enter a valid donation amount.');
      return;
    }

    // Insert donation
    const { error } = await supabase
      .from('temple_donations')
      .insert([
        {
          name: dName.trim(),
          amount,
          comments: dComments.trim(),
          donation_date: dDate,
        },
      ]);

    if (error) {
      console.error(
        'Error adding donation:',
        error
      );

      alert(
        'Error adding donation: ' +
        error.message
      );

      return;
    }

    alert('Donation added successfully');

    // Clear form
    setDName('');
    setDAmount('');
    setDComments('');
    setDDate('');

    // Refresh data
    await fetchData();
  };

  // ====================================================
  // ADD EXPENSE
  // ====================================================

  const handleAddExpense = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    // Validate amount
    if (!eAmount.trim()) {
      alert('Please enter expense amount.');
      return;
    }

    const amount = Number.parseFloat(eAmount);

    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      alert('Please enter a valid expense amount.');
      return;
    }

    // Validate reason
    if (!eReason.trim()) {
      alert('Please enter expense reason.');
      return;
    }

    // Validate date
    if (!eDate) {
      alert('Please select expense date.');
      return;
    }

    // Insert expense
    const { error } = await supabase
      .from('temple_expenses')
      .insert([
        {
          amount,
          reason: eReason.trim(),
          expense_date: eDate,
        },
      ]);

    if (error) {
      console.error(
        'Error adding expense:',
        error
      );

      alert(
        'Error adding expense: ' +
        error.message
      );

      return;
    }

    alert('Expense added successfully');

    // Clear form
    setEAmount('');
    setEReason('');
    setEDate('');

    // Refresh data
    await fetchData();
  };

  // ====================================================
  // UPDATE DONATION AMOUNT
  // ====================================================

  const handleUpdateDonationAmount = async (id: string) => {
    const val = Number.parseFloat(editingDonationAmount);
    if (Number.isNaN(val) || val < 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const { error } = await supabase
      .from('temple_donations')
      .update({ amount: val, is_edited: true })
      .eq('id', id);

    if (error) {
      alert('Error updating donation: ' + error.message);
      return;
    }

    alert('Donation updated successfully');
    setEditingDonationId(null);
    await fetchData();
  };

  // ====================================================
  // UPDATE EXPENSE AMOUNT
  // ====================================================

  const handleUpdateExpenseAmount = async (id: string) => {
    const val = Number.parseFloat(editingExpenseAmount);
    if (Number.isNaN(val) || val <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const { error } = await supabase
      .from('temple_expenses')
      .update({ amount: val, is_edited: true })
      .eq('id', id);

    if (error) {
      alert('Error updating expense: ' + error.message);
      return;
    }

    alert('Expense updated successfully');
    setEditingExpenseId(null);
    await fetchData();
  };

  // ====================================================
  // FILTER DONATIONS BY YEAR
  // ====================================================

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      return (
        new Date(
          donation.donation_date
        ).getFullYear() === selectedYear
      );
    });
  }, [donations, selectedYear]);

  // ====================================================
  // TOTAL DONATIONS
  // ====================================================

  const totalDonations = useMemo(() => {
    return donations.reduce((total, donation) => {
      return total + (donation.amount || 0);
    }, 0);
  }, [donations]);

  // ====================================================
  // TOTAL EXPENSES
  // ====================================================

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, expense) => {
      return total + (expense.amount || 0);
    }, 0);
  }, [expenses]);

  // ====================================================
  // CURRENT BALANCE
  // ====================================================

  const currentBalance =
    totalDonations - totalExpenses;

  // ====================================================
  // YEARS
  // ====================================================

  const years = useMemo(() => {
    const yearSet = new Set<number>();

    donations.forEach((donation) => {
      yearSet.add(
        new Date(
          donation.donation_date
        ).getFullYear()
      );
    });

    yearSet.add(new Date().getFullYear());

    return Array.from(yearSet).sort(
      (a, b) => b - a
    );
  }, [donations]);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="app-container">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <nav className="topbar">

        <div className="logo-container">
          <h1 className="temple-title-small">
            PALA POLAMMA THALLI
          </h1>
        </div>

        <div className="auth-container">

          {isAdmin ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleLogout}
            >
              Logout Admin
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                setShowLogin(true)
              }
            >
              Admin Login
            </button>
          )}

        </div>
      </nav>

      {/* ==================================================
          MINI STATISTICS
      ================================================== */}

      <div
        className="mini-stats"
        style={{
          display: 'flex',
          gap: '20px',
          padding: '15px 30px',
          justifyContent: 'flex-start',
          fontSize: '0.95rem',
          color: 'var(--primary-gold)',
          fontFamily: 'Montserrat, sans-serif',
          flexWrap: 'wrap',
        }}
      >

        <div>
          <strong>Total Collected:</strong>{' '}
          <span style={{ color: '#ffffff' }}>
            <OdometerNumber value={totalDonations} />
          </span>
        </div>

        <div>
          <strong>Total Expenses:</strong>{' '}
          <span style={{ color: '#ffffff' }}>
            <OdometerNumber value={totalExpenses} />
          </span>
        </div>

        <div>
          <strong>Current Balance:</strong>{' '}
          <span style={{ color: '#ffffff' }}>
            <OdometerNumber value={currentBalance} />
          </span>
        </div>

      </div>

      {/* ==================================================
          LOGIN MODAL
      ================================================== */}

      {showLogin && !isAdmin && (
        <div className="modal-overlay">

          <div className="modal glass">

            <h2>Admin Login</h2>

            <form onSubmit={handleLogin}>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                required
              />

              <div className="modal-actions">

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Login
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setShowLogin(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ==================================================
          HERO
      ================================================== */}

      <header className="hero-section">

        <div className="hero-content">

          <div className="hero-subtitle">

            <span className="om-symbol cinzel-font">
              ॐ
            </span>{' '}

            OM SRI PALA POLAMMA THALLI

          </div>


          <div className="hero-location cinzel-font">
            — RAVIVALASA, ANDHRA PRADESH —
          </div>

          <p className="hero-description">

            Seek the Divine Blessings of Goddess
            Pala Polamma Thalli.

            <br />
            <br />

            Visit the sacred temple in Ravivalasa
            and experience the divine presence,
            spiritual traditions, and timeless
            heritage.

            <br />
            <br />

            <strong
              style={{
                color:
                  'var(--primary-gold)',
              }}
            >
              "{QUOTES[quoteIndex]}"
            </strong>

          </p>

          {/* Navigation Buttons */}

          <div
            className="hero-actions"
            style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap',
            }}
          >

            <button
              type="button"
              className={`btn-primary ${activeTab === 'dashboard'
                ? 'active'
                : ''
                }`}
              onClick={() =>
                setActiveTab('dashboard')
              }
              style={
                activeTab === 'dashboard'
                  ? {
                    background:
                      'var(--primary-gold)',
                    color:
                      'var(--bg-dark-maroon)',
                  }
                  : undefined
              }
            >
              Dashboard
            </button>

            <button
              type="button"
              className={`btn-primary ${activeTab === 'donations'
                ? 'active'
                : ''
                }`}
              onClick={() =>
                setActiveTab('donations')
              }
              style={
                activeTab === 'donations'
                  ? {
                    background:
                      'var(--primary-gold)',
                    color:
                      'var(--bg-dark-maroon)',
                  }
                  : undefined
              }
            >
              Donors
            </button>

            <button
              type="button"
              className={`btn-primary ${activeTab === 'expenses'
                ? 'active'
                : ''
                }`}
              onClick={() =>
                setActiveTab('expenses')
              }
              style={
                activeTab === 'expenses'
                  ? {
                    background:
                      'var(--primary-gold)',
                    color:
                      'var(--bg-dark-maroon)',
                  }
                  : undefined
              }
            >
              Expenses
            </button>

          </div>

        </div>

        {/* Temple Image */}

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

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        className="main-content glass"
        style={
          activeTab === 'dashboard'
            ? {
              display: 'none',
            }
            : {
              padding: '30px',
              marginTop: '20px',
            }
        }
      >

        {/* ==================================================
            DONATIONS
        ================================================== */}

        {activeTab === 'donations' && (

          <section className="donations-section fade-in">

            <div className="section-header">

              <h2 className="cinzel-font">
                Our Generous Donors
              </h2>

              <select
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="year-select"
              >

                {years.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}

              </select>

            </div>

            {/* Admin Donation Form */}

            {isAdmin && (

              <div className="admin-form glass">

                <h3>
                  Add New Donation
                </h3>

                <form
                  onSubmit={
                    handleAddDonation
                  }
                >

                  <input
                    type="text"
                    placeholder="Donor Name"
                    value={dName}
                    onChange={(event) =>
                      setDName(
                        event.target.value
                      )
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Amount (Leave empty if none)"
                    value={dAmount}
                    onChange={(event) =>
                      setDAmount(
                        event.target.value
                      )
                    }
                    min="0"
                    step="0.01"
                  />

                  <input
                    type="text"
                    placeholder="Comments (e.g. Construction Materials)"
                    value={dComments}
                    onChange={(event) =>
                      setDComments(
                        event.target.value
                      )
                    }
                  />

                  <input
                    type="date"
                    value={dDate}
                    onChange={(event) =>
                      setDDate(
                        event.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit Donation
                  </button>

                </form>

              </div>
            )}

            {/* Donation Table */}

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Comments</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredDonations.length > 0 ? (

                    filteredDonations.map(
                      (donation) => (

                        <tr
                          key={donation.id}
                        >

                          <td>
                            {new Date(
                              donation.donation_date
                            ).toLocaleDateString(
                              'en-IN'
                            )}
                          </td>

                          <td>
                            {donation.name}
                          </td>

                          <td
                            style={{
                              color: 'var(--primary-gold)',
                              fontWeight: 'bold',
                            }}
                          >
                            {isAdmin && editingDonationId === donation.id ? (
                              <div style={{ display: 'flex', gap: '5px' }}>
                                <input
                                  type="number"
                                  value={editingDonationAmount}
                                  onChange={(e) => setEditingDonationAmount(e.target.value)}
                                  style={{ width: '80px', padding: '2px 5px' }}
                                />
                                <button
                                  className="btn-primary"
                                  style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                  onClick={() => handleUpdateDonationAmount(donation.id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn-secondary"
                                  style={{ padding: '2px 8px', fontSize: '0.8rem' }}
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
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--text-muted)',
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      textDecoration: 'underline'
                                    }}
                                    onClick={() => {
                                      setEditingDonationId(donation.id);
                                      setEditingDonationAmount(donation.amount ? donation.amount.toString() : '');
                                    }}
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          <td>
                            {donation.comments ||
                              '-'}
                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan={4}
                        className="text-center"
                      >
                        No donations found
                        for {selectedYear}
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

        {/* ==================================================
            EXPENSES
        ================================================== */}

        {activeTab === 'expenses' && (

          <section className="expenses-section fade-in">

            <div className="section-header">

              <h2 className="cinzel-font">
                Temple Expenses
              </h2>

            </div>

            {/* Admin Expense Form */}

            {isAdmin && (

              <div className="admin-form glass">

                <h3>
                  Add New Expense
                </h3>

                <form
                  onSubmit={
                    handleAddExpense
                  }
                >

                  <input
                    type="number"
                    placeholder="Amount"
                    value={eAmount}
                    onChange={(event) =>
                      setEAmount(
                        event.target.value
                      )
                    }
                    min="0"
                    step="0.01"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Reason"
                    value={eReason}
                    onChange={(event) =>
                      setEReason(
                        event.target.value
                      )
                    }
                    required
                  />

                  <input
                    type="date"
                    value={eDate}
                    onChange={(event) =>
                      setEDate(
                        event.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit Expense
                  </button>

                </form>

              </div>
            )}

            {/* Expense Table */}

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Amount</th>
                  </tr>

                </thead>

                <tbody>

                  {expenses.length > 0 ? (

                    expenses.map((expense) => (

                      <tr
                        key={expense.id}
                      >

                        <td>
                          {new Date(
                            expense.expense_date
                          ).toLocaleDateString(
                            'en-IN'
                          )}
                        </td>

                        <td>
                          {expense.reason}
                        </td>

                        <td
                          style={{
                            color: 'var(--primary-gold)',
                            fontWeight: 'bold',
                          }}
                        >
                          {isAdmin && editingExpenseId === expense.id ? (
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <input
                                type="number"
                                value={editingExpenseAmount}
                                onChange={(e) => setEditingExpenseAmount(e.target.value)}
                                style={{ width: '80px', padding: '2px 5px' }}
                              />
                              <button
                                className="btn-primary"
                                style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                onClick={() => handleUpdateExpenseAmount(expense.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn-secondary"
                                style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                onClick={() => setEditingExpenseId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>
                                ₹{expense.amount.toLocaleString('en-IN')}
                              </span>
                              {expense.is_edited && (
                                <small style={{ fontSize: '0.7em', color: 'var(--text-muted)' }}>
                                  (Edited)
                                </small>
                              )}
                              {isAdmin && (
                                <button
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    textDecoration: 'underline'
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

                      <td
                        colSpan={3}
                        className="text-center"
                      >
                        No expenses recorded
                        yet
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        className="footer-section glass"
        style={{
          marginTop: '40px',
          padding: '10px',
          borderRadius: '10px',
        }}
      >
        <h3 className="cinzel-font">
          Contact for Donations
        </h3>
        <p style={{ marginTop: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Design & Developed by Manmadha pitta <br></br>
          Copyrights © Powerstar Youth Newcolony - Ravivalasa <br></br>

        </p>


        <p>
          📞 9346184327
          &nbsp;|&nbsp;
          📞 6302505146
          &nbsp;|&nbsp;
          📞 9052244870
        </p>

      </footer>

    </div>
  );
}
