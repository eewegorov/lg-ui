import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OAuthResponse } from '../models/account';
import { AccountService } from '../services/account.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/shared.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('ichecks', { static: true }) private ichecks: ElementRef;
  public error: boolean;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.error = this.route.snapshot.queryParams['error'] === '';
  }

  ngOnInit(): void {
    this.initIchecks();
  }

  private initIchecks() {
    ($(this.ichecks.nativeElement) as any).iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });
  }

  public authYandex(event: Event) {
    this.accountService.handleYandex(event, 'AUTH').subscribe((response: OAuthResponse) => {
      (event.target as HTMLButtonElement).disabled = false;
      if (response.code === 200) {
        window.location.href = response.data.url;
      }
    });
  }

}
