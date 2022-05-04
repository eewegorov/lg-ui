import { Injectable } from '@angular/core';
import { fromEvent, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { Breakpoint } from '@core/enums/ui/breakpoint';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public readonly uiBreakpoint$: Observable<Breakpoint>;

  private readonly _uiBreakpoint$: ReplaySubject<Breakpoint>;

  constructor() {
    this._uiBreakpoint$ = new ReplaySubject<Breakpoint>(1);
    this.uiBreakpoint$ = this._uiBreakpoint$.asObservable();
    this.watchWindowSizes();
  }

  private watchWindowSizes(): void {
    fromEvent<Event>(window, 'resize')
      .pipe(startWith(null), debounceTime(10))
      .subscribe(() => {
        const width: number = window.innerWidth;
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
  }
}
