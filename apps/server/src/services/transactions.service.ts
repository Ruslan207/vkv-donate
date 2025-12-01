import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'models';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transactions') private transactionModel: Model<Transaction>
  ) {}

  getTransactions(jarId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ jarId }).exec();
  }

  addTransaction(transaction: Transaction): Promise<void> {
    return this.transactionModel
      .findOneAndUpdate({ monoId: transaction.monoId }, transaction, {
        upsert: true,
      })
      .exec()
      .then();
  }

  patchTransaction(
    transactionId: string,
    transaction: Partial<Transaction>
  ): Promise<void> {
    return this.transactionModel
      .updateOne({ monoId: transactionId }, transaction)
      .exec()
      .then();
  }
}
