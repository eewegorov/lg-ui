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
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgTempusdominusBootstrapModule } from 'ngx-tempusdominus-bootstrap';
import { IconPickerModule } from 'ngx-icon-picker';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from '../../shared/shared.module';
import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsListComponent } from './components/widgets-list/widgets-list.component';
import { WidgetCardComponent } from './components/widget-card/widget-card.component';
import { WidgetAddComponent } from './components/widget-add/widget-add.component';
import { WidgetsComponent } from './pages/widgets/widgets.component';
import { CampaignDeleteComponent } from './components/campaign-delete/campaign-delete.component';
import { SmartpointsControlComponent } from './components/smartpoints-control/smartpoints-control.component';
import { ContainerizedContainerComponent } from './components/containerized/containerized-container/containerized-container.component';
import { ContainerizedItemComponent } from './components/containerized/containerized-item/containerized-item.component';
import { WidgetItemComponent } from './components/widget-item/widget-item.component';
import { ContainerizedAddComponent } from './components/containerized/containerized-add/containerized-add.component';
import { TemplatesGalleryComponent } from './components/templates-gallery/templates-gallery.component';
import { CloneWidgetComponent } from './components/clone-widget/clone-widget.component';
import { ContainerCodeComponent } from './components/containerized/container-code/container-code.component';
import { WidgetEditComponent } from './pages/widget-edit/widget-edit.component';
import { ConstructorDesignComponent } from './components/constructor/constructor-design/constructor-design.component';
import { ConstructorIntegrationsComponent } from './components/constructor/constructor-integrations/constructor-integrations.component';
import { ConstructorAudiencesComponent } from './components/constructor/constructor-audiences/constructor-audiences.component';
import { ConstructorRulesComponent } from './components/constructor/constructor-rules/constructor-rules.component';
import { RuleReferComponent } from './components/constructor/audiences/rule-refer/rule-refer.component';
import { RuleUrlComponent } from './components/constructor/audiences/rule-url/rule-url.component';
import { RuleTypeComponent } from './components/constructor/audiences/rule-type/rule-type.component';
import { RuleVisitComponent } from './components/constructor/audiences/rule-visit/rule-visit.component';
import { RuleVisitNoComponent } from './components/constructor/audiences/rule-visit-no/rule-visit-no.component';
import { RuleDevicesComponent } from './components/constructor/audiences/rule-devices/rule-devices.component';
import { RuleSocialComponent } from './components/constructor/audiences/rule-social/rule-social.component';
import { ButtonElementComponent } from './components/constructor/design/button-element/button-element.component';
import { CloselinkElementComponent } from './components/constructor/design/closelink-element/closelink-element.component';
import { ContentElementComponent } from './components/constructor/design/content-element/content-element.component';
import { CouponElementComponent } from './components/constructor/design/coupon-element/coupon-element.component';
import { FormElementComponent } from './components/constructor/design/form-element/form-element.component';
import { IframeElementComponent } from './components/constructor/design/iframe-element/iframe-element.component';
import { ImageElementComponent } from './components/constructor/design/image-element/image-element.component';
import { PaddingElementComponent } from './components/constructor/design/padding-element/padding-element.component';
import { RedirectElementComponent } from './components/constructor/design/redirect-element/redirect-element.component';
import { SocialElementComponent } from './components/constructor/design/social-element/social-element.component';
import { SplitElementComponent } from './components/constructor/design/split-element/split-element.component';
import { ThankElementComponent } from './components/constructor/design/thank-element/thank-element.component';
import { TextElementComponent } from './components/constructor/design/text-element/text-element.component';
import { VideoElementComponent } from './components/constructor/design/video-element/video-element.component';
import { VisualElementComponent } from './components/constructor/design/visual-element/visual-element.component';
import { CouponCallbackComponent } from './components/constructor/design/coupon-callback/coupon-callback.component';
import { FormExtendedComponent } from './components/constructor/design/form-extended/form-extended/form-extended.component';
import { ExtendedButtonComponent } from './components/constructor/design/form-extended/extended-button/extended-button.component';
import { ExtendedDatepickerComponent } from './components/constructor/design/form-extended/extended-datepicker/extended-datepicker.component';
import { ExtendedDdComponent } from './components/constructor/design/form-extended/extended-dd/extended-dd.component';
import { ExtendedDdwComponent } from './components/constructor/design/form-extended/extended-ddw/extended-ddw.component';
import { ExtendedHiddenComponent } from './components/constructor/design/form-extended/extended-hidden/extended-hidden.component';
import { ExtendedTextComponent } from './components/constructor/design/form-extended/extended-text/extended-text.component';
import { ExtendedTitleComponent } from './components/constructor/design/form-extended/extended-title/extended-title.component';
import { ExtendedVariantsComponent } from './components/constructor/design/form-extended/extended-variants/extended-variants.component';
import { TimerElementComponent } from './components/constructor/design/timer-element/timer-element/timer-element.component';
import { TimerDatepickerComponent } from './components/constructor/design/timer-element/timer-datepicker/timer-datepicker.component';
import { ConstructorHeaderComponent } from './components/constructor/constructor-header/constructor-header.component';
import { PositionControlComponent } from './shared/position-control/position-control.component';
import { ElementsAddComponent } from './shared/elements-add/elements-add.component';

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
    FormElementComponent,
    IframeElementComponent,
    ImageElementComponent,
    PaddingElementComponent,
    RedirectElementComponent,
    SocialElementComponent,
    SplitElementComponent,
    ThankElementComponent,
    TextElementComponent,
    VideoElementComponent,
    VisualElementComponent,
    CouponCallbackComponent,
    FormExtendedComponent,
    ExtendedButtonComponent,
    ExtendedDatepickerComponent,
    ExtendedDdComponent,
    ExtendedDdwComponent,
    ExtendedHiddenComponent,
    ExtendedTextComponent,
    ExtendedTitleComponent,
    ExtendedVariantsComponent,
    TimerElementComponent,
    TimerDatepickerComponent,
    PositionControlComponent,
    ElementsAddComponent,
    ConstructorHeaderComponent
  ],
  exports: [SmartpointsControlComponent, TemplatesGalleryComponent],
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
    LaddaModule.forRoot({ style: 'zoom-in' }),
    ColorPickerModule,
    NgxSliderModule,
    SortablejsModule,
    NgxSummernoteModule,
    AngularEditorModule,
    NgTempusdominusBootstrapModule,
    IconPickerModule,
    InlineSVGModule
  ]
})
export class WidgetsModule {}
