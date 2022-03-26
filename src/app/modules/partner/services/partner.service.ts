import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/api';
import { Wallet } from '../../../core/models/user';
import {
  IncomeBalance,
  IncomeBalanceResponse,
  Registrations,
  RegistrationsResponse,
  Transaction,
  TransactionsResponse,
  UserEmail
} from '../../../core/models/partner';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { UserApiService } from '../../user/services/user-api.service';
import { PartnerApiService } from './partner-api.service';


@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private userApiService: UserApiService,
    private partnerApiService: PartnerApiService
  ) {
  }

  public getTransactions(filterParams): Observable<Transaction[]> {
    return this.partnerApiService.getTransactions(filterParams).pipe(
      map((response: TransactionsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getEarnedMoney(): Observable<IncomeBalance> {
    return this.partnerApiService.getEarnedMoney().pipe(
      map((response: IncomeBalanceResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getPartnerBalance(): Observable<IncomeBalance> {
    return this.partnerApiService.getPartnerBalance().pipe(
      map((response: IncomeBalanceResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getRegistrations(): Observable<Registrations> {
    return this.partnerApiService.getRegistrations().pipe(
      map((response: RegistrationsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public addNewRef(userEmail: string): Observable<string> {
    const email: UserEmail = { email: userEmail };
    return this.partnerApiService.addNewRef(email).pipe(
      map((response: ApiResponse) => response.message),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public setWallet(walletValue: string): Observable<boolean> {
    const wallet: Wallet = { value: walletValue };
    return this.userApiService.setWallet(wallet).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

}
