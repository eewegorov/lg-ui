import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public login: string;
  public yandexRef = false;
  public isPartnerPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPartnerPage = event.url === '/user/partner';
    });
  }

  ngOnInit(): void {
    this.facebookInit();
    this.login = 'eevegorov@yandex.ru';

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

  handleMinimalizeSidebar() {
    event.preventDefault();
    if ($(window).width() < 769) {
      $("body").toggleClass("show-sidebar");
    } else {
      $("body").toggleClass("hide-sidebar");
    }
  }
}
