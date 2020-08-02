import { ApiResponse } from './api';

export interface UserResponse extends ApiResponse{
  data: User
}

export interface User {
  login: string;
  id: string;
  timeZone: string;
  phone: string;
  wallet: string;
}

export interface Phone {
  phone: string;
}

export interface Wallet {
  value: string;
}
