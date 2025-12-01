import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { map, scan, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionStatus } from 'models';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModelUpdatedEvent } from 'ag-grid-community';
import { AG_GRID_LOCALE_UA } from '@ag-grid-community/locale';
import { format } from 'date-fns';
import { TransactionStatusComponent } from '../../components/transaction-status/transaction-status.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnDestroy {
  private activeRoute = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  transactions = signal<Transaction[]>([]);
  rowsCount = signal<number>(0);

  readonly agGridLocale = AG_GRID_LOCALE_UA;
  readonly defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    filterParams: {
      buttons: ['reset'],
    },
  };
  readonly colDefs: ColDef<Transaction>[] = [
    {
      field: 'timestamp',
      headerName: 'Час',
      filter: 'agDateColumnFilter',
      filterParams: {
        includeTime: true,
      },
      valueGetter: ({ data: transaction }) =>
        transaction?.timestamp ? new Date(transaction.timestamp * 1000) : null,
      valueFormatter: ({ value }) =>
        value ? format(value, 'dd.MM.yyyy HH:mm:ss') : '–',
    },
    {
      field: 'amount',
      headerName: 'Сума',
      filter: 'agNumberColumnFilter',
      valueGetter: ({ data: transaction }) => (transaction?.amount ?? 0) / 100,
    },
    { field: 'sender', headerName: 'Відправник', filter: 'agTextColumnFilter' },
    {
      field: 'comment',
      headerName: 'Коментар',
      filter: 'agTextColumnFilter',
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'status',
      headerName: '',
      sortable: false,
      cellRenderer: TransactionStatusComponent,
      cellRendererParams: {
        statusChangeHandler: this.statusChangeHandler.bind(this),
      },
      filter: 'agNumberColumnFilter',
      filterParams: {
        filterOptions: [
          'empty',
          {
            displayKey: 'starsOnly',
            displayName: 'Лише з зірочкою',
            predicate: (_: unknown, cellValue: number) =>
              cellValue === TransactionStatus.Marked,
            numberOfInputs: 0,
          },
          {
            displayKey: 'hiddenOnly',
            displayName: 'Лише приховані',
            predicate: (_: unknown, cellValue: number) =>
              cellValue === TransactionStatus.Hidden,
            numberOfInputs: 0,
          },
          {
            displayKey: 'unhidden',
            displayName: 'Не приховані',
            predicate: (_: unknown, cellValue: number) =>
              cellValue !== TransactionStatus.Hidden,
            numberOfInputs: 0,
          },
        ],
      },
    },
  ];

  constructor() {
    this.activeRoute.params
      .pipe(
        map((params) => params['jarId'] as string),
        switchMap((jarId) => this.apiService.subscribeOnJar(jarId)),
        scan((acc, value) => {
          switch (value.type) {
            case 'initial':
              return value.data;
            case 'update':
              return [...acc, value.data];
          }
        }, [] as Transaction[]),
        takeUntilDestroyed()
      )
      .subscribe((transactions) => this.transactions.set(transactions));
  }

  ngOnDestroy(): void {
    this.apiService.unsubscribeFromJar();
  }

  statusChangeHandler(
    transactionId: string | undefined,
    status: TransactionStatus | undefined
  ): void {
    if (!transactionId) {
      console.error('Transaction id is not defined');
      return;
    }
    this.apiService
      .setTransactionStatus(transactionId, status ?? TransactionStatus.Default)
      .then(() => {
        this.transactions.update((transactions) =>
          transactions.map((transaction) =>
            transaction.monoId === transactionId
              ? {
                  ...transaction,
                  status: status ?? TransactionStatus.Default,
                }
              : transaction
          )
        );
        this.snackBar.open('Збережено', undefined, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
        });
      });
  }

  onModelUpdated(event: ModelUpdatedEvent<Transaction>): void {
    const rows = event.api.getRenderedNodes().length ?? 0;
    this.rowsCount.set(rows);
  }
}
