import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public generateShortID(): string {
    return this.s4() + this.s4();
  }

  private s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
