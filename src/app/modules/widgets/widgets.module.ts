import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsListComponent } from './widgets-list/widgets-list.component';
import { WidgetCardComponent } from './widget-card/widget-card.component';
import { WidgetAddComponent } from './widget-add/widget-add.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { WidgetEditComponent } from './widget-edit/widget-edit.component';
import { CampaignDeleteComponent } from './campaign-delete/campaign-delete.component';
import { SmartpointsControlComponent } from './smartpoints-control/smartpoints-control.component';
import { ContainerizedContainerComponent } from './containerized-container/containerized-container.component';
import { ContainerizedItemComponent } from './containerized-container/containerized-item/containerized-item.component';
import { WidgetItemComponent } from './widget-item/widget-item.component';
import { ContainerizedAddComponent } from './containerized-add/containerized-add.component';
import { TemplatesGalleryComponent } from './templates-gallery/templates-gallery.component';
import { CoolInlineEditFieldModule } from '@angular-cool/inline-edit-field';


@NgModule({
  declarations: [
    WidgetsListComponent,
    WidgetCardComponent,
    WidgetAddComponent,
    WidgetsComponent,
    WidgetEditComponent,
    CampaignDeleteComponent,
    SmartpointsControlComponent,
    ContainerizedContainerComponent,
    ContainerizedItemComponent,
    WidgetItemComponent,
    ContainerizedAddComponent,
    TemplatesGalleryComponent
  ],
  exports: [
    SmartpointsControlComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    UiSwitchModule,
    SharedModule,
    WidgetsRoutingModule,
    CoolInlineEditFieldModule
  ]
})
export class WidgetsModule { }
