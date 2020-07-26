import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private readonly sidebarClassName: 'show-sidebar' | 'hide-sidebar';
  private readonly isMobile: boolean;

  constructor() {
    this.isMobile = window.innerWidth < 769;
    this.sidebarClassName = this.isMobile ? 'show-sidebar' : 'hide-sidebar';
  }

  public toggleSidebar(show?: boolean): void {
    if (show === undefined) {
      $('body').toggleClass(this.sidebarClassName);
    } else if (show) {
      if (this.isMobile) {
        $('body').removeClass(this.sidebarClassName);
      } else {
        $('body').addClass(this.sidebarClassName);
      }
    } else {
      if (this.isMobile) {
        $('body').addClass(this.sidebarClassName);
      } else {
        $('body').removeClass(this.sidebarClassName);
      }
    }
  }

}
