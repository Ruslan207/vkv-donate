import { Transaction } from './transaction';

export type UpdateMessage = {
  type: 'initial';
  data: Transaction[];
} | {
  type: 'update';
  data: Transaction;
}
