import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UiService } from '../../../core/services/ui.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public login: string;
  public yandexRef = false;
  public isPartnerPage = false;

  private routerSub: SubscriptionLike;
  private userSub: SubscriptionLike;

  constructor(
    private router: Router,
    private uiService: UiService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.facebookInit();

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPartnerPage = event.url === '/user/partner';
    });

    this.userSub = this.userService.getMeInfo().subscribe((response: User) => {
      this.login = response.login;
    });
  }

  private facebookInit(): void {
    ((d, s, id) => {
      let js = d.getElementsByTagName(s)[0] as HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = '//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.5&appId=631167713613990';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  public handleMinimalizeSidebar(event: Event): void {
    event.preventDefault();
    this.uiService.toggleSidebar();
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }

    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
