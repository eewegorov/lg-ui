import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SitesComponent } from './pages/sites/sites.component';
import { SiteSettingsComponent } from './pages/site-settings/site-settings.component';

const routes: Routes = [
  { path: 'list', component: SitesComponent },
  { path: 'settings/:id', component: SiteSettingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitesRoutingModule {}
