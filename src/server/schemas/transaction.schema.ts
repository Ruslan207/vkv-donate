import { Schema } from 'mongoose';

export const TransactionSchema = new Schema({
  timestamp: Number,
  jarId: String,
  sender: String,
  amount: Number,
  comment: String,
  status: Number,
});
