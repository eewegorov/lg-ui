export interface OAuthData {
  service: string;
  action: string;
}

export interface OAuthUrlData {
  url: string;
}

export interface OAuthResponse {
  code: number;
  success: boolean;
  data: OAuthUrlData;
}

export interface RegistrationData {
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
  object: string;
}
