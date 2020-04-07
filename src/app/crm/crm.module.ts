import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsFilterComponent } from './requests-filter/requests-filter.component';
import { RequestsComponent } from './requests/requests.component';



@NgModule({
  declarations: [RequestsListComponent, RequestsFilterComponent, RequestsComponent],
  imports: [
    CommonModule
  ]
})
export class CrmModule { }
