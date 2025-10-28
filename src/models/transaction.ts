import { TransactionStatus } from '../server/models/transaction-status';

export interface Transaction {
  monoId: string;
  timestamp: number;
  amount: number;
  jarId: string;
  sender: string;
  comment: string;
  status: TransactionStatus;
}
