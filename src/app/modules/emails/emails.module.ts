import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';
import { EmailsRoutingModule } from './emails-routing.module';
import { EmailsBestComponent } from './components/emails-best/emails-best.component';
import { EmailsLastComponent } from './components/emails-last/emails-last.component';
import { EmailsStatisticsComponent } from './components/emails-statistics/emails-statistics.component';
import { EmailsFilterComponent } from './components/emails-filter/emails-filter.component';
import { EmailsComponent } from './pages/emails/emails.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

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
    EmailsRoutingModule,
    InlineSVGModule
  ]
})
export class EmailsModule {}
