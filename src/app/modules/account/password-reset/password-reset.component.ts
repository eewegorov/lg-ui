import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['../shared/shared.scss', './password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  public isReset: boolean;

  private resetSub: SubscriptionLike;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    const code = this.route.snapshot.queryParams.code;

    this.resetSub = this.accountService.confirmReset(code).subscribe((response: boolean) => {
      this.isReset = response;
    });
  }

  ngOnDestroy(): void {
    if (this.resetSub) {
      this.resetSub.unsubscribe();
    }
  }

}
