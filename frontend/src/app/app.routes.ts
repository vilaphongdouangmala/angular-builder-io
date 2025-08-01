import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'master-data',
        loadComponent: () => import('./features/master-data/master-data.component').then(m => m.MasterDataComponent)
      },
      {
        path: 'customer',
        loadComponent: () => import('./features/customer/customer.component').then(m => m.CustomerComponent)
      },
      {
        path: 'customer/create',
        loadComponent: () => import('./features/customer/customer-create/customer-create.component').then(m => m.CustomerCreateComponent)
      },
      {
        path: '',
        redirectTo: '/customer',
        pathMatch: 'full'
      }
    ]
  }
];
