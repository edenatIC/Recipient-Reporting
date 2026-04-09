import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, HelpCircle, LogOut } from 'lucide-angular';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);

  readonly HelpCircle = HelpCircle;
  readonly LogOut = LogOut;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
