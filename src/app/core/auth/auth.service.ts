import { Injectable, computed, signal } from '@angular/core';
import { AuthStatus, LoginCredentials, LoginResult, UserRole } from './auth.model';
import { mockUsers, User } from './auth.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authStatus = signal(AuthStatus.Unauthenticated);
  currentUser = signal<User | null>(null);

  isAuthenticated = computed(() => this.authStatus() === AuthStatus.Authenticated);

  userFullName = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  });

  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  });

  isAdmin = computed(() => this.currentUser()?.role === UserRole.Admin);
  isRecipient = computed(() => this.currentUser()?.role === UserRole.Recipient);

  login(credentials: LoginCredentials): LoginResult {
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password,
    );

    if (!user) {
      return LoginResult.InvalidCredentials;
    }

    this.currentUser.set(user);
    this.authStatus.set(AuthStatus.Authenticated);
    return LoginResult.Success;
  }

  logout(): void {
    this.authStatus.set(AuthStatus.Unauthenticated);
    this.currentUser.set(null);
  }
}
