import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { OAuthResponse, RegistrationObject, RegistrationResponse } from '../../../core/models/account';
import { AccountService } from '../services/account.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/shared.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('password', { static: true }) private password: ElementRef;
  @ViewChild('f', { static: true }) private regForm: NgForm;
  @ViewChild('loginForm') private loginForm: ElementRef;
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
  private regSub: SubscriptionLike;
  private regYandexSub: SubscriptionLike;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.autoRegister = this.route.snapshot.queryParams.registrationtype === 'autoreg';
    this.registrationEmail = this.route.snapshot.queryParams.registrationemail;
  }

  ngOnInit(): void {
    this.autoReg();
  }

  public reg(form: NgForm) {
    this.invalidLogin = false;
    this.invalidPassword = false;
    this.errorLogin = '';
    this.errorPassword = '';
    this.loading = true;
    this.regSub = this.accountService.handleRegistration(form.value).subscribe((response: RegistrationResponse) => {
      this.loading = false;

      if (response['success']) {
        const authData = {
          username: form.value.login,
          password: form.value.password
        };
        this.accountService.handleAuth(authData).subscribe((loginResponse: boolean) => {
          if (loginResponse) {
            this.router.navigate([ '/' ]);
          }
        });
      }
      /*response.rows.forEach(item => {
        if (item.code === 400) {
          if (item.context === 'login') {
            this.invalidLogin = true;
            this.errorLogin = item.message;
          } else {
            this.invalidPassword = true;
            this.errorPassword = item.message;
          }
        } else if (item.code === 201) {
          this.loginForm.nativeElement.submit();
        }
      });*/
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

  private autoReg() {
    if (!this.autoRegister && this.registrationEmail) {
      this.password.nativeElement.focus();
    } else if (this.autoRegister && this.registrationEmail) {
      this.autoRegisterLoadingPanel = true;
      setTimeout(() => {
        this.regSub = this.accountService.handleRegistration(this.regForm.value).subscribe((response: RegistrationResponse) => {
          let newUserName: string;
          let newUserPwd: string;
          this.autoRegisterLoadingPanel = false;
          for (const item of response.rows) {
            if (item.code === 400) {
              this.autoRegisterError = true;
              this.autoRegisterErrorMessage = item.message;
            } else if (item.code === 201) {
              if (item.message === 'created') {
                newUserName = (item.object as RegistrationObject).login ;
              }
              if (item.message === 'password') {
                newUserPwd = item.object as string;
              }
              if (newUserName && newUserPwd) {
                this.autoRegisterError = false;
                this.autoRegisterPanel = true;
                setTimeout(() => {
                  this.registrationEmail = newUserName;
                  this.registrationPassword = newUserPwd;
                  this.loginForm.nativeElement.submit();
                }, 2000);
              }
            }
          }
        });
      }, 50);
    }
  }

  ngOnDestroy(): void {
    if (this.regSub) {
      this.regSub.unsubscribe();
    }
    if (this.regYandexSub) {
      this.regYandexSub.unsubscribe();
    }
  }

}
