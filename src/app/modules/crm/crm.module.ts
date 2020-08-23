import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CrmRoutingModule } from './crm-routing.module';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsFilterComponent } from './requests-filter/requests-filter.component';
import { RequestsComponent } from './requests/requests.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    RequestsListComponent,
    RequestsFilterComponent,
    RequestsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgbModule,
    NgSelectModule,
    CrmRoutingModule,
    SharedModule
  ]
})
export class CrmModule { }
