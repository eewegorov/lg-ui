import { ApiResponse } from './api';

export interface AuthRequest {
  username: string;
  password: string;
  grant_type?: string;
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
  password?: string;
}

export interface RegistrationResponse extends ApiResponse {
  data: RegistrationData;
}

export interface RegistrationData {
  id: string;
  password: string;
}

export interface RegistrationObject {
  login: string;
}

export interface ResetData {
  email: string;
}
