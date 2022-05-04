import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { UiService } from '@core/services/ui.service';
import { Breakpoint } from '@core/enums/ui/breakpoint';
import { SidebarState } from '@core/enums/ui/sidebar-state';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public readonly sidebarState$: Observable<SidebarState>;

  private readonly _sidebarState$: BehaviorSubject<SidebarState>;
  private readonly sidebarClassName: string;

  constructor(@Inject(DOCUMENT) private readonly document: Document, private readonly uiService: UiService) {
    this._sidebarState$ = new BehaviorSubject<SidebarState>(
      window.innerWidth >= 768 ? SidebarState.SHOWN : SidebarState.HIDDEN
    );
    this.sidebarState$ = this._sidebarState$.asObservable();
    this.sidebarClassName = 'show-sidebar';
    this.watchUIBreakpoints();
    this.watchSidebarState();
  }

  public toggleSidebar(): void {
    this._sidebarState$.next(
      this._sidebarState$.getValue() === SidebarState.HIDDEN ? SidebarState.SHOWN : SidebarState.HIDDEN
    );
  }

  public showSidebar(): void {
    this._sidebarState$.next(SidebarState.SHOWN);
  }

  public hideSidebar(): void {
    this._sidebarState$.next(SidebarState.HIDDEN);
  }

  private watchUIBreakpoints(): void {
    this.uiService.uiBreakpoint$.subscribe((breakpoint: Breakpoint) => {
      if (breakpoint >= Breakpoint.MD) {
        this.showSidebar();
      } else {
        this.hideSidebar();
      }
    });
  }

  private watchSidebarState(): void {
    this._sidebarState$.subscribe((state: SidebarState) => {
      if (state === SidebarState.SHOWN) {
        this.document.body.classList.add(this.sidebarClassName);
      } else {
        this.document.body.classList.remove(this.sidebarClassName);
      }
    });
  }
}
