import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CrmRoutingModule } from './crm-routing.module';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsFilterComponent } from './requests-filter/requests-filter.component';
import { RequestsComponent } from './requests/requests.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RequestsListComponent,
    RequestsFilterComponent,
    RequestsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CrmRoutingModule,
    NgSelectModule,
    FormsModule
  ]
})
export class CrmModule { }
