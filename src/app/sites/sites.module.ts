import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteAddComponent } from './site-add/site-add.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { SitesListComponent } from './sites-list/sites-list.component';
import { SitesComponent } from './sites/sites.component';



@NgModule({
  declarations: [SiteAddComponent, SiteSettingsComponent, SitesListComponent, SitesComponent],
  imports: [
    CommonModule
  ]
})
export class SitesModule { }
