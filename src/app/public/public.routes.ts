import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const publicRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  }
];
