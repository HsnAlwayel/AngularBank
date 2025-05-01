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
