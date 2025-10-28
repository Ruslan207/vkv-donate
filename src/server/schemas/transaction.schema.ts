import { Schema } from 'mongoose';
import { Transaction } from '../../models/transaction';

export const TransactionSchema = new Schema<Transaction>({
  monoId: String,
  timestamp: Number,
  jarId: String,
  sender: String,
  amount: Number,
  comment: String,
  status: Number,
});
