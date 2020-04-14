import { Injectable } from '@angular/core';
import { AccountAccessData } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login: string = '123456';
  private password: string = '123456';

  constructor() { }

  public isAuthenticated() {
    const login = '123456';
    const password = '123456';
    return this.login === login && this.password === password;
  }

  public setAccountData(accessData: AccountAccessData) {
    this.login = accessData.login;
    this.password = accessData.password;
  }

}
