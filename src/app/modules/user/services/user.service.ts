import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse } from '@core/models/api';
import { PasswordRequest, Phone, User, UserRequest, UserResponse } from '@core/models/user';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public readonly user$: Observable<User>;
  public userPhone: string;

  private readonly _user$: ReplaySubject<User>;
  private readonly _requestUser$: Subject<void>;

  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly userApiService: UserApiService
  ) {
    this._requestUser$ = new Subject<void>();
    this._user$ = new ReplaySubject<User>();
    this.user$ = this._user$.asObservable();
    this.userSub();
    this._requestUser$.next();
  }

  public getMeInfo(): void {
    this._requestUser$.next();
  }

  public updateMeInfo(user: UserRequest): Observable<boolean> {
    return this.userApiService.updateMeInfo(user).pipe(
      map((response: ApiResponse) => response.success),
      tap(() => this.getMeInfo()),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updatePassword(password: PasswordRequest): Observable<boolean> {
    return this.userApiService.updatePassword(password).pipe(
      map((response: ApiResponse) => response.success),
      tap(() => this.getMeInfo()),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public savePhone(phone: Phone): Observable<boolean> {
    return this.userApiService.savePhone(phone).pipe(
      map((response: ApiResponse) => response.success),
      tap(() => this.getMeInfo()),
      catchError(this.errorHandlerService.handleError)
    );
  }

  private userSub(): void {
    this._requestUser$
      .pipe(
        switchMap(() =>
          this.userApiService.getMeInfo().pipe(
            map((response: UserResponse) => response.data),
            catchError(this.errorHandlerService.handleError)
          )
        )
      )
      .subscribe((user: User) => this._user$.next(user));
  }
}
