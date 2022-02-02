import { ApiResponse } from './api';

export interface UserResponse extends ApiResponse {
  data: User;
}

export interface UserRequest {
  phone: string;
  email: string;
  timeZone: string;
  notificated: boolean;
  needStatsNotifications: boolean;
}

export interface User extends UserRequest {
  login: string;
  id: string;
  wallet: string;
  roles: UserRole[];
}

export enum UserRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_TESTER = 'ROLE_TESTER',
  ROLE_DESIGNER = 'ROLE_DESIGNER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface Phone {
  phone: string;
}

export interface Wallet {
  value: string;
}

export interface PasswordRequest {
  oldPassword: string;
  newPassword: string;
}
