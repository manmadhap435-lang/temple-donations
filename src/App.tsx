import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import type {
  Donation,
  Expense,
  TempleTransaction,
  TabType,
  TransactionFilterType,
} from './types/temple';
import { Navbar } from './components/Navbar';
import { MiniStats } from './components/MiniStats';
import { HeroSection } from './components/HeroSection';
import { LoginModal } from './components/LoginModal';
import { DonateModal } from './components/DonateModal';
import { DonorsSection } from './components/DonorsSection';
import { ExpensesSection } from './components/ExpensesSection';
import { TransactionsSection } from './components/TransactionsSection';
import { Footer } from './components/Footer';
import { getAdminInfo } from './utils/adminHelper';

// ======================================================
// SACRED QUOTES
// ======================================================

const QUOTES = [
  'నమ్మిన భక్తులను చల్లగా కాపాడే కల్పవల్లి శ్రీ పాల పోలమ్మ తల్లి 🙏🌺',
  'Faith moves mountains; devotion to Palapolamma brings endless peace.',
  'తల్లి పాలపోలమ్మ అనుగ్రహం ఉంటే కొండంత కష్టమైనా దూదిపింజలా ఎగిరిపోతుంది.',
  'సర్వజన సుఖినోభవంతు - అమ్మవారి కరుణ అందరిపై సదా ఉండుగాక!',
  'True devotion lies in pure thoughts and selfless service.',
  'పాలపోలమ్మ తల్లి దీవెనలే మా బలం… అమ్మ కరుణే మా రక్షణ.',
  'శ్రీ పాల పోలమ్మ తల్లి ఆశీస్సులు అందరిపై ఉండాలని కోరుకుంటున్నాము 🙏',
  'పాలపోలమ్మ నమ్మిన భక్తునికి భయం లేదు; దుర్గమ్మ తల్లి దీవెన ఉన్న జీవితానికి ఓటమి లేదు..',
  'Faith makes all things possible... love makes all things easy.',
  'పాలపోలమ్మ ఆశీస్సులు ఉన్నచోట భయానికి స్థానం లేదు.',
  'పాలపోలమ్మ కరుణ ఉంటే అసాధ్యం ఏదీ లేదు.',
  'Service to humanity is service to God.',
  'పాలపోలమ్మ కరుణతోనే అద్భుతాలు జరుగుతాయి..',
  'పాలపోలమ్మ పాదాలే మా శరణు.',
  'తల్లి ఆశీస్సులతోనే శాంతి, ఐశ్వర్యం సిద్ధిస్తాయి.',
  'ఎన్ని కష్టాలు వచ్చినా అమ్మపై నమ్మకం ఉంటే మనసుకు ఓటమి ఉండదు.',
  'పాలపోలమ్మ తల్లి మా ఊరి ఆరాధ్య దైవం… మా అందరి నమ్మకానికి నిలువెత్తు రూపం.',
  'Dharma protects those who protect it.',
  'జై పాలపోలమ్మ తల్లి 🙏🌺',
  'అమ్మ కరుణ మనందరికీ కొండంత అండ.',
];

// ======================================================
// MAIN APP COMPONENT
// ======================================================

