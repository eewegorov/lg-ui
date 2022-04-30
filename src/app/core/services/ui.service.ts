import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from "rxjs";
import { combineLatest, debounceTime, distinctUntilChanged, map} from "rxjs/operators";
import { Breakpoint } from "../enums/breakpoint/breakpoint";

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public readonly uiBreakpoint$: Observable<Breakpoint>;

  private readonly _uiBreakpoint$: Subject<Breakpoint>;
  private readonly _sidebarState$: BehaviorSubject<boolean>;
  private readonly sidebarClassName: 'show-sidebar' | 'hide-sidebar';

  constructor() {
    this._uiBreakpoint$ = new Subject<Breakpoint>();
    this.uiBreakpoint$ = this._uiBreakpoint$.asObservable();
    this._sidebarState$ = new BehaviorSubject<boolean>(window.innerWidth >= 768);
    this.sidebarClassName = 'show-sidebar';

    this.watchWindowSizes();
    this.watchSidebarState();
  }

  public toggleSidebar(show?: boolean): void {
    if (show === true || show === false) {
      this._sidebarState$.next(show);
    } else {
      this._sidebarState$.next(!this._sidebarState$.getValue());
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

  private watchSidebarState(): void {
    this._sidebarState$
      .pipe(
        combineLatest<boolean, Breakpoint>(this._uiBreakpoint$),
        distinctUntilChanged()
      )
      .subscribe(([show, breakpoint]: [boolean, Breakpoint]) => {
      if (show && breakpoint >= 768 ) {
          $('body').addClass(this.sidebarClassName);
      } else {
          $('body').removeClass(this.sidebarClassName);
      }
    })
  }
}
