import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'token',
    loadComponent: () => import('./pages/token/token.component').then(m => m.TokenComponent)
  },
  {
    path: 'jars',
    loadComponent: () => import('./pages/jars/jars.component').then(m => m.JarsComponent)
  },
  {
    path: 'jars/:jarId',
    loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: '**',
    redirectTo: 'token'
  }
];
