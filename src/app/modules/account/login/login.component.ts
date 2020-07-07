import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountApiService } from '../services/account-api.service';
import { OAuthData, OAuthResponse } from '../models/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/shared.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('ichecks', { static: true }) private ichecks: ElementRef;
  @ViewChild('yandex', { static: true }) private yandex: ElementRef;
  public loginForm: FormGroup;
  public error: string;

  constructor(private accountApiService: AccountApiService) { }

  ngOnInit(): void {
    this.initIchecks();
    this.resetForm();
  }

  private resetForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [ Validators.required, Validators.minLength(2) ]),
      password: new FormControl('', [ Validators.required, Validators.minLength(6) ])
    });
  }

  private initIchecks() {
    ($(this.ichecks.nativeElement) as any).iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });
  }

  public authYandex(event: Event) {
    (event.target as HTMLButtonElement).disabled = true;
    const yandexOAuthData: OAuthData = {
      service: 'YANDEX',
      action: 'AUTH'
    };
    this.accountApiService.postOAuth(yandexOAuthData).subscribe((response: OAuthResponse) => {
      (event.target as HTMLButtonElement).disabled = false;
      if (response.code === 200) {
        window.location.href = response.data.url;
      }
    });
  }

}
