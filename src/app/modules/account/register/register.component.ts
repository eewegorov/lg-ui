import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OAuthResponse, RegistrationResponse } from '../models/account';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/shared.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('password') private password: ElementRef;
  @ViewChild('f') private regForm: NgForm;
  @ViewChild('loginForm') private loginForm: ElementRef;
  public loading = false;
  public invalidLogin = false;
  public invalidPassword = false;
  public errorLogin = '';
  public errorPassword = '';

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  public reg(form: NgForm) {
    this.invalidLogin = false;
    this.invalidPassword = false;
    this.errorLogin = '';
    this.errorPassword = '';
    this.loading = true;
    this.accountService.handleRegistration(form.value).subscribe((response: RegistrationResponse) => {
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
    this.accountService.handleYandex(event, 'REG').subscribe((response: OAuthResponse) => {
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

}
