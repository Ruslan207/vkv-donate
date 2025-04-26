import { TransactionStatus } from '../server/models/transaction-status';

export interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  jarId: string;
  sender: string;
  comment: string;
  status: TransactionStatus;
}
