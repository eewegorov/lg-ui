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
import { FormElementComponent } from './constructor/design/form-element/form-element.component';
import { IframeElementComponent } from './constructor/design/iframe-element/iframe-element.component';
import { ImageElementComponent } from './constructor/design/image-element/image-element.component';
import { PaddingElementComponent } from './constructor/design/padding-element/padding-element.component';
import { RedirectElementComponent } from './constructor/design/redirect-element/redirect-element.component';
import { SocialElementComponent } from './constructor/design/social-element/social-element.component';
import { SplitElementComponent } from './constructor/design/split-element/split-element.component';
import { ThankElementComponent } from './constructor/design/thank-element/thank-element.component';
import { TextElementComponent } from './constructor/design/text-element/text-element.component';
import { VideoElementComponent } from './constructor/design/video-element/video-element.component';
import { VisualElementComponent } from './constructor/design/visual-element/visual-element.component';
import { CouponCallbackComponent } from './constructor/design/coupon-callback/coupon-callback.component';
import { FormExtendedComponent } from './constructor/design/form-extended/form-extended/form-extended.component';
import { ExtendedButtonComponent } from './constructor/design/form-extended/extended-button/extended-button.component';
import { ExtendedDateComponent } from './constructor/design/form-extended/extended-date/extended-date.component';
import { ExtendedDatepickerComponent } from './constructor/design/form-extended/extended-datepicker/extended-datepicker.component';
import { ExtendedDdComponent } from './constructor/design/form-extended/extended-dd/extended-dd.component';
import { ExtendedDdwComponent } from './constructor/design/form-extended/extended-ddw/extended-ddw.component';
import { ExtendedEmailComponent } from './constructor/design/form-extended/extended-email/extended-email.component';
import { ExtendedHiddenComponent } from './constructor/design/form-extended/extended-hidden/extended-hidden.component';
import { ExtendedMessageComponent } from './constructor/design/form-extended/extended-message/extended-message.component';
import { ExtendedNameComponent } from './constructor/design/form-extended/extended-name/extended-name.component';
import { ExtendedPhoneComponent } from './constructor/design/form-extended/extended-phone/extended-phone.component';
import { ExtendedRatingComponent } from './constructor/design/form-extended/extended-rating/extended-rating.component';
import { ExtendedTermComponent } from './constructor/design/form-extended/extended-term/extended-term.component';
import { ExtendedTextComponent } from './constructor/design/form-extended/extended-text/extended-text.component';
import { ExtendedTitleComponent } from './constructor/design/form-extended/extended-title/extended-title.component';
import { ExtendedVariantsComponent } from './constructor/design/form-extended/extended-variants/extended-variants.component';
import { TimerElementComponent } from './constructor/design/timer-element/timer-element.component';


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
    ExtendedDateComponent,
    ExtendedDatepickerComponent,
    ExtendedDdComponent,
    ExtendedDdwComponent,
    ExtendedEmailComponent,
    ExtendedHiddenComponent,
    ExtendedMessageComponent,
    ExtendedNameComponent,
    ExtendedPhoneComponent,
    ExtendedRatingComponent,
    ExtendedTermComponent,
    ExtendedTextComponent,
    ExtendedTitleComponent,
    ExtendedVariantsComponent,
    TimerElementComponent,
  ],
  exports: [
    SmartpointsControlComponent,
    TemplatesGalleryComponent
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
    LaddaModule,
    ColorPickerModule,
    NgxSliderModule,
    SortablejsModule,
    NgxSummernoteModule,
    AngularEditorModule
  ]
})
export class WidgetsModule { }
