import { Component } from '@angular/core';
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
  }

  title = 'lg-ui';
}
