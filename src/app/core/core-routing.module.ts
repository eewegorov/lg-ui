import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  { path: '', canActivate: [ AuthGuard ],
    children: [
      { path: '', redirectTo: '/site/list', pathMatch: 'full' },
      { path: 'site', loadChildren: () => import('../sites/sites.module').then(m => m.SitesModule) },
      { path: 'widgets', loadChildren: () => import('../widgets/widgets.module').then(m => m.WidgetsModule) },
      { path: 'abtests', loadChildren: () => import('../abtests/abtests.module').then(m => m.AbtestsModule) },
      { path: 'coupons', loadChildren: () => import('../coupons/coupons.module').then(m => m.CouponsModule) },
      { path: 'crm', loadChildren: () => import('../crm/crm.module').then(m => m.CrmModule) },
      { path: 'reports/emails', loadChildren: () => import('../emails/emails.module').then(m => m.EmailsModule) },
      { path: 'user', loadChildren: () => import('../user/user.module').then(m => m.UserModule) }
    ]
  },
  { path: 'account', loadChildren: () => import('../account/account.module').then(m => m.AccountModule) },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class CoreRoutingModule {
}
