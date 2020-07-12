import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';
import { RegistrationResponse } from '../models/account';
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

  public reset(form: NgForm) {
    this.loading = true;
    this.resetDone = false;
    this.invalidLogin = false;
    this.resetSub = this.accountService.handleReset(form.value).subscribe((response: RegistrationResponse) => {
      this.loading = false;
      for (let i = 0; i < response.rows.length; i++) {
        if (response.rows[i].code == 400) {
          this.invalidLogin = true;
          $(".errorMessagePassword").show();
        } else if (response.rows[i].code == 202) {
          this.resetDone = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resetSub) {
      this.resetSub.unsubscribe();
    }
  }

}
