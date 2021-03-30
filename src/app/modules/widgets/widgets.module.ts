import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxFlowModule } from '@flowjs/ngx-flow';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoolInlineEditFieldModule } from '@angular-cool/inline-edit-field';
import { LaddaModule } from 'angular2-ladda';
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
import { ButtonElementComponent } from './constructor/design/button-element/button-element.component';
import { CloselinkElementComponent } from './constructor/design/closelink-element/closelink-element.component';
import { ContentElementComponent } from './constructor/design/content-element/content-element.component';
import { CouponElementComponent } from './constructor/design/coupon-element/coupon-element.component';
import { CrmElementComponent } from './constructor/design/crm-element/crm-element.component';
import { FormElementComponent } from './constructor/design/form-element/form-element.component';
import { IframeElementComponent } from './constructor/design/iframe-element/iframe-element.component';
import { ImageElementComponent } from './constructor/design/image-element/image-element.component';
import { PaddingElementComponent } from './constructor/design/padding-element/padding-element.component';
import { RedirectElementComponent } from './constructor/design/redirect-element/redirect-element.component';
import { SocialElementComponent } from './constructor/design/social-element/social-element.component';
import { SplitElementComponent } from './constructor/design/split-element/split-element.component';
import { ThankElementComponent } from './constructor/design/thank-element/thank-element.component';
import { TitleElementComponent } from './constructor/design/title-element/title-element.component';
import { VideoElementComponent } from './constructor/design/video-element/video-element.component';
import { VisualElementComponent } from './constructor/design/visual-element/visual-element.component';


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
    ButtonElementComponent,
    CloselinkElementComponent,
    ContentElementComponent,
    CouponElementComponent,
    CrmElementComponent,
    FormElementComponent,
    IframeElementComponent,
    ImageElementComponent,
    PaddingElementComponent,
    RedirectElementComponent,
    SocialElementComponent,
    SplitElementComponent,
    ThankElementComponent,
    TitleElementComponent,
    VideoElementComponent,
    VisualElementComponent,
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
    NgSelectModule,
    LaddaModule
  ]
})
export class WidgetsModule { }
