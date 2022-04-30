import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, SubscriptionLike } from 'rxjs';
import { UiService } from '../../../core/services/ui.service';
import { UserService } from '../../user/services/user.service';
import { User } from '../../../core/models/user';
import { Breakpoint } from "../../../core/enums/breakpoint/breakpoint";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public readonly uiBreakpoint$: Observable<Breakpoint>;
  public readonly breakpoint = Breakpoint;
  public login: string;
  public yandexRef = false;

  private readonly sub: Subscription;

  constructor(
    private readonly uiService: UiService,
    private readonly userService: UserService
  ) {
    this.sub = new Subscription();
    this.uiBreakpoint$ = uiService.uiBreakpoint$;
  }

  ngOnInit(): void {
    this.facebookInit();
    this.userSub();
  }

  public toggleSidebar(event: Event): void {
    event.preventDefault();
    this.uiService.toggleSidebar();
  }

  private facebookInit(): void {
    ((d: Document, s: string, id: string) => {
      let js = d.getElementsByTagName(s)[0] as HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = '//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.5&appId=631167713613990';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  private userSub(): void {
    const userSub: SubscriptionLike = this.userService.getMeInfo().subscribe((response: User) => {
      this.login = response.login;
    });
    this.sub.add(userSub)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
