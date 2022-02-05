import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['../shared/shared.scss', './password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit, OnDestroy {
  @ViewChild('f') private regForm: NgForm;
  public loading = false;
  public resetDone = false;
  public invalidLogin = false;
  private resetSub: SubscriptionLike;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  public requestReset(form: NgForm) {
    this.loading = true;
    this.resetDone = false;
    this.invalidLogin = false;
    this.resetSub = this.accountService.requestReset(form.value).subscribe((response: boolean) => {
      this.loading = false;

      if (response) {
        this.resetDone = true;
      } else {
        this.invalidLogin = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resetSub) {
      this.resetSub.unsubscribe();
    }
  }

}
