import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LeadsResponse } from '../../../core/models/crm';


@Injectable({
  providedIn: 'root'
})
export class CrmApiService {

  constructor(private http: HttpClient) { }

  public getLeadList(filterParams): Observable<LeadsResponse> {
    return this.http.get<LeadsResponse>(`${ environment.url }/leads`, {
      params: filterParams
    });
  }
}
