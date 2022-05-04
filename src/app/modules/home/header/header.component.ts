import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UiService } from '@core/services/ui.service';
import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { User } from '@core/models/user';
import { Breakpoint } from '@core/enums/ui/breakpoint';
import { UserService } from '@modules/user/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public readonly uiBreakpoint$: Observable<Breakpoint>;
  public readonly user$: Observable<User>;
  public readonly breakpoint = Breakpoint;
  public login: string;
  public yandexRef = false;

  constructor(
    private readonly uiService: UiService,
    private readonly sidebarService: SidebarService,
    private readonly userService: UserService
  ) {
    this.uiBreakpoint$ = uiService.uiBreakpoint$;
    this.user$ = this.userService.user$;
  }

  ngOnInit(): void {
    this.facebookInit();
  }

  public toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
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
}
