import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProjectsComponent } from './pages/admin-projects/admin-projects.component';
import { AdminProjectDetailComponent } from './pages/admin-project-detail/admin-project-detail.component';

export const adminRoutes: Routes = [
  { path: 'dashboard',       component: AdminDashboardComponent },
  { path: 'projects',        component: AdminProjectsComponent },
  { path: 'projects/:id',    component: AdminProjectDetailComponent },
  { path: '',                redirectTo: 'dashboard', pathMatch: 'full' },
];
