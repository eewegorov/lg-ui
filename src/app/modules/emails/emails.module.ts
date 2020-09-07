import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';
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
    FormsModule,
    TranslateModule,
    NgbModule,
    NgSelectModule,
    ChartsModule,
    SharedModule,
    EmailsRoutingModule
  ]
})
export class EmailsModule { }
