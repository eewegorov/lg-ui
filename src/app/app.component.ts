import { AfterViewInit, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { defaultLocale } from './configs/languages';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('out', style({ opacity: 0 })),
      state('in', style({ opacity: 1 })),
      transition('out => in', animate('1000ms ease-in')),
    ])
  ]
})
export class AppComponent implements AfterViewInit {
  public state = 'out';

  constructor(
    private cd: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.translateService.use(defaultLocale);
    this.setBodySmall();
  }

  ngAfterViewInit(): void {
    this.state = this.state && this.state === 'in' ? 'out' : 'in';
    this.cd.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  private setBodySmall(): void {
    if ($(document).width() < 769) {
      $('body').addClass('page-small');
    } else {
      $('body').removeClass('page-small');
      $('body').removeClass('show-sidebar');
    }
  }
}
