import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitesComponent } from './sites/sites.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';


const routes: Routes = [
  { path: 'list', component: SitesComponent },
  { path: 'settings/:id', component: SiteSettingsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitesRoutingModule { }
