import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private currentCompanies;

  constructor() { }

  public getDefaultCompany(companies) {
    const currentC = companies || this.currentCompanies;
    return currentC.find(function(item) {
      return item.default;
    });
  }
}
