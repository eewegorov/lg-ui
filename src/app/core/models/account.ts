import { ApiResponse } from './api';

export interface AuthRequest {
  username: string;
  password: string;
  grant_type: string;
}

export interface AuthResponse extends ApiResponse {
  data: AuthData;
}

export interface AuthData {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface OAuthRequest {
  service: string;
  action: string;
}

export interface OAuthData {
  url: string;
}

export interface OAuthResponse extends ApiResponse {
  data: OAuthData;
}

export interface RegistrationRequest {
  login: string;
  password: string;
}

export interface RegistrationResponse {
  rows: [ RegistrationResponseRow ];
}

export interface RegistrationResponseRow {
  code: number;
  context: string;
  message: string;
  object: RegistrationObject | string;
}

export interface RegistrationObject {
  login: string;
}

export interface ResetData {
  email: string;
}
