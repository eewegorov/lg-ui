import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailsBestComponent } from './emails-best/emails-best.component';
import { EmailsLastComponent } from './emails-last/emails-last.component';
import { EmailsStatisticsComponent } from './emails-statistics/emails-statistics.component';
import { EmailsFilterComponent } from './emails-filter/emails-filter.component';
import { EmailsComponent } from './emails/emails.component';



@NgModule({
  declarations: [EmailsBestComponent, EmailsLastComponent, EmailsStatisticsComponent, EmailsFilterComponent, EmailsComponent],
  imports: [
    CommonModule
  ]
})
export class EmailsModule { }
