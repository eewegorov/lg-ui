import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxFlowModule } from '@flowjs/ngx-flow';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsListComponent } from './widgets-list/widgets-list.component';
import { WidgetCardComponent } from './widget-card/widget-card.component';
import { WidgetAddComponent } from './widget-add/widget-add.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { CampaignDeleteComponent } from './campaign-delete/campaign-delete.component';
import { SmartpointsControlComponent } from './smartpoints-control/smartpoints-control.component';
import { ContainerizedContainerComponent } from './containerized/containerized-container/containerized-container.component';
import { ContainerizedItemComponent } from './containerized/containerized-item/containerized-item.component';
import { WidgetItemComponent } from './widget-item/widget-item.component';
import { ContainerizedAddComponent } from './containerized/containerized-add/containerized-add.component';
import { TemplatesGalleryComponent } from './templates-gallery/templates-gallery.component';
import { CoolInlineEditFieldModule } from '@angular-cool/inline-edit-field';
import { CloneWidgetComponent } from './clone-widget/clone-widget.component';
import { ContainerCodeComponent } from './containerized/container-code/container-code.component';
import { WidgetEditComponent } from './constructor/widget-edit/widget-edit.component';
import { ConstructorDesignComponent } from './constructor/constructor-design/constructor-design.component';
import { ConstructorIntegrationsComponent } from './constructor/constructor-integrations/constructor-integrations.component';
import { ConstructorAudiencesComponent } from './constructor/constructor-audiences/constructor-audiences.component';
import { ConstructorRulesComponent } from './constructor/constructor-rules/constructor-rules.component';
import { RuleReferComponent } from './constructor/audiences/rule-refer/rule-refer.component';
import { RuleUrlComponent } from './constructor/audiences/rule-url/rule-url.component';
import { RuleTypeComponent } from './constructor/audiences/rule-type/rule-type.component';
import { RuleVisitComponent } from './constructor/audiences/rule-visit/rule-visit.component';
import { RuleVisitNoComponent } from './constructor/audiences/rule-visit-no/rule-visit-no.component';
import { RuleDevicesComponent } from './constructor/audiences/rule-devices/rule-devices.component';
import { RuleSocialComponent } from './constructor/audiences/rule-social/rule-social.component';


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
    TemplatesGalleryComponent,
    CloneWidgetComponent,
    ContainerCodeComponent,
    ConstructorDesignComponent,
    ConstructorIntegrationsComponent,
    ConstructorAudiencesComponent,
    ConstructorRulesComponent,
    RuleReferComponent,
    RuleUrlComponent,
    RuleTypeComponent,
    RuleVisitComponent,
    RuleVisitNoComponent,
    RuleDevicesComponent,
    RuleSocialComponent,
  ],
  exports: [
    SmartpointsControlComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    UiSwitchModule,
    FilterPipeModule,
    CoolInlineEditFieldModule,
    InfiniteScrollModule,
    SharedModule,
    WidgetsRoutingModule,
    NgxFlowModule,
    NgSelectModule
  ]
})
export class WidgetsModule { }
