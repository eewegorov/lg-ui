import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FlowDirective } from '@flowjs/ngx-flow';
import { FullWidget } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-constructor-design',
  templateUrl: './constructor-design.component.html',
  styleUrls: ['./constructor-design.component.scss']
})
export class ConstructorDesignComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;
  @Input() public sid: string;
  @Input() public wid: string;
  @Input() public widget: FullWidget;
  @Input() public isDesigner: boolean;
  @Input() public isMockup: boolean;
  @Input() public isContainerized: boolean;

  public isLoading = false;

  private validators = [];
  private couponsId = [];
  private customFields = [];
  private formExtIdsCached = [];
  private couponsErrorFlag = false;
  private formExtIdsErrorFlag = false;
  private formExtNeedButton = false;
  private formExtRedirectFieldEmpty = false;

  private autoUploadSubscription: SubscriptionLike;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe(event => {
      if (event.type === 'filesSubmitted') {
        this.flow.upload();
      }
    });
  }

  public goToTest(widget) {
    this.router.navigate([`/abtests/active?testIdNum-${widget.abtestInfo.id}`]).then();
  }

  public saveAsMockup() {
    let errorsList = this.runValidators();
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
    } else {
      ($('#saveAsMockupModal') as any).modal('show');
    }
  }

  public startWidget(widget) {
    if (!widget.active) {
      this.switchWidget(widget, true);
    }
  }

  public stopWidget(widget) {
    if (widget.active) {
      this.switchWidget(widget, false);
    }
  }

  public saveWidget() {
    if (this.isMockup) {
      this.saveMockupItem();
    } else {
      this.saveWidgetItem();
    }
  }

  private switchWidget(widget, newValue) {
    $('[role="tooltip"]').remove();
    if (widget.active === newValue) { return false; }
    if (this.isContainerized) {
      this.containerizedWidgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) { return false; }
        this.widget.active = newValue;
      });
    } else {
      this.widgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) { return false; }
        this.widget.active = newValue;
      });
    }
  }

  private saveMockupItem() {
    let errorsList = this.runValidators();
    this.isLoading = true;

    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else {
      const savedInstance = {
        name: this.widget.name,
        guiprops:  this.widget.guiprops,
        autoinvite:  this.widget.autoinvite,
        restrictions:  this.widget.restrictions,
        autoresponder:  this.widget.autoresponder,
        rules:  this.widget.rules
      } as FullWidget;

      this.widgetService.updateMockup(this.wid, savedInstance).subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translate.instant('widgetsList.editor.save.done.desc', this.translate.instant('widgetsList.editor.save.done.title')));
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          }
        },
        () => {
          this.toastr.error(this.translate.instant('widgetsList.editor.save.error.desc'), this.translate.instant('widgetsList.editor.save.error.title'));
          this.isLoading = false;
          Swal.fire(
            this.translate.instant('widgetsList.editor.save.error.title'),
            this.translate.instant('widgetsList.editor.save.error.desc'),
            'error'
          ).then();
        }
      );
    }
  }

  private saveWidgetItem() {
    this.widget.guiprops.dhVisual.lastModifiedDate = new Date().toString();
    this.widget.guiprops.dhVisual.widget_width_all   = this.SP_widget.widget_width_all;
    this.widget.guiprops.dhVisual.widget_height_all  = this.SP_widget.widget_height_all;
    this.widget.guiprops.dhVisual.widget_width_nopx  = this.SP_widget.widget_width_nopx;
    this.widget.guiprops.dhVisual.widget_height_nopx = this.SP_widget.widget_height_nopx;
    this.widget.guiprops.dhVisual.widget_ul_width_nopx = this.SP_widget.widget_ul_width_nopx;
    this.widget.guiprops.dhVisual.CP_width = this.SP_widget.widget_CP_width;
    this.widget.guiprops.dhVisual.CP_offset_top = this.SP_widget.widget_CP_offset_top;
    this.widget.guiprops.image.width = this.SP_widget.img_width;
    this.widget.guiprops.image.height = this.SP_widget.img_height;

    this.addCouponsId();
    this.mapFormExtFieldId();

    let errorsList = this.runValidators();
    this.isLoading = true;
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.couponsErrorFlag) {
      this.toastr.error(this.translate.instant('widgets.constructor.coupon.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.formExtIdsErrorFlag) {
      this.toastr.error(this.translate.instant('widgets.constructor.formExtId.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.formExtNeedButton) {
      this.toastr.error(this.translate.instant('widgets.constructor.formExtId.actionButton.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.formExtRedirectFieldEmpty) {
      this.toastr.error(this.translate.instant('widgets.constructor.formExtId.redirectError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else if (this.widget.useCustomIntegrationsList && !this.widget.integrations.length) {
      this.toastr.error(this.translate.instant('widgets.constructor.integration.saveError'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else {
      this.widget.jsInfo.onShowScript.script = this.widget.jsInfo.onShowScript.script || null;
      this.widget.jsInfo.onTargetScript.script = this.widget.jsInfo.onTargetScript.script || null;
      const widgetUpdatedData = {
        guiprops: this.widget.guiprops,
        autoinvite: this.widget.autoinvite,
        autoresponder: this.widget.autoresponder,
        restrictions: this.widget.restrictions,
        rules: this.widget.rules,
        audiencesEnabled: this.widget.audiencesEnabled,
        sendCrm: this.widget.sendCrm,
        coupons: this.couponsId,
        integrations: this.widget.integrations,
        useCustomIntegrationsList: this.widget.useCustomIntegrationsList,
        customFields: this.customFields,
        jsInfo: this.widget.jsInfo
      } as FullWidget;

      this.widgetService.updateWidget(this.sid, this.wid, widgetUpdatedData).subscribe((response: boolean) => {
        if (response) {
          this.toastr.success(this.translate.instant('widgetsList.editor.save.done.desc', this.translate.instant('widgetsList.editor.save.done.title')));
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      });
    }
  }

  private addCouponsId() {
    this.couponsErrorFlag = false;
    this.couponsId = [];
    if (this.isItExitCallbackCoupon(this.widget.guiprops.exit)) {
      if (this.widget.guiprops.exit.couponCallback.coupon.coupon.id) {
        this.couponsId.push(this.widget.guiprops.exit.couponCallback.coupon.coupon.id);
      } else {
        this.couponsErrorFlag = true;
      }
    }

    if (this.isItSocialCallbackCoupon(this.widget.guiprops.social)) {
      if (this.widget.guiprops.social.couponCallback.coupon.coupon.id) {
        this.couponsId.push(this.widget.guiprops.social.couponCallback.coupon.coupon.id);
      } else {
        this.couponsErrorFlag = true;
      }
    }

    if (this.isItFormCallbackCoupon(this.widget.guiprops.form)) {
      if (this.widget.guiprops.form.couponCallback.coupon.coupon.id) {
        this.couponsId.push(this.widget.guiprops.form.couponCallback.coupon.coupon.id);
      } else {
        this.couponsErrorFlag = true;
      }
    }

    this.widget.guiprops.elementsList.forEach((item) => {
      if (item.name && item.name === 'coupon-element') {
        if (item.coupon.id) {
          this.couponsId.push(item.coupon.id);
        } else {
          this.couponsErrorFlag = true;
        }
      }
    });
  }

  private isItExitCallbackCoupon(_) {
    return (_.enable || (_.button && _.button.enable)) && _.couponCallback && _.couponCallback.enable;
  }

  private isItSocialCallbackCoupon(_) {
    return _.couponCallback && _.couponCallback.enable;
  }

  private isItFormCallbackCoupon(_) {
    return _.enable && _.couponCallback && _.couponCallback.enable;
  }

  private mapFormExtFieldId() {
    this.formExtIdsErrorFlag = false;
    this.formExtNeedButton = false;
    this.formExtRedirectFieldEmpty = false;
    this.formExtIdsCached = [];
    this.customFields = [];
    const listOfBodies = $('#collapseTwo').find('.form-ext-item');
    listOfBodies.each((index, item) => {
      $(item).removeClass('form-ext-item__alarm-class');
    });

    this.widget.guiprops.formExt.model.list.forEach((item, index) => {
      // Map identifier of elements in form
      if (WidgetConstructorDesignService.isItemMultiAndHasId(item.type)) {
        if (isFieldIdUnique(item.idField)) {
          const formExtEnumType = {
            text: 'TEXT',
            date: 'DATE',
            rating: 'RATING',
            dd: 'LISTBOX',
            variants: 'COMBOBOX'
          };

          this.customFields.push({
            id: item.id,
            integrationTag: item.idField,
            name: item.service || item.label,
            type: formExtEnumType[item.type]
          });
        } else {
          $(listOfBodies[index]).addClass('form-ext-item__alarm-class');
          this.formExtIdsErrorFlag = true;
        }
        this.formExtIdsCached.push(item.idField);
      }
    });

    formExtRedirectFieldEmpty = $scope.widget.guiprops.formExt.model.list.some(function(item) {
      return isButtonRedirectAndEmpty(item);
    });

    let isFormHasSendIfActionFLAG;
    let isFormHasInputsFLAG = $scope.widget.guiprops.formExt.model.list.some(function(item) {
      return WidgetConstructorDesignService.isFormHasInputs(item);
    });

    let isFormHasSpecElementsFLAG = $scope.widget.guiprops.formExt.model.list.some(function(item) {
      return isFormHasSpecElements(item);
    });

    if (isFormHasSpecElementsFLAG) {
      isFormHasSendIfActionFLAG = $scope.widget.guiprops.formExt.model.list.some(function(item) {
        return isFormHasSendIfAction(item);
      });
    }

    let isFormHasActionButtonFLAG = $scope.widget.guiprops.formExt.model.list.some(function(item) {
      return isFormHasButtonWithAction(item);
    });

    let ifFormHasSpecWithoutActionORNot = (typeof isFormHasSendIfActionFLAG !== 'undefined' && !isFormHasSendIfActionFLAG) || typeof isFormHasSendIfActionFLAG === 'undefined';
    formExtNeedButton = isFormHasInputsFLAG && ifFormHasSpecWithoutActionORNot && !isFormHasActionButtonFLAG;
  }

  private runValidators() {
    let errorsList = [];
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    return errorsList;
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

}

