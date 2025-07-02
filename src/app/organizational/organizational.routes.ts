import { Routes } from '@angular/router';

// Importaciones estáticas de los componentes

import { SeeUsersComponent } from './pages/see-users/see-users.component';

import { CreateOrEditUsersComponent } from './pages/create-or-edit-users/create-or-edit-users.component';

export const organizationalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'users',
        children: [
          {
            path: 'create',
            component: CreateOrEditUsersComponent // Carga estática
          },
          {
            path: 'list',
            component: SeeUsersComponent // Carga estática
          },
          {
            path: ':id/edit',
            component: CreateOrEditUsersComponent // Carga estática
          }
        ]
      }
    ]
  }
];
