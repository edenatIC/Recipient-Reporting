import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';
import { AdminShellComponent } from './core/layout/admin-shell/admin-shell.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.routes').then(m => m.loginRoutes),
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/recipient/recipient.routes').then(m => m.recipientRoutes),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