export default function App() {
  // ----------------------------------------------------
  // ADMIN AUTHENTICATION
  // ----------------------------------------------------
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('temple_is_admin') === 'true';
  });
  const [loggedInAdmin, setLoggedInAdmin] = useState<string>(() => {
    return localStorage.getItem('temple_admin_user') || '';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // ----------------------------------------------------
  // DATA STATES
  // ----------------------------------------------------
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactions, setTransactions] = useState<TempleTransaction[]>([]);
  const [rejectedTransactions, setRejectedTransactions] = useState<TempleTransaction[]>([]);

  // ----------------------------------------------------
  // NAVIGATION & FILTERS
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilterType>('all');
  const [transactionSearch, setTransactionSearch] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [quoteIndex, setQuoteIndex] = useState(0);

  // ----------------------------------------------------
  // ADMIN FORM STATES
  // ----------------------------------------------------
  const [dName, setDName] = useState('');
  const [dAmount, setDAmount] = useState('');
  const [dComments, setDComments] = useState('');
  const [dDate, setDDate] = useState('');

  const [eAmount, setEAmount] = useState('');
  const [eReason, setEReason] = useState('');
  const [eDate, setEDate] = useState('');

  // ----------------------------------------------------
  // INLINE EDIT STATES
  // ----------------------------------------------------
  const [editingDonationId, setEditingDonationId] = useState<string | null>(null);
  const [editingDonationAmount, setEditingDonationAmount] = useState<string>('');

  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingExpenseAmount, setEditingExpenseAmount] = useState<string>('');

  // ----------------------------------------------------
  // INITIAL LOAD & QUOTE INTERVAL
  // ----------------------------------------------------
  useEffect(() => {
    void fetchData();

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------
  // SUPABASE DATA FETCH
  // ----------------------------------------------------
  const fetchData = async () => {
    try {
      // 1. Fetch Donations
      const { data: dData, error: dError } = await supabase
        .from('temple_donations')
        .select('*')
        .order('donation_date', { ascending: false });

      if (dError) console.error('Error fetching donations:', dError);
      else if (dData) setDonations(dData as Donation[]);

      // 2. Fetch Expenses
      const { data: eData, error: eError } = await supabase
        .from('temple_expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (eError) console.error('Error fetching expenses:', eError);
      else if (eData) setExpenses(eData as Expense[]);

      // 3. Fetch Transactions
      try {
        const { data: tData, error: tError } = await supabase
          .from('temple_transactions')
          .select('*')
          .order('transaction_date', { ascending: false });

        if (tError) console.warn('temple_transactions table notice:', tError.message);
        else if (tData) setTransactions(tData as TempleTransaction[]);
      } catch (err) {
        console.warn('temple_transactions fetch warning:', err);
      }

      // 4. Fetch Rejected Transactions
      try {
        const { data: rData, error: rError } = await supabase
          .from('temple_rejected_transactions')
          .select('*')
          .order('transaction_date', { ascending: false });

        if (rError) console.warn('temple_rejected_transactions notice:', rError.message);
        else if (rData) {
          setRejectedTransactions(
            rData.map((r: any) => ({
              id: r.id,
              name: r.name,
              amount: r.amount,
              utr_number: r.utr_number,
              comments: r.comments || '',
              status: 'REJECTED' as const,
              rejection_reason: r.reason,
              transaction_date: r.transaction_date,
              created_at: r.created_at || r.rejected_at,
              source: 'rejected_table' as const,
            }))
          );
        }
      } catch (err) {
        console.warn('temple_rejected_transactions fetch warning:', err);
      }
    } catch (error) {
      console.error('Unexpected error while fetching data:', error);
    }
  };

  // ----------------------------------------------------
  // ADMIN LOGIN & LOGOUT
  // ----------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsernames = ['janardhan', 'krishna.n', 'eswar.m', 'raju.d'];
    const validPassword = 'god@7431';
    const cleaned = username.trim().toLowerCase();
    if (validUsernames.includes(cleaned) && password === validPassword) {
      setIsAdmin(true);
      setLoggedInAdmin(cleaned);
      localStorage.setItem('temple_is_admin', 'true');
      localStorage.setItem('temple_admin_user', cleaned);
      setShowLogin(false);
      setUsername('');
      setPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setLoggedInAdmin('');
    localStorage.removeItem('temple_is_admin');
    localStorage.removeItem('temple_admin_user');
    setUsername('');
    setPassword('');
    if (activeTab === 'transactions') {
      setActiveTab('dashboard');
    }
  };

  // ----------------------------------------------------
  // ADD DONATION (MANUAL / CASH)
  // ----------------------------------------------------
  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dName.trim()) {
      alert('Please enter donor name.');
      return;
    }
    if (!dDate) {
      alert('Please select donation date.');
      return;
    }

    const amount = dAmount.trim() === '' ? null : Number.parseFloat(dAmount);
    if (dAmount.trim() !== '' && (amount === null || Number.isNaN(amount) || amount < 0)) {
      alert('Please enter a valid donation amount.');
      return;
    }

    const adminInfo = getAdminInfo(loggedInAdmin);
    const notation = `[${adminInfo.initial}]`;
    const finalComments = dComments.trim()
      ? `${dComments.trim()} ${notation}`
      : notation;

    const { error } = await supabase.from('temple_donations').insert([
      {
        name: dName.trim(),
        amount,
        comments: finalComments,
        donation_date: dDate,
      },
    ]);

    if (error) {
      alert('Error adding donation: ' + error.message);
      return;
    }

    alert('Donation added successfully');
    setDName('');
    setDAmount('');
    setDComments('');
    setDDate('');
    await fetchData();
  };

  // ----------------------------------------------------
  // ADD EXPENSE
  // ----------------------------------------------------
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number.parseFloat(eAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }
    if (!eReason.trim()) {
      alert('Please enter reason for expense.');
      return;
    }
    if (!eDate) {
      alert('Please select expense date.');
      return;
    }

    const adminInfo = getAdminInfo(loggedInAdmin);
    const notation = `[${adminInfo.initial}]`;
    const finalReason = `${eReason.trim()} ${notation}`;

    const { error } = await supabase.from('temple_expenses').insert([
      {
        amount,
        reason: finalReason,
        expense_date: eDate,
      },
    ]);

    if (error) {
      alert('Error adding expense: ' + error.message);
      return;
    }

    alert('Expense added successfully');
    setEAmount('');
    setEReason('');
    setEDate('');
    await fetchData();
  };

  // ----------------------------------------------------
  // INLINE UPDATES
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // ONLINE UPI DONATION SUBMISSION
  // ----------------------------------------------------
  const handleOnlineDonationSubmit = async (data: {
    name: string;
    amount: number;
    comments: string;
    date: string;
  }): Promise<boolean> => {
    const utrMatch = data.comments.match(/\[UPI_PENDING:UTR([^\]]+)\]/i);
    const cleanUtr = utrMatch ? utrMatch[1].trim() : '';
    const cleanComment = data.comments.replace(/\[UPI_PENDING:UTR[^\]]*\]\s*/i, '').trim();

    const { error: txError } = await supabase.from('temple_transactions').insert([
      {
        name: data.name.trim(),
        amount: data.amount,
        utr_number: cleanUtr || `TXN-${Date.now()}`,
        comments: cleanComment,
        status: 'PENDING',
        transaction_date: data.date,
      },
    ]);

    if (txError) {
      console.warn('temple_transactions insert notice:', txError.message);
      if (
        txError.message.toLowerCase().includes('unique') ||
        txError.message.toLowerCase().includes('duplicate')
      ) {
        alert('⚠️ ఈ 12-అంకెల UTR నంబరుతో లావాదేవీ ఇప్పటికే నమోదైంది (This UTR Number has already been submitted).');
        return false;
      }

      // Fallback: save in temple_donations if transactions table not yet initialized
      const { error: dError } = await supabase.from('temple_donations').insert([
        {
          name: data.name,
          amount: data.amount,
          comments: data.comments,
          donation_date: data.date,
        },
      ]);
      if (dError) {
        console.error('Error submitting online donation:', dError);
        alert('Error submitting donation: ' + dError.message);
        return false;
      }
    }

    await fetchData();
    return true;
  };

  // ----------------------------------------------------
  // TRANSACTION MANAGEMENT (ADMIN ONLY)
  // ----------------------------------------------------
  const handleApproveTransaction = async (tx: TempleTransaction) => {
    if (tx.source !== 'legacy_donations') {
      const { error: txErr } = await supabase
        .from('temple_transactions')
        .update({
          status: 'APPROVED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', tx.id);
      if (txErr) console.warn('temple_transactions update:', txErr.message);
    }

    const adminInfo = getAdminInfo(loggedInAdmin);
    const notation = `[${adminInfo.initial}]`;

    const verifiedComment = tx.utr_number
      ? `${tx.comments ? `${tx.comments} ` : ''}(Verified UPI: UTR ${tx.utr_number}) ${notation}`.trim()
      : `${tx.comments ? `${tx.comments} ` : ''}(Verified UPI) ${notation}`.trim();

    if (tx.source === 'legacy_donations') {
      const { error } = await supabase
        .from('temple_donations')
        .update({
          comments: `[UPI_APPROVED:UTR${tx.utr_number}] ${verifiedComment}`,
        })
        .eq('id', tx.id);
      if (error) alert('Error: ' + error.message);
    } else {
      const { error: insertErr } = await supabase.from('temple_donations').insert([
        {
          name: tx.name,
          amount: tx.amount,
          comments: verifiedComment,
          donation_date: tx.transaction_date,
        },
      ]);
      if (insertErr) console.warn('temple_donations insert:', insertErr.message);
    }

    alert(`✓ Transaction of ₹${tx.amount?.toLocaleString('en-IN')} by ${tx.name} APPROVED!\nIt is now listed in the official Donors list and added to Total Collected balance.`);
    await fetchData();
  };

  const handleRejectTransaction = async (tx: TempleTransaction) => {
    const reason = window.prompt(
      'Enter rejection reason (e.g. Bank statement mismatch / UTR not found / Invalid amount):',
      'Bank statement mismatch / Payment not received'
    );
    if (reason === null) return; // Admin cancelled

    // 1. Insert into dedicated temple_rejected_transactions table
    try {
      const { error: rErr } = await supabase.from('temple_rejected_transactions').insert([
        {
          name: tx.name,
          amount: tx.amount,
          utr_number: tx.utr_number || `REJ-${Date.now()}`,
          reason: reason.trim(),
          comments: tx.comments || '',
          transaction_date: tx.transaction_date,
          rejected_by: loggedInAdmin || 'admin',
        },
      ]);
      if (rErr) console.warn('temple_rejected_transactions insert notice:', rErr.message);
    } catch (err) {
      console.warn('temple_rejected_transactions insert error:', err);
    }

    // 2. Update temple_transactions status if available
    if (tx.source !== 'legacy_donations') {
      await supabase
        .from('temple_transactions')
        .update({
          status: 'REJECTED',
          rejection_reason: reason.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', tx.id);
    }

    // 3. Update legacy donations if applicable
    if (tx.source === 'legacy_donations') {
      await supabase
        .from('temple_donations')
        .update({
          comments: `[UPI_REJECTED:UTR${tx.utr_number}] ${tx.comments} (Rejected: ${reason.trim()})`,
        })
        .eq('id', tx.id);
    }

    alert(`✗ Transaction of ₹${tx.amount?.toLocaleString('en-IN')} marked as REJECTED and saved to rejected transactions table.`);
    await fetchData();
  };

  const handleDeleteTransaction = async (tx: TempleTransaction) => {
    if (!window.confirm('Are you sure you want to permanently delete this transaction from the database? This cannot be undone.')) {
      return;
    }

    if (tx.source === 'legacy_donations') {
      await supabase.from('temple_donations').delete().eq('id', tx.id);
    } else if (tx.source === 'rejected_table') {
      await supabase.from('temple_rejected_transactions').delete().eq('id', tx.id);
    } else {
      await supabase.from('temple_transactions').delete().eq('id', tx.id);
      if (tx.utr_number) {
        await supabase.from('temple_rejected_transactions').delete().eq('utr_number', tx.utr_number);
      }
    }

    alert('Transaction permanently removed.');
    await fetchData();
  };

  // ----------------------------------------------------
  // COMPUTED VALUES (MEMOS)
  // ----------------------------------------------------
  const allTransactions = useMemo(() => {
    const list: TempleTransaction[] = [];
    const seenUtrs = new Set<string>();

    // 1. From temple_transactions table
    transactions.forEach((tx) => {
      const utr = tx.utr_number ? tx.utr_number.trim() : '';
      if (utr) seenUtrs.add(utr.toLowerCase());
      list.push({ ...tx, source: 'transactions_table' });
    });

    // 2. From legacy temple_donations if has UPI tags
    donations.forEach((d) => {
      const isPending = Boolean(d.comments?.includes('[UPI_PENDING:'));
      const isRejected = Boolean(d.comments?.includes('[UPI_REJECTED:'));
      const isApprovedTag = Boolean(d.comments?.includes('[UPI_APPROVED:'));
      const isVerifiedText = Boolean(d.comments?.toLowerCase().includes('verified upi'));

      const utrMatch =
        d.comments?.match(/\[UPI_(?:PENDING|REJECTED|APPROVED):UTR([^\]]+)\]/i) ||
        d.comments?.match(/UTR[:\s]*([a-zA-Z0-9]+)/i);
      const utr = utrMatch ? utrMatch[1].trim() : '';

      const isOnline = isPending || isRejected || isApprovedTag || isVerifiedText || Boolean(utr);
      if (!isOnline) return;
      if (utr && seenUtrs.has(utr.toLowerCase())) return;

      let status: 'PENDING' | 'APPROVED' | 'REJECTED' = 'APPROVED';
      if (isPending) status = 'PENDING';
      else if (isRejected) status = 'REJECTED';
      else if (isApprovedTag || isVerifiedText) status = 'APPROVED';

      const cleanComment = d.comments
        ? d.comments
          .replace(/\[UPI_(?:PENDING|REJECTED|APPROVED):UTR[^\]]*\]\s*/gi, '')
          .replace(/\(Verified UPI[^)]*\)/gi, '')
          .replace(/\(Rejected:[^)]*\)/gi, '')
          .trim()
        : '';

      const rejectionMatch = d.comments?.match(/\(Rejected:\s*([^)]+)\)/i);
      const rejectionReason = rejectionMatch ? rejectionMatch[1].trim() : undefined;

      list.push({
        id: d.id,
        name: d.name,
        amount: d.amount,
        utr_number: utr,
        comments: cleanComment,
        status,
        rejection_reason: rejectionReason,
        transaction_date: d.donation_date,
        source: 'legacy_donations',
      });
    });

    // 3. From temple_rejected_transactions table
    rejectedTransactions.forEach((rtx) => {
      const utr = rtx.utr_number ? rtx.utr_number.trim() : '';
      if (utr && seenUtrs.has(utr.toLowerCase())) return;
      if (utr) seenUtrs.add(utr.toLowerCase());
      list.push(rtx);
    });

    return list.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  }, [transactions, donations, rejectedTransactions]);

  const pendingTransactionsCount = useMemo(() => {
    return allTransactions.filter((t) => t.status === 'PENDING').length;
  }, [allTransactions]);

  const approvedTransactionsCount = useMemo(() => {
    return allTransactions.filter((t) => t.status === 'APPROVED').length;
  }, [allTransactions]);

  const rejectedTransactionsCount = useMemo(() => {
    return allTransactions.filter((t) => t.status === 'REJECTED').length;
  }, [allTransactions]);

  const totalVerifiedOnlineAmount = useMemo(() => {
    return allTransactions
      .filter((t) => t.status === 'APPROVED')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [allTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      if (transactionFilter === 'pending' && t.status !== 'PENDING') return false;
      if (transactionFilter === 'approved' && t.status !== 'APPROVED') return false;
      if (transactionFilter === 'rejected' && t.status !== 'REJECTED') return false;

      if (transactionSearch.trim()) {
        const query = transactionSearch.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(query);
        const matchesUtr = (t.utr_number || '').toLowerCase().includes(query);
        const matchesComment = (t.comments || '').toLowerCase().includes(query);
        const matchesAmount = (t.amount || '').toString().includes(query);
        if (!matchesName && !matchesUtr && !matchesComment && !matchesAmount) return false;
      }
      return true;
    });
  }, [allTransactions, transactionFilter, transactionSearch]);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const isPending = donation.comments?.includes('[UPI_PENDING:');
      const isRejected = donation.comments?.includes('[UPI_REJECTED:');
      if (isPending || isRejected) return false;
      return new Date(donation.donation_date).getFullYear() === selectedYear;
    });
  }, [donations, selectedYear]);

  const totalDonations = useMemo(() => {
    return donations.reduce((total, donation) => {
      const isPending = donation.comments?.includes('[UPI_PENDING:');
      const isRejected = donation.comments?.includes('[UPI_REJECTED:');
      if (isPending || isRejected) return total;
      return total + (donation.amount || 0);
    }, 0);
  }, [donations]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  }, [expenses]);

  const currentBalance = totalDonations - totalExpenses;

  const years = useMemo(() => {
    const yearSet = new Set<number>();
    donations.forEach((donation) => {
      yearSet.add(new Date(donation.donation_date).getFullYear());
    });
    yearSet.add(new Date().getFullYear());
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [donations]);

  // ----------------------------------------------------
  // RENDER APP
  // ----------------------------------------------------
  return (
    <div className="app-container">
      {/* 1. Top Navbar */}
      <Navbar
        isAdmin={isAdmin}
        loggedInAdmin={loggedInAdmin}
        onOpenLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onOpenDonate={() => setShowDonateModal(true)}
      />

      {/* 2. Mini Statistics Header */}
      <MiniStats
        totalDonations={totalDonations}
        totalExpenses={totalExpenses}
        currentBalance={currentBalance}
      />

      {/* 3. Login Modal */}
      <LoginModal
        isOpen={showLogin && !isAdmin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        onClose={() => setShowLogin(false)}
      />

      {/* 4. Donate Modal (UPI Apps, QR Code, Gallery Save) */}
      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        onSuccess={() => {
          if (isAdmin) {
            setActiveTab('transactions');
          } else {
            setActiveTab('donations');
          }
        }}
        onDirectSubmit={handleOnlineDonationSubmit}
      />

      {/* 5. Hero Banner & Navigation Tabs */}
      <HeroSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        pendingTransactionsCount={pendingTransactionsCount}
        onOpenDonate={() => setShowDonateModal(true)}
        quote={QUOTES[quoteIndex]}
      />

      {/* 6. Active Screen Content */}
      {activeTab !== 'dashboard' && (
        <main className="main-content glass">
          {activeTab === 'donations' && (
            <DonorsSection
              isAdmin={isAdmin}
              loggedInAdmin={loggedInAdmin}
              donations={filteredDonations}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              years={years}
              pendingTransactionsCount={pendingTransactionsCount}
              onNavigateToTransactions={() => setActiveTab('transactions')}
              onOpenDonate={() => setShowDonateModal(true)}
              dName={dName}
              setDName={setDName}
              dAmount={dAmount}
              setDAmount={setDAmount}
              dComments={dComments}
              setDComments={setDComments}
              dDate={dDate}
              setDDate={setDDate}
              onAddDonation={handleAddDonation}
              editingDonationId={editingDonationId}
              setEditingDonationId={setEditingDonationId}
              editingDonationAmount={editingDonationAmount}
              setEditingDonationAmount={setEditingDonationAmount}
              onUpdateDonationAmount={handleUpdateDonationAmount}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesSection
              isAdmin={isAdmin}
              loggedInAdmin={loggedInAdmin}
              expenses={expenses}
              eAmount={eAmount}
              setEAmount={setEAmount}
              eReason={eReason}
              setEReason={setEReason}
              eDate={eDate}
              setEDate={setEDate}
              onAddExpense={handleAddExpense}
              editingExpenseId={editingExpenseId}
              setEditingExpenseId={setEditingExpenseId}
              editingExpenseAmount={editingExpenseAmount}
              setEditingExpenseAmount={setEditingExpenseAmount}
              onUpdateExpenseAmount={handleUpdateExpenseAmount}
            />
          )}

          {isAdmin && activeTab === 'transactions' && (
            <TransactionsSection
              allTransactions={allTransactions}
              filteredTransactions={filteredTransactions}
              transactionFilter={transactionFilter}
              setTransactionFilter={setTransactionFilter}
              transactionSearch={transactionSearch}
              setTransactionSearch={setTransactionSearch}
              totalVerifiedOnlineAmount={totalVerifiedOnlineAmount}
              approvedTransactionsCount={approvedTransactionsCount}
              pendingTransactionsCount={pendingTransactionsCount}
              rejectedTransactionsCount={rejectedTransactionsCount}
              onOpenDonate={() => setShowDonateModal(true)}
              onApproveTransaction={handleApproveTransaction}
              onRejectTransaction={handleRejectTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
        </main>
      )}

      {/* 7. Responsive Footer */}
      <Footer />
    </div>
  );
}
