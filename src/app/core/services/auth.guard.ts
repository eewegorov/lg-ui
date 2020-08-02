import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canLoad();
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    /*if (!this.authService.isAuthenticated()) {
      this.router.navigate([ '/account/login' ]);
    }
    return this.authService.isAuthenticated();*/
    return true;
  }
}
