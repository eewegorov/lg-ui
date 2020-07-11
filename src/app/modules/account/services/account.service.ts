import { Injectable } from '@angular/core';
import { OAuthData } from '../models/account';
import { AccountApiService } from './account-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private accountApiService: AccountApiService) { }

  public handleYandex(event: Event, action: 'AUTH' | 'REG') {
    (event.target as HTMLButtonElement).disabled = true;
    const yandexOAuthData: OAuthData = {
      service: 'YANDEX',
      action
    };
    return this.accountApiService.postOAuth(yandexOAuthData);
  }
}
