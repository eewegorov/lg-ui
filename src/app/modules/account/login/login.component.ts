import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { OAuthResponse } from '../models/account';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/shared.scss', './login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('ichecks', { static: true }) private ichecks: ElementRef;
  public error: boolean;
  private authSub: SubscriptionLike;

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
    this.authSub = this.accountService.handleYandex(event, 'AUTH').subscribe((response: OAuthResponse) => {
      (event.target as HTMLButtonElement).disabled = false;
      if (response.code === 200) {
        window.location.href = response.data.url;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}
