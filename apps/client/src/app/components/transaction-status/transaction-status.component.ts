import { Component, signal } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Transaction, TransactionStatus } from 'models';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-transaction-status',
  templateUrl: './transaction-status.component.html',
  styleUrl: './transaction-status.component.scss',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    FormsModule,
    MatTooltip,
  ],
})
export class TransactionStatusComponent implements ICellRendererAngularComp {
  status = signal<TransactionStatus | undefined>(undefined);
  transactionId = signal<string | undefined>(undefined);
  statusChangeHandler: (
    transactionId: string | undefined,
    status: TransactionStatus | undefined
  ) => void = () => {};

  readonly TransactionStatus = TransactionStatus;

  agInit(params: ICellRendererParams<Transaction, TransactionStatus>): void {
    this.refresh(params);
  }

  refresh(
    params: ICellRendererParams<Transaction, TransactionStatus>
  ): boolean {
    this.status.set(params.value ?? undefined);
    this.transactionId.set(params.data?.monoId);
    this.statusChangeHandler =
      params.colDef?.cellRendererParams.statusChangeHandler ?? (() => {});
    return false;
  }
}
