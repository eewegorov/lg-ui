import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbtestsActiveComponent } from './abtests-active/abtests-active.component';
import { AbtestsArchiveComponent } from './abtests-archive/abtests-archive.component';


const routes: Routes = [
  { path: 'active', component: AbtestsActiveComponent },
  { path: 'archive', component: AbtestsArchiveComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbtestsRoutingModule {
}
