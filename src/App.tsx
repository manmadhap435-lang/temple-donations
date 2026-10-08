import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import './index.css';

// Types
interface Donation {
  id: string;
  name: string;
  amount: number | null;
  comments: string;
  donation_date: string;
}

interface Expense {
  id: string;
  amount: number;
  reason: string;
  expense_date: string;
}

const QUOTES = [
  "Dharma protects those who protect it.",
  "Service to humanity is service to God.",
  "Faith makes all things possible... love makes all things easy."
];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'donations' | 'expenses'>('dashboard');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [quoteIndex, setQuoteIndex] = useState(0);

  // Forms
  const [dName, setDName] = useState('');
  const [dAmount, setDAmount] = useState('');
  const [dComments, setDComments] = useState('');
  const [dDate, setDDate] = useState('');

  const [eAmount, setEAmount] = useState('');
  const [eReason, setEReason] = useState('');
  const [eDate, setEDate] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const { data: dData, error: dError } = await supabase.from('temple_donations').select('*').order('donation_date', { ascending: false });
      if (dData) setDonations(dData);

      const { data: eData, error: eError } = await supabase.from('temple_expenses').select('*').order('expense_date', { ascending: false });
      if (eData) setExpenses(eData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'janardhan' && password === 'god@7431') {
      setIsAdmin(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
    } else {
      alert("Invalid credentials");
    }
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('temple_donations').insert([
      {
        name: dName,
        amount: dAmount ? parseFloat(dAmount) : null,
        comments: dComments,
        donation_date: dDate
      }
    ]);
    if (!error) {
      alert('Donation added successfully');
      setDName(''); setDAmount(''); setDComments(''); setDDate('');
      fetchData();
    } else {
      alert('Error adding donation: ' + error.message);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('temple_expenses').insert([
      {
        amount: parseFloat(eAmount),
        reason: eReason,
        expense_date: eDate
      }
    ]);
    if (!error) {
      alert('Expense added successfully');
      setEAmount(''); setEReason(''); setEDate('');
      fetchData();
    } else {
      alert('Error adding expense: ' + error.message);
    }
  };

  const filteredDonations = useMemo(() => {
    return donations.filter(d => new Date(d.donation_date).getFullYear() === selectedYear);
  }, [donations, selectedYear]);

  const totalDonations = useMemo(() => {
    return donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  }, [donations]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [expenses]);

  const currentBalance = totalDonations - totalExpenses;

  const years = useMemo(() => {
    const y = new Set<number>();
    donations.forEach(d => y.add(new Date(d.donation_date).getFullYear()));
    y.add(new Date().getFullYear());
    return Array.from(y).sort((a, b) => b - a);
  }, [donations]);

  return (
    <div className="app-container">
      <nav className="topbar">
        <div className="logo-container">
          <h1 className="temple-title-small">PALA POLAMMA THALLI</h1>
        </div>
        <div className="auth-container">
          {isAdmin ? (
            <button className="btn-secondary" onClick={() => setIsAdmin(false)}>Logout Admin</button>
          ) : (
            <button className="btn-primary" onClick={() => setShowLogin(!showLogin)}>Admin Login</button>
          )}
        </div>
      </nav>

      <div className="mini-stats" style={{ display: 'flex', gap: '20px', padding: '15px 30px', fontSize: '0.95rem', color: 'var(--primary-gold)', fontFamily: 'Montserrat, sans-serif' }}>
        <div><strong>Total Collected:</strong> ₹{totalDonations.toLocaleString('en-IN')}</div>
        <div><strong>Total Expenses:</strong> ₹{totalExpenses.toLocaleString('en-IN')}</div>
        <div><strong>Current Balance:</strong> ₹{currentBalance.toLocaleString('en-IN')}</div>
      </div>

      {showLogin && !isAdmin && (
        <div className="modal-overlay">
          <div className="modal glass">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Login</button>
                <button type="button" className="btn-secondary" onClick={() => setShowLogin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-subtitle">
            <span className="om-symbol cinzel-font">ॐ</span> OM SRI PALA POLAMMA THALLI
          </div>


          <div className="hero-location cinzel-font">
            — RAVIVALASA, ANDHRA PRADESH —
          </div>
          <p className="hero-description">
            Seek the Divine Blessings of Goddess Pala Polamma Thalli. <br /><br />
            Visit the sacred temple in Ravivalasa and experience the divine presence, spiritual traditions, and timeless heritage. <br /><br />
            <strong style={{ color: 'var(--primary-gold)' }}>"{QUOTES[quoteIndex]}"</strong>
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button className={`btn-primary ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? { background: 'var(--primary-gold)', color: 'var(--bg-dark-maroon)' } : {}}>Dashboard</button>
            <button className={`btn-primary ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')} style={activeTab === 'donations' ? { background: 'var(--primary-gold)', color: 'var(--bg-dark-maroon)' } : {}}>Donors</button>
            <button className={`btn-primary ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')} style={activeTab === 'expenses' ? { background: 'var(--primary-gold)', color: 'var(--bg-dark-maroon)' } : {}}>Expenses</button>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img src="/assets/palaplamma.jpg" alt="Pala Polamma Thalli" className="main-deity" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x600/3a0a0a/d4af37?text=Palapolamma+Thalli'; }} />
        </div>
      </header>

      <main className="main-content glass" style={activeTab === 'dashboard' ? { display: 'none' } : { padding: '30px', marginTop: '20px' }}>
        {activeTab === 'dashboard' && null}

        {activeTab === 'donations' && (
          <section className="donations-section fade-in">
            <div className="section-header">
              <h2 className="cinzel-font">Our Generous Donors</h2>
              <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="year-select">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {isAdmin && (
              <div className="admin-form glass">
                <h3>Add New Donation</h3>
                <form onSubmit={handleAddDonation}>
                  <input type="text" placeholder="Donor Name" value={dName} onChange={e => setDName(e.target.value)} required />
                  <input type="number" placeholder="Amount (Leave empty if none)" value={dAmount} onChange={e => setDAmount(e.target.value)} />
                  <input type="text" placeholder="Comments (e.g. Construction Materials)" value={dComments} onChange={e => setDComments(e.target.value)} />
                  <input type="date" value={dDate} onChange={e => setDDate(e.target.value)} required />
                  <button type="submit" className="btn-primary">Submit Donation</button>
                </form>
              </div>
            )}

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
                  {filteredDonations.length > 0 ? filteredDonations.map(d => (
                    <tr key={d.id}>
                      <td>{new Date(d.donation_date).toLocaleDateString('en-IN')}</td>
                      <td>{d.name}</td>
                      <td style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>{d.amount ? `₹${d.amount.toLocaleString('en-IN')}` : '-'}</td>
                      <td>{d.comments || '-'}</td>
                    </tr>
                  )) : <tr><td colSpan={4} className="text-center">No donations found for {selectedYear}</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'expenses' && (
          <section className="expenses-section fade-in">
            <div className="section-header">
              <h2 className="cinzel-font">Temple Expenses</h2>
            </div>

            {isAdmin && (
              <div className="admin-form glass">
                <h3>Add New Expense</h3>
                <form onSubmit={handleAddExpense}>
                  <input type="number" placeholder="Amount" value={eAmount} onChange={e => setEAmount(e.target.value)} required />
                  <input type="text" placeholder="Reason" value={eReason} onChange={e => setEReason(e.target.value)} required />
                  <input type="date" value={eDate} onChange={e => setEDate(e.target.value)} required />
                  <button type="submit" className="btn-primary">Submit Expense</button>
                </form>
              </div>
            )}

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
                  {expenses.length > 0 ? expenses.map(e => (
                    <tr key={e.id}>
                      <td>{new Date(e.expense_date).toLocaleDateString('en-IN')}</td>
                      <td>{e.reason}</td>
                      <td style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>₹{e.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  )) : <tr><td colSpan={3} className="text-center">No expenses recorded yet</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <footer className="footer-section glass" style={{ marginTop: '40px', padding: '30px', borderRadius: '12px' }}>
        <h3 className="cinzel-font">Contact for Donations</h3>
        <p>📞 9346184327 &nbsp;|&nbsp; 📞 6302505146 &nbsp;|&nbsp; 📞 9052244870</p>
      </footer>
    </div>
  );
}
