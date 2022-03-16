import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Token } from '../models/token';
import { ApiResponse } from '../models/api';
import { AuthRequest } from '../models/account';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedUser: string;
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  public login(data: AuthRequest): Observable<boolean> {
    return this.http.post<Token>(`${ environment.oauth }/token`,
      null, {
        headers: new HttpHeaders({
          Authorization: `Basic ${btoa('ui:ui')}`
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
          console.log(error);
          return of(false);
        })
      );
  }

  public logout() {
    this.doLogoutUser();

    return this.http.post<ApiResponse>(`${environment.prov}/auth/logout`, null).pipe(
      mapTo(true),
      catchError(error => {
        console.log(error);
        return of(false);
      }));
  }

  public isAuthenticated() {
    return !!this.getJwtToken();
  }

  public refreshToken() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    return this.http.post<any>(`${ environment.oauth }/token`, null, {
      headers: new HttpHeaders({
        Authorization: `Basic ${btoa('ui:ui')}`
      }),
      params: {
        grant_type: 'refresh_token',
        refresh_token: this.getRefreshToken()
      }
    }).pipe(
      tap((token: Token) => {
        this.storeJwtToken(token.access_token);
      }),
      catchError((err) => {
        console.log(err);
        this.router.navigate(['/logout']);
        return of(false);
      })
    );
  }

  public getJwtToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  private doLoginUser(username: string, token: Token) {
    this.loggedUser = username;
    this.storeTokens(token);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
    this.router.navigate(['/logout']);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  private storeTokens(token: Token) {
    if (token?.access_token) {
      localStorage.setItem(this.ACCESS_TOKEN, token.access_token);
    }
    if (token?.refresh_token) {
      localStorage.setItem(this.REFRESH_TOKEN, token.refresh_token);
    }
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

}
