import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmailsStatisticsResponse } from '../../../core/models/emails';


@Injectable({
  providedIn: 'root'
})
export class EmailsApiService {

  constructor(private http: HttpClient) { }

  public getEmailStatistic(filterParams): Observable<EmailsStatisticsResponse> {
    return this.http.get<EmailsStatisticsResponse>(`${ environment.url }/emails/statistics`, {
      params: filterParams
    });
  }
}
