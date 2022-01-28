import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UiService } from '../../../core/services/ui.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public login: string;
  public yandexRef = false;
  public isPartnerPage = false;

  constructor(
    private router: Router,
    private uiService: UiService,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPartnerPage = event.url === '/user/partner';
    });
  }

  ngOnInit(): void {
    this.facebookInit();
    this.login = this.authService.loggedUser;
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
}
