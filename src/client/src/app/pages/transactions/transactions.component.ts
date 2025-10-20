import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { map, Observable, scan, shareReplay, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../../models/transaction';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { TransactionStatus } from '../../../../../server/models/transaction-status';
import { AG_GRID_LOCALE_UA } from '@ag-grid-community/locale';
import { format } from 'date-fns';

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

  transactions$: Observable<Transaction[]> = this.activeRoute.params.pipe(
    map(params => params['jarId'] as string),
    switchMap(jarId => this.apiService.subscribeOnJar(jarId)),
    scan((acc, value) => {
      switch (value.type) {
        case 'initial':
          return value.data;
        case 'update':
          return [...acc, value.data];
      }
    }, [] as Transaction[]),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly agGridLocale = AG_GRID_LOCALE_UA;
  readonly defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    filterParams: {
      buttons: [
        'reset',
      ],
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
      valueGetter: ({ data: transaction }) => {
        return transaction?.timestamp ? new Date(transaction.timestamp) : null;
      },
      valueFormatter: ({ value }) => {
        return value ? format(value, 'dd.MM.yyyy HH:mm:ss') : '–';
      },
    },
    { field: 'amount', headerName: 'Сума', filter: 'agNumberColumnFilter' },
    { field: 'sender', headerName: 'Відправник', filter: 'agTextColumnFilter' },
    { field: 'comment', headerName: 'Коментар', filter: 'agTextColumnFilter' },
    {
      field: 'status', headerName: '',
      filter: 'agNumberColumnFilter',
      filterParams: {
        filterOptions: [
          'empty',
          {
            displayKey: 'starsOnly',
            displayName: 'Лише з зірочкою',
            predicate: (_: unknown, cellValue: number) => {
              console.log(cellValue);
              return cellValue === TransactionStatus.Marked;
            },
            numberOfInputs: 0,
          },
          {
            displayKey: 'hiddenOnly',
            displayName: 'Лише приховані',
            predicate: (_: unknown, cellValue: number) => cellValue === TransactionStatus.Hidden,
            numberOfInputs: 0,
          },
          {
            displayKey: 'unhidden',
            displayName: 'Не приховані',
            predicate: (_: unknown, cellValue: number) => cellValue !== TransactionStatus.Hidden,
            numberOfInputs: 0,
          },
        ],
      },
    },
  ];

  ngOnDestroy(): void {
    this.apiService.close();
  }
}
