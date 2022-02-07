import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { OAuthResponse } from '../../../core/models/account';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/shared.scss', './login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('ichecks', { static: true }) private ichecks: ElementRef;
  public loginForm: FormGroup;
  public error: boolean;
  private authSub: SubscriptionLike;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.error = this.route.snapshot.queryParams.error === '';

    this.initIchecks();
    this.resetForm();
  }

  public submitAuth() {
    this.authSub = this.accountService.handleAuth(this.loginForm.value).subscribe((response: boolean) => {
      if (response) {
        this.router.navigate([ '/' ]);
      }
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

  private initIchecks() {
    ($(this.ichecks.nativeElement) as any).iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });
  }

  private resetForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ])
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}
