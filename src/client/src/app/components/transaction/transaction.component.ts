import { Component, input } from '@angular/core';
import { Transaction } from '../../../../../models/transaction';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction',
  imports: [
    DatePipe
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent {
  transaction = input.required<Transaction>();
}
