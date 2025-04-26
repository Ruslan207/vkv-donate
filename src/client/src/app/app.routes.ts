import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'token',
    loadComponent: () => import('./pages/token/token.component').then(m => m.TokenComponent)
  },
  {
    path: '**',
    redirectTo: 'token'
  }
];
