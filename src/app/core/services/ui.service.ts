import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public readonly isMobile$: Observable<boolean>;

  private readonly _isMobile$: Subject<boolean>;
  private readonly sidebarClassName: 'show-sidebar' | 'hide-sidebar';
  private readonly isMobile: boolean;

  constructor() {
    this._isMobile$ = new Subject<boolean>();
    this.isMobile$ = this._isMobile$.asObservable();

    this.isMobile = window.innerWidth < 769;
    this.sidebarClassName = this.isMobile ? 'show-sidebar' : 'hide-sidebar';

    this.watchWindowSizes();
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

  private watchWindowSizes(): void {
    fromEvent<Event>(window, 'resize')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        map<Event, Window>((event: Event) => <Window>event.target),
        map<Window, number>((window: Window) => <number>window.innerWidth)
      )
      .subscribe((width: number) => this._isMobile$.next(width < 769));
    window.dispatchEvent(new Event('resize'));
  }
}
