import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { defaultLocale } from './configs/languages';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    this.translateService.use(defaultLocale);
    this.setBodySmall();
  }

  @HostListener('window:resize', ['$event'])
  setBodySmall() {
    if ($(document).width() < 769) {
      $('body').addClass('page-small');
    } else {
      $('body').removeClass('page-small');
      $('body').removeClass('show-sidebar');
    }
  }
}
