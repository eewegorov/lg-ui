import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/api';
import {
  AuthRequest,
  OAuthRequest,
  OAuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  ResetData
} from '../../../core/models/account';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { AccountApiService } from './account-api.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private accountApiService: AccountApiService
  ) { }

  public handleYandex(event: Event, action: 'AUTH' | 'REG'): Observable<OAuthResponse> {
    (event.target as HTMLButtonElement).disabled = true;
    const yandexOAuthData: OAuthRequest = {
      service: 'YANDEX',
      action
    };
    return this.accountApiService.postOAuth(yandexOAuthData);
  }

  public handleAuth(data: AuthRequest): Observable<boolean> {
    const preparedData: AuthRequest = {
      ...data,
      grant_type: 'password'
    };
    return this.authService.login(preparedData);
  }

  public handleRegistration(data: RegistrationRequest): Observable<RegistrationResponse> {
    return this.accountApiService.postRegistration(data);
  }

  public handleReset(data: ResetData): Observable<boolean> {
    return this.accountApiService.postReset(data).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
