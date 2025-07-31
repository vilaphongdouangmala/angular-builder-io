import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'master-data',
    loadComponent: () => import('./features/master-data/master-data.component').then(m => m.MasterDataComponent)
  },
  {
    path: '',
    redirectTo: '/master-data',
    pathMatch: 'full'
  }
];
