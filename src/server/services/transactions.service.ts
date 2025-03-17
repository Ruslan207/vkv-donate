import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel('Transactions') private transactionModel: Model<Transaction>) {}

  getTransactions(jarId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ jarId }).exec();
  }

  addTransaction(transaction: Transaction): Promise<void> {
    return new this.transactionModel(transaction).save().then();
  }

  patchTransaction(transactionId: string, transaction: Partial<Transaction>): Promise<void> {
    return this.transactionModel.updateOne({ id: transactionId }, transaction).exec().then();
  }
}
