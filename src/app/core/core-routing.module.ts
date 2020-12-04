import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AccountGuard } from './services/account.guard';


const routes: Routes = [
  { path: '',
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),
    canActivate: [ AuthGuard ]
  },
  { path: 'account',
    loadChildren: () => import('../modules/account/account.module').then(m => m.AccountModule),
    canActivate: [ AccountGuard ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class CoreRoutingModule {
}
