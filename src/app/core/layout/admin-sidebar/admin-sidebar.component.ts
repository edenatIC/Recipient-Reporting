import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Home, FolderOpen, HelpCircle, LogOut } from 'lucide-angular';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly Home = Home;
  readonly FolderOpen = FolderOpen;
  readonly HelpCircle = HelpCircle;
  readonly LogOut = LogOut;

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
