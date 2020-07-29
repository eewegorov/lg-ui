import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Token } from '../models/token';
import { AuthRequest } from '../models/account';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient) {}

  public login(data: AuthRequest): Observable<boolean> {
    return this.http.post<Token>(`${ environment.oauthUrl }/token`,
      null, {
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + btoa('ui:ui')
        }),
        params: {
          password: data.password,
          grant_type: data.grant_type,
          username: data.username
        }
      })
      .pipe(
        tap((token: Token) => this.doLoginUser(data.username, token)),
        mapTo(true),
        catchError(error => {
          console.log(error)
          alert(error.error);
          return of(false);
        })
      );
  }

  public logout() {
    return this.http.post<any>(`${environment.oauthUrl}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  public isAuthenticated() {
    return !!this.getJwtToken();
  }

  public refreshToken() {
    return this.http.post<any>(`${environment.oauthUrl}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((token: Token) => {
      this.storeJwtToken(token.access_token);
    }));
  }

  public getJwtToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  private doLoginUser(username: string, token: Token) {
    console.log(token)
    this.loggedUser = username;
    this.storeTokens(token);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  private storeTokens(token: Token) {
    localStorage.setItem(this.ACCESS_TOKEN, token.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, token.refresh_token);
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

}
