import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmailsRoutingModule } from './emails-routing.module';
import { EmailsBestComponent } from './emails-best/emails-best.component';
import { EmailsLastComponent } from './emails-last/emails-last.component';
import { EmailsStatisticsComponent } from './emails-statistics/emails-statistics.component';
import { EmailsFilterComponent } from './emails-filter/emails-filter.component';
import { EmailsComponent } from './emails/emails.component';


@NgModule({
  declarations: [
    EmailsBestComponent,
    EmailsLastComponent,
    EmailsStatisticsComponent,
    EmailsFilterComponent,
    EmailsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    EmailsRoutingModule
  ]
})
export class EmailsModule { }
