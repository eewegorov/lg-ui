import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { Breakpoint } from "../enums/breakpoint/breakpoint";

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public readonly uiBreakpoint$: Observable<Breakpoint>;

  private readonly _uiBreakpoint$: Subject<Breakpoint>;
  private readonly sidebarClassName: 'show-sidebar' | 'hide-sidebar';
  private readonly isMobile: boolean;

  constructor() {
    this._uiBreakpoint$ = new Subject<Breakpoint>();
    this.uiBreakpoint$ = this._uiBreakpoint$.asObservable();

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
        debounceTime(50),
        map<Event, Window>((event: Event) => <Window>event.target),
        map<Window, number>((window: Window) => <number>window.innerWidth),
        distinctUntilChanged(),
      )
      .subscribe((width: number) => {
        if (width >= Breakpoint.XXL) {
          this._uiBreakpoint$.next(Breakpoint.XXL);
        } else if (width >= Breakpoint.XL && width < Breakpoint.XXL) {
          this._uiBreakpoint$.next(Breakpoint.XL);
        } else if (width >= Breakpoint.LG && width < Breakpoint.XL) {
          this._uiBreakpoint$.next(Breakpoint.LG);
        } else if (width >= Breakpoint.MD && width < Breakpoint.LG) {
          this._uiBreakpoint$.next(Breakpoint.MD);
        } else if (width >= Breakpoint.SM && width < Breakpoint.MD) {
          this._uiBreakpoint$.next(Breakpoint.SM);
        } else if (width < Breakpoint.SM) {
          this._uiBreakpoint$.next(Breakpoint.XS);
        }
      });
    window.dispatchEvent(new Event('resize'));
  }
}
