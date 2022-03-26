import { Injectable } from '@angular/core';
import { Site, SiteShort } from '../models/sites';

@Injectable({
  providedIn: 'root'
})
export class CoreSitesService {
  public sites: Site[] | SiteShort[] = [];

  constructor() {
  }

  public getSiteById(siteId) {
    for (const item of this.sites) {
      if (item.id === siteId) {
        return item;
      }
    }

    return null;
  }
}
