import { Injectable } from '@angular/core';
import { SitesApiService } from './sites-api.service';
import { Observable } from 'rxjs';
import { Site, SitesResponse } from '../models/sites';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  constructor(private sitesApiService: SitesApiService) { }

  public getSites(): Observable<Site[]> {
    return this.sitesApiService.getRawSites().pipe(
      map((response: SitesResponse) => response.data)
    );
  }
}
