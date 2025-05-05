export interface Transaction {
  _id: string;
  type: string;
  amount: number;
  from: string;
  to: string;
  createdAt: string;
  updatedAt: string;
  _v: number;
}

export interface TransactionRequest {
  amount: number;
}

/**
 * Optional filters when fetching transactions.
 */
export interface TransactionQuery {
  /** 'deposit' | 'withdraw' | 'transfer' or undefined for all */
  type?: string;
  /** ISO date string, e.g. '2025-05-01' */
  dateFrom?: string;
  /** ISO date string, e.g. '2025-05-10' */
  dateTo?: string;
}
