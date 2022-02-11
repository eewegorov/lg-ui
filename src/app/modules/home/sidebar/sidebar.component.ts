import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import 'metismenu';

declare var UE;

(window as any)._ues = {
  host: 'leadgenic.userecho.com',
  forum: '1',
  lang: 'ru',
  chat: { channel: null },
  chat_tab_show: false,
  tab_show: false
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('menu', { static: true }) menu: ElementRef;
  public abtestsMenuExpanded = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.abtestsMenuExpanded = event.url.includes('/abtests/');
    });
  }

  ngOnInit(): void {
    $(this.menu.nativeElement).metisMenu();
    this.loadScript('http://cdn.userecho.com/js/widget-1.4.gz.js');
  }

  private loadScript(url: string): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  }

  public preloadBanner(): void {
    UE.Popin.preload();
  }

  public showBanner(): void {
    UE.Popin.show();
  }

}
