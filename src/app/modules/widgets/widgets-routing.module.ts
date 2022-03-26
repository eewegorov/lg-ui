import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetsComponent } from './widgets/widgets.component';
import { WidgetEditComponent } from './constructor/widget-edit/widget-edit.component';


const routes: Routes = [
  { path: '', component: WidgetsComponent },
  { path: 'edit/:id', component: WidgetEditComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsRoutingModule {
}
