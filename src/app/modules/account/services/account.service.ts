import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OAuthData, OAuthResponse, RegistrationData } from '../models/account';
import { AccountApiService } from './account-api.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private accountApiService: AccountApiService) { }

  public handleYandex(event: Event, action: 'AUTH' | 'REG'): Observable<OAuthResponse> {
    (event.target as HTMLButtonElement).disabled = true;
    const yandexOAuthData: OAuthData = {
      service: 'YANDEX',
      action
    };
    return this.accountApiService.postOAuth(yandexOAuthData);
  }

  public handleRegistration(data: RegistrationData) {
    const formData: FormData = new FormData();
    formData.append('login', data.login);
    formData.append('password', data.password);
    return this.accountApiService.postRegistration(formData);
  }
}
