import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core'
import { ChartsModule } from 'ng2-charts';;
import { SharedModule } from '../../shared/shared.module';
import { SitesRoutingModule } from './sites-routing.module';
import { SiteAddComponent } from './site-add/site-add.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { SitesListComponent } from './sites-list/sites-list.component';
import { SitesComponent } from './sites/sites.component';


@NgModule({
  declarations: [
    SiteAddComponent,
    SiteSettingsComponent,
    SitesListComponent,
    SitesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ChartsModule,
    SharedModule,
    SitesRoutingModule
  ]
})
export class SitesModule { }
