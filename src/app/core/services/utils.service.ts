import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private md5Cache = {};
  private gravatarUrl404 = [];

  constructor(private http: HttpClient) { }

  public useGravatarIfExists(email) {
    return email ? this.getAvatarInfoPromise(this.buildGravatarUrl(email)) : EMPTY;
  }

  public generateShortID(): string {
    return this.s4() + this.s4();
  }

  private s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  private getAvatarInfoPromise(url) {
    if (this.gravatarUrl404.indexOf(url) === -1) {
      return this.http.get(url).pipe(
        map((response: { entry: string }) => response?.entry ? response.entry : url),
        catchError(() => {
          this.gravatarUrl404.push(url);
          return throwError('HTTP Error');
        })
      );
    }
    return EMPTY;
  }

  private buildGravatarUrl(email) {
    if (!email) { return; }
    const gravatarAvatarUrl = 'https://www.gravatar.com/avatar/';
    const url = gravatarAvatarUrl + this.getEmailHash(email) + '?s=256&d=mm';
    return url;
  }

  private getEmailHash(email) {
    let emailHash;
    // check if md5 for passed email is already calculated
    if (this.md5Cache.hasOwnProperty(email)) {
      emailHash = this.md5Cache[email];
    } else {
      // if not, calculate md5 and put in cache
      emailHash = Md5.hashStr(email);
      this.md5Cache[email] = emailHash;
    }
    return emailHash;
  }

}
