import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthRequest, AuthResponse,
  OAuthRequest,
  OAuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  ResetData
} from '../../../core/models/account';
import { AccountApiService } from './account-api.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private accountApiService: AccountApiService) { }

  public handleYandex(event: Event, action: 'AUTH' | 'REG'): Observable<OAuthResponse> {
    (event.target as HTMLButtonElement).disabled = true;
    const yandexOAuthData: OAuthRequest = {
      service: 'YANDEX',
      action
    };
    return this.accountApiService.postOAuth(yandexOAuthData);
  }

  public handleAuth(data: AuthRequest): Observable<AuthResponse> {
    const preparedData = {
      ...data,
      grant_type: 'password'
    };
    return this.accountApiService.postAuth(preparedData);
  }

  public handleRegistration(data: RegistrationRequest): Observable<RegistrationResponse> {
    const formData: FormData = new FormData();
    formData.append('login', data.login);
    if (data.password) {
      formData.append('password', data.password);
    }
    return this.accountApiService.postRegistration(formData);
  }

  public handleReset(data: ResetData): Observable<RegistrationResponse> {
    const formData: FormData = new FormData();
    formData.append('email', data.email);
    return this.accountApiService.postReset(formData);
  }
}
