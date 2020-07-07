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
