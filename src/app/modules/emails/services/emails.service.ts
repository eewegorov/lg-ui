import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClearEmailsRequest, Email, EmailsResponse, EmailsStatistics, EmailsStatisticsResponse } from '../../../core/models/emails';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { EmailsApiService } from './emails-api.service';
import { ApiResponse } from '../../../core/models/api';


@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private emailsApiService: EmailsApiService
  ) {
  }

  public getEmailList(filterParams): Observable<Email[]> {
    return this.emailsApiService.getEmailList(filterParams).pipe(
      map((response: EmailsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getEmailListCount(filterParams): Observable<number> {
    return this.emailsApiService.getEmailList(filterParams).pipe(
      map((response: EmailsResponse) => response.meta.count),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getEmailStatistic(filterParams): Observable<EmailsStatistics[]> {
    return this.emailsApiService.getEmailStatistic(filterParams).pipe(
      map((response: EmailsStatisticsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public downloadEmailList(filterParams): Observable<any> {
    return this.emailsApiService.downloadEmailList(filterParams).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  public clearEmail(filterParams: ClearEmailsRequest): Observable<boolean> {
    return this.emailsApiService.clearEmail(filterParams).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
