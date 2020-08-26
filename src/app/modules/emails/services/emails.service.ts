import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EmailsStatistics, EmailsStatisticsResponse } from '../../../core/models/emails';
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

  public getEmailStatistic(filterParams): Observable<EmailsStatistics[]> {
    return this.emailsApiService.getEmailStatistic(filterParams).pipe(
      map((response: EmailsStatisticsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
