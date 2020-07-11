import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OAuthResponse } from '../models/account';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/shared.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('password') private password: ElementRef;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  public regYandex(event: Event) {
    this.accountService.handleYandex(event, 'REG').subscribe((response: OAuthResponse) => {
      if (response.code === 200) {
        window.location.href = response.data.url;
      }
    });
  }

  public togglePassword(type: 'password' | 'text') {
    this.password.nativeElement.setAttribute('type', type);
  }

}
