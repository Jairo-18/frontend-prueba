import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './default-layout/pages/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./public/public.routes').then((m) => m.publicRoutes)
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.routes').then((m) => m.authRoutes)
      },
      {
        path: 'organizational',
        loadChildren: () =>
          import('./organizational/organizational.routes').then(
            (m) => m.organizationalRoutes
          )
      }
    ]
  },

  {
    path: '**',
    redirectTo: '/home'
  }
];
