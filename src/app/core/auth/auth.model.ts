export enum UserRole {
  Recipient = 'recipient',
  Admin = 'admin',
}

export enum AuthStatus {
  Unauthenticated = 'unauthenticated',
  Authenticated = 'authenticated',
}

export enum LoginResult {
  Success = 'success',
  InvalidCredentials = 'invalid_credentials',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export enum AppRoute {
  Login = 'login',
  Home = '',
  RecipientDashboard = 'dashboard',
}
