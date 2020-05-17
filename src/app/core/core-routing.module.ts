import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  { path: '',
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),
    canActivate: [ AuthGuard ]
  },
  { path: 'account', loadChildren: () => import('../modules/account/account.module').then(m => m.AccountModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class CoreRoutingModule {
}
