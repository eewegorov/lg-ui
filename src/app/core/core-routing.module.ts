import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AccountGuard } from './services/account.guard';
import { LogoutComponent } from './components/logout/logout.component';


const routes: Routes = [
  { path: '',
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),
    canActivate: [ AuthGuard ]
  },
  { path: 'account',
    loadChildren: () => import('../modules/account/account.module').then(m => m.AccountModule),
    canActivate: [ AccountGuard ]
  },
  { path: 'logout', component: LogoutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class CoreRoutingModule {
}
