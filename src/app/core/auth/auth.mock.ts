import { UserRole } from './auth.model';

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export const mockUsers: User[] = [
  {
    email: 'r@email.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Smith',
    role: UserRole.Recipient,
  },
  {
    email: 'a@email.com',
    password: 'password',
    firstName: 'Project',
    lastName: 'Monitor',
    role: UserRole.Admin,
  },
];
