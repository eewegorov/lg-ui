import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { CrmRoutingModule } from './crm-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsFilterComponent } from './requests-filter/requests-filter.component';
import { RequestsComponent } from './requests/requests.component';
import { LeadInfoComponent } from './lead-info/lead-info.component';


@NgModule({
  declarations: [
    RequestsListComponent,
    RequestsFilterComponent,
    RequestsComponent,
    LeadInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgbModule,
    NgSelectModule,
    ClickOutsideModule,
    SharedModule,
    CrmRoutingModule
  ]
})
export class CrmModule { }
