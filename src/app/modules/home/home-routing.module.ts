import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', redirectTo: '/site/list', pathMatch: 'full' },
      { path: 'site', loadChildren: () => import('../sites/sites.module').then(m => m.SitesModule) },
      { path: 'widgets', loadChildren: () => import('../widgets/widgets.module').then(m => m.WidgetsModule) },
      { path: 'abtests', loadChildren: () => import('../abtests/abtests.module').then(m => m.AbtestsModule) },
      { path: 'coupons', loadChildren: () => import('../coupons/coupons.module').then(m => m.CouponsModule) },
      { path: 'crm', loadChildren: () => import('../crm/crm.module').then(m => m.CrmModule) },
      { path: 'reports/emails', loadChildren: () => import('../emails/emails.module').then(m => m.EmailsModule) },
      { path: 'user', loadChildren: () => import('../user/user.module').then(m => m.UserModule) },
      { path: 'user/partner', loadChildren: () => import('../partner/partner.module').then(m => m.PartnerModule) }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {
}
