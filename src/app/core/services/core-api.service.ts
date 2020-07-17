import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TariffPlansResponse } from '../models/tariffPlans';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {

  constructor(private http: HttpClient) { }

  public getTariffPlans(): Observable<TariffPlansResponse> {
    return this.http.get<TariffPlansResponse>(`${ environment.url }/plans`);
  }
}
