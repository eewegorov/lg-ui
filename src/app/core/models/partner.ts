import { ApiLimitResponse, ApiResponse } from './api';

export interface TransactionsResponse extends ApiLimitResponse {
  data: Transaction[];
}

export interface Transaction {
  date: number;
  sum: number;
  type: 'CREDIT' | 'DEBIT';
}

export interface IncomeBalanceResponse extends ApiResponse {
  data: IncomeBalance;
}

export interface IncomeBalance {
  sum: number;
}

export interface RegistrationsResponse extends ApiResponse {
  data: Registrations;
}

export interface Registrations {
  count: number;
}

export interface UserEmail {
  email: string;
}
