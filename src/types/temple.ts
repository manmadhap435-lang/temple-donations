export interface Donation {
  id: string;
  name: string;
  amount: number | null;
  comments: string;
  donation_date: string;
  is_edited?: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  reason: string;
  expense_date: string;
  is_edited?: boolean;
}

export interface TempleTransaction {
  id: string;
  name: string;
  amount: number | null;
  utr_number: string;
  comments: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  transaction_date: string;
  created_at?: string;
  source?: 'transactions_table' | 'legacy_donations' | 'rejected_table';
}

export type TabType = 'dashboard' | 'donations' | 'expenses' | 'transactions';
export type TransactionFilterType = 'all' | 'pending' | 'approved' | 'rejected';
