import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { map, Observable, scan, shareReplay, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../../models/transaction';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TransactionComponent } from '../../components/transaction/transaction.component';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, ScrollingModule, TransactionComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
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
    shareReplay({bufferSize: 1, refCount: true})
  );
}
