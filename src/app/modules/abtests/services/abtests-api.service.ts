import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbtestsResponse } from '../models/abtests';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AbtestsApiService {

  constructor(private http: HttpClient) { }

  public getTests(): Observable<AbtestsResponse> {
    return this.http.get<AbtestsResponse>(`${ environment.url }/abtests`);
  }
}
