import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, SubscriptionLike } from 'rxjs';
import { OAuthResponse, RegistrationObject, RegistrationResponse } from '../../../core/models/account';
import { AccountService } from '../services/account.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/shared.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public autoRegister = false;
  public autoRegisterPanel = false;
  public autoRegisterLoadingPanel = false;
  public autoRegisterError = false;
  public loading = false;
  public invalidLogin = false;
  public invalidPassword = false;
  public errorLogin = '';
  public errorPassword = '';
  public registrationEmail = '';
  public registrationPassword = '';
  public autoRegisterErrorMessage = '';
  @ViewChild('password', { static: true }) private password: ElementRef;
  @ViewChild('f', { static: true }) private regForm: NgForm;
  @ViewChild('loginForm') private loginForm: ElementRef;
  private regSub: SubscriptionLike;
  private regYandexSub: SubscriptionLike;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.autoRegister = this.route.snapshot.queryParams.registrationtype === 'autoreg';
    this.registrationEmail = this.route.snapshot.queryParams.registrationemail;

    this.autoReg();
  }

  public reg(form: NgForm) {
    this.invalidLogin = false;
    this.invalidPassword = false;
    this.errorLogin = '';
    this.errorPassword = '';
    this.loading = true;
    this.regSub = this.accountService.handleRegistration(form.value).pipe(
      switchMap((registrationResponse: RegistrationResponse) => {
        this.loading = false;

        if (registrationResponse.success) {
          const authData = {
            username: form.value.login,
            password: form.value.password
          };
          return this.accountService.handleAuth(authData);
        } else {
          return EMPTY;
        }
      })
    ).subscribe((loginResponse: boolean) => {
      if (loginResponse) {
        this.router.navigate(['/']);
      }
    });
  }

  public regYandex(event: Event) {
    this.regYandexSub = this.accountService.handleYandex(event, 'REG').subscribe((response: OAuthResponse) => {
      if (response.code === 200) {
        window.location.href = response.data.url;
      }
    });
  }

  public togglePasswordVisibility(type: 'password' | 'text') {
    this.password.nativeElement.setAttribute('type', type);
  }

  public togglePasswordFocus(event: Event, text: '********' | '') {
    (event.target as HTMLInputElement).placeholder = text;
  }

  ngOnDestroy(): void {
    if (this.regSub) {
      this.regSub.unsubscribe();
    }
    if (this.regYandexSub) {
      this.regYandexSub.unsubscribe();
    }
  }

  private autoReg() {
    if (!this.autoRegister && this.registrationEmail) {
      this.password.nativeElement.focus();
    } else if (this.autoRegister && this.registrationEmail) {
      this.autoRegisterLoadingPanel = true;

      const regData: RegistrationObject = {
        login: this.registrationEmail
      };

      this.regSub = this.accountService.handleRegistration(regData).pipe(
        switchMap((registrationResponse: RegistrationResponse) => {
          this.loading = false;

          if (registrationResponse.success) {
            const authData = {
              username: regData.login,
              password: registrationResponse.data.password
            };
            return this.accountService.handleAuth(authData);
          } else {
            return EMPTY;
          }
        })
      ).subscribe((loginResponse: boolean) => {
        if (loginResponse) {
          this.router.navigate(['/']);
        }
      });
    }
  }

}
