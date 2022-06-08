import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { PasswordRequest, User, UserRequest } from '@core/models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  public user: UserRequest = {
    phone: '',
    email: '',
    notificated: true,
    needStatsNotifications: true,
    timeZone: ''
  };
  public saveGeneralDisabled = false;
  public oldPassword = '';
  public newPassword = '';
  public changePasswordDisabled = false;
  @ViewChild('password', { static: true }) private password: ElementRef;
  private meInfoSub: SubscriptionLike;

  constructor(private translate: TranslateService, private toastr: ToastrService, private userService: UserService) {}

  ngOnInit(): void {
    this.meInfoSub = this.userService.user$.subscribe((user: User) => {
      this.user = {
        phone: user.phone,
        email: user.email,
        notificated: user.notificated,
        needStatsNotifications: user.needStatsNotifications,
        timeZone: user.timeZone
      };
    });
  }

  public saveGeneral() {
    this.saveGeneralDisabled = true;
    this.user.phone = this.user.phone.trim();
    this.user.email = this.user.email.trim();

    this.userService.updateMeInfo(this.user).subscribe((response: boolean) => {
      this.saveGeneralDisabled = false;

      if (response) {
        this.toastr.success(this.translate.instant('userInfo.settingsChanged'), this.translate.instant('global.done'));
      } else {
        this.toastr.error(
          this.translate.instant('settings.site.newIntegration.create.error'),
          this.translate.instant('global.error')
        );
      }
    });
  }

  public changePassword() {
    this.changePasswordDisabled = true;
    const passwords: PasswordRequest = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.userService.updatePassword(passwords).subscribe((response: boolean) => {
      this.changePasswordDisabled = false;

      if (response) {
        this.toastr.success(this.translate.instant('userInfo.settingsChanged'), this.translate.instant('global.done'));
        this.oldPassword = '';
        this.newPassword = '';
      } else {
        this.toastr.error(
          this.translate.instant('settings.site.newIntegration.create.error'),
          this.translate.instant('global.error')
        );
      }
    });
  }

  public togglePasswordVisibility(type: 'password' | 'text') {
    this.password.nativeElement.setAttribute('type', type);
  }

  ngOnDestroy(): void {
    if (this.meInfoSub) {
      this.meInfoSub.unsubscribe();
    }
  }
}
