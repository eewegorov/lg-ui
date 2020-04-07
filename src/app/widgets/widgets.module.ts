import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsListComponent } from './widgets-list/widgets-list.component';
import { WidgetCardComponent } from './widget-card/widget-card.component';
import { WidgetAddComponent } from './widget-add/widget-add.component';
import { WidgetsComponent } from './widgets/widgets.component';



@NgModule({
  declarations: [WidgetsListComponent, WidgetCardComponent, WidgetAddComponent, WidgetsComponent],
  imports: [
    CommonModule
  ]
})
export class WidgetsModule { }
