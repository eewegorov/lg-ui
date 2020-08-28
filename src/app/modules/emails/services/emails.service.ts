import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Email, EmailsResponse, EmailsStatistics, EmailsStatisticsResponse } from '../../../core/models/emails';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { EmailsApiService } from './emails-api.service';


@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private emailsApiService: EmailsApiService
  ) { }

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
}
