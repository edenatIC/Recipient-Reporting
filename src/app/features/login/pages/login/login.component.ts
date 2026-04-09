import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { LoginResult, UserRole } from '../../../../core/auth/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  loginError = signal('');

  emailTouched = signal(false);
  passwordTouched = signal(false);

  emailValid = computed(() => this.email().includes('@') && this.email().length > 0);
  passwordValid = computed(() => this.password().length > 0);

  onSignIn() {
    this.emailTouched.set(true);
    this.passwordTouched.set(true);

    if (!this.emailValid() || !this.passwordValid()) return;

    const result = this.authService.login({
      email: this.email(),
      password: this.password(),
    });

    if (result === LoginResult.Success) {
      this.loginError.set('');
      const isAdmin = this.authService.currentUser()?.role === UserRole.Admin;
      this.router.navigate([isAdmin ? '/admin/dashboard' : '/']);
    } else {
      this.loginError.set('Invalid email or password.');
    }
  }
}
