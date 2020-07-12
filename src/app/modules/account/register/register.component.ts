import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { OAuthResponse, RegistrationResponse } from '../models/account';
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
  public loading = false;
  public invalidLogin = false;
  public invalidPassword = false;
  public errorLogin = '';
  public errorPassword = '';
  public registrationEmail = '';
  private regSub: SubscriptionLike;
  private regYandexSub: SubscriptionLike;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.autoRegister = this.route.snapshot.queryParams['registrationtype'] === 'autoreg';
    this.registrationEmail = this.route.snapshot.queryParams['registrationemail'];
  }

  ngOnInit(): void {
    this.autoRegFocus();
  }

  public reg(form: NgForm) {
    this.invalidLogin = false;
    this.invalidPassword = false;
    this.errorLogin = '';
    this.errorPassword = '';
    this.loading = true;
    this.regSub = this.accountService.handleRegistration(form.value).subscribe((response: RegistrationResponse) => {
      this.loading = false;
      for (let i = 0; i < response.rows.length; i++) {
        if (response.rows[i].code === 400) {
          if (response.rows[i].context === 'login') {
            this.invalidLogin = true;
            this.errorLogin = response.rows[i].message;
          } else {
            this.invalidPassword = true;
            this.errorPassword = response.rows[i].message;
          }
        } else if (response.rows[i].code === 201) {
          this.loginForm.nativeElement.submit();
        }
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

  private autoRegFocus() {
    if (!this.autoRegister && this.registrationEmail) {
      this.password.nativeElement.focus();
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
