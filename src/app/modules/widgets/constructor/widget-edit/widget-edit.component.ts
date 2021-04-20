import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  Audience,
  FullWidget,
  MockupGroup,
  MockupShort,
  WidgetType
} from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';
import { SitesService } from '../../../sites/services/sites.service';
import { SiteShort } from '../../../../core/models/sites';
import { CouponService } from '../../../coupons/services/coupon.service';
import { Coupon } from '../../../../core/models/coupons';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../core/models/user';
import { UserService } from '../../../user/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit, OnDestroy {
  public weekDays = [];
  public renamedWidget = { id: '', name: '' };
  public widget: FullWidget;
  public isDesigner = false;
  public isMockup = false;
  public sid: string;
  public wid: string;
  public isPayment = false;
  public isContainerized: boolean;
  public currentActiveTab = 'design';
  public audience: Audience;
  public coupons = [];

  private validators = [];
  private types = [];
  private catsList = [];
  private formExtIdsErrorFlag = false;
  private formExtNeedButton = false;
  private formExtRedirectFieldEmpty = false;
  private defaultCoupon = { id: null, name: 'Какой купон хотите использовать?' };

  private meInfoSub: SubscriptionLike;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private userService: UserService,
    private couponService: CouponService,
    private sitesService: SitesService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService
  ) {
    this.weekDays = [
      { id: 0, name: this.translate.instant('global.week.monday') },
      { id: 1, name: this.translate.instant('global.week.tuesday') },
      { id: 2, name: this.translate.instant('global.week.wednesday') },
      { id: 3, name: this.translate.instant('global.week.thursday') },
      { id: 4, name: this.translate.instant('global.week.friday') },
      { id: 5, name: this.translate.instant('global.week.saturday') },
      { id: 6, name: this.translate.instant('global.week.sunday') }
    ];

    this.sid = this.route.snapshot.paramMap.get('id').split('-')[0];
    this.wid = this.route.snapshot.paramMap.get('id').split('-')[1];
    this.isPayment = !this.sitesService.isSiteHasExpTariff(this.sitesService.getSiteById(this.sid));
  }

  ngOnInit(): void {
    this.initTypes();

    this.meInfoSub = this.userService.getMeInfo().subscribe((response: User) => {
      if (response.roles.includes('ROLE_DESIGNER')) {
        this.isDesigner = true;
      }

      if (response.roles.includes('ROLE_ADMIN')) {
        this.isMockup = true;
        this.loadMockup();
      } else {
        this.loadWidget();
      }
    });

    this.loadGroups();

    ($('.start-widget-btn, .stop-widget-btn') as any).tooltip();

    this.widgetService.onChangePayment.subscribe((value: boolean) => {
      this.onChangePayment(value);
    });

    this.couponService.updateCouponsList.subscribe(() => {
      this.getCoupons();
    });
  }

  public onChangePayment(value) {
    const val = (value || typeof value === 'undefined');

    if (val && !this.isPayment) {
      setTimeout(() => {
        this.widget.rules.pageNo.enable = false;
        this.widget.rules.prevPages.enable = false;
        this.widget.rules.time.enable = false;
        this.widget.rules.days.enable = false;
        this.widget.rules.period.enable = false;
        this.widget.autoinvite.pages.enable = false;
        this.widget.autoinvite.inactive.enabled = false;
        this.widget.autoinvite.percent.enable = false;
        this.widget.audiencesEnabled = false;
        this.widget.restrictions.target.mode = 1;
        this.widget.restrictions.count.enable = false;
        this.widget.restrictions.action.enable = false;

        this.widget.guiprops.form.couponCallback.enable = false;
        this.widget.guiprops.exit.couponCallback.enable = false;
        this.widget.guiprops.social.couponCallback.enable = false;
        this.widget.jsInfo.enablePlaceholding = false;

        this.showPaymentDialog(this.sid, this.translate.instant('widgetsList.payment.features'));
      }, 1000);
    }
  }

  public startRenameWidget(widget) {
    this.renamedWidget = {
      id: widget.id,
      name: widget.name
    };
  }

  public getCroppedString(str: string, count: number, addedSymbol: string): string {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }
    return str;
  }

  public isCurrentActiveTab(tab) {
    return this.currentActiveTab === tab;
  }

  public setActiveTab(newTab) {
    this.currentActiveTab = newTab;
  }

  public isTabHasError(tabId) {
    const errors = this.runValidators();
    for (const item of errors) {
      if ((typeof item !== 'undefined') && item.id === tabId) {
        return true;
      }
    }

    return false;
  }

  public isTabHasErrorForFormExt() {
    return this.formExtIdsErrorFlag || this.formExtNeedButton || this.formExtRedirectFieldEmpty;
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

  public resetRenaming() {
    this.renamedWidget = {
      id: '',
      name: ''
    };
  }

  public renameWidget() {
    this.widget.name = this.renamedWidget.name;
    this.resetRenaming();
    this.checkWidgetRenameTitle();
    if (this.widget.containerId) {
      this.containerizedWidgetService.rename(this.sid, this.widget.id, this.widget.name);
    } else {
      this.widgetService.rename(this.sid, this.widget.id, this.widget.name);
    }
  }

  public saveWidget() {
    if (this.isMockup) {
      this.saveMockupItem();
    } else {
      this.saveWidgetItem();
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

  private checkWidgetRenameTitle() {
    ($('#renameWidgetBtn') as any).tooltip('destroy');
    if (this.widget.name.length > 35) {
      ($('#renameWidgetBtn') as any).attr('title', this.widget.name);
      ($('#renameWidgetBtn') as any).tooltip();
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

  private runValidators() {
    let errorsList = [];
    this.validators.forEach(item => {
      errorsList = errorsList.concat(item.call(this));
    });

    return errorsList;
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
      if (this.widgetConstructorService.isItemMultiAndHasId(item.type)) {
        if (this.isFieldIdUnique(item.idField)) {
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

    this.formExtRedirectFieldEmpty = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.isButtonRedirectAndEmpty(item);
    });

    let isFormHasSendIfActionFLAG;
    const isFormHasInputsFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.widgetConstructorService.isFormHasInputs(item);
    });

    const isFormHasSpecElementsFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.isFormHasSpecElements(item);
    });

    if (isFormHasSpecElementsFLAG) {
      isFormHasSendIfActionFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
        return this.isFormHasSendIfAction(item);
      });
    }

    const isFormHasActionButtonFLAG = this.widget.guiprops.formExt.model.list.some((item) => {
      return this.isFormHasButtonWithAction(item);
    });

    const ifFormHasSpecWithoutActionORNot = (typeof isFormHasSendIfActionFLAG !== 'undefined' && !isFormHasSendIfActionFLAG)
      || typeof isFormHasSendIfActionFLAG === 'undefined';
    this.formExtNeedButton = isFormHasInputsFLAG && ifFormHasSpecWithoutActionORNot && !isFormHasActionButtonFLAG;
  }

  private isButtonRedirectAndEmpty(item) {
    return item.type === 'button' && (item.redirect.type.type === 1 || item.redirect.type.type === 3) && !item.redirect.url;
  }

  private isFormHasSpecElements(item) {
    return item.type === 'rating' || item.type === 'dd' || item.type === 'variants';
  }

  private isFormHasSendIfAction(item) {
    return (item.type === 'rating' && item.sendFormIfAction) ||
      (item.type === 'dd' && item.sendFormIfAction) ||
      (item.type === 'variants' && item.sendFormIfAction);
  }

  private isFormHasButtonWithAction(item) {
    return item.type === 'button' && (item.redirect.type.type === 0 || item.redirect.type.type === 1);
  }

  private isFieldIdUnique(id) {
    return id !== 'email' && id !== 'name' && id !== 'message' && id !== 'phone' && this.formExtIdsCached.indexOf(id) === -1;
  }

  private initTypes() {
    this.widgetService.getWidgetsTypes().subscribe((response: WidgetType[]) => {
      this.initSites();
      this.types = response;
    });
  }

  private initSites() {
    this.sitesService.getSitesShort().subscribe((response: SiteShort[]) => {
      this.getCoupons();
      if (response) {
        this.sitesService.sites = response;
      }
    });
  }

  private getCoupons() {
    $('.widget-style-menu').addClass('loading-coupons');
    this.couponService.getCouponsList().subscribe((response: Coupon[]) => {
      if (response) {
        this.coupons = response;

        if (this.widget.guiprops.exit.couponCallback.coupon.coupon.id) {
          this.checkCouponsCallback(this.widget.guiprops.exit.couponCallback.coupon);
        }
        if (this.widget.guiprops.social.couponCallback.coupon.coupon.id) {
          this.checkCouponsCallback(this.widget.guiprops.social.couponCallback.coupon);
        }
        if (this.widget.guiprops.form.couponCallback.coupon.coupon.id) {
          this.checkCouponsCallback(this.widget.guiprops.form.couponCallback.coupon);
        }

        this.widget.guiprops.elementsList.forEach((item) => {
          if (item.name && item.name === 'coupon-element') {
            if (item.coupon.id) {
              this.checkCouponsCallback(item);
            }
          }
        });

        $('.widget-style-menu').removeClass('loading-coupons');
      }
    });
  }

  private checkCouponsCallback(callbackModel) {
    const isItExist = this.coupons.find((coupon) => {
      return coupon.id === callbackModel.coupon.id;
    });
    if (!isItExist) {
      callbackModel.coupon = { ...this.defaultCoupon };
    }
  }

  private loadMockup() {
    this.widgetService.getMockup(this.wid).subscribe((data: MockupShort) => {
      this.widget = data as unknown as FullWidget;
      this.widgetService.loadWidgetListeners.forEach(item => {
        item.call(this);
      });
      this.checkWidgetRenameTitle();
      this.widgetService.loadWidgetToController.next(data);
    },
      () => this.router.navigate(['/widgets/'])
    );
  }

  private loadWidget() {
    this.widgetService.getWidgetById(this.sid, this.wid).subscribe((response: FullWidget) => {
      this.widget = response as unknown as FullWidget;
      this.audience = response.audience;
      this.widget.id = this.wid;
      this.widgetService.loadWidgetListeners.forEach(item => {
        item.call(this);
      });
      this.isContainerized = !!this.widget.containerId;
      this.checkWidgetRenameTitle();
      this.widgetService.loadWidgetToController.next(response);
    },
      () => this.router.navigate(['/widgets/'])
    );
  }

  private loadGroups() {
    this.widgetService.getMockupGroups('').subscribe((response: MockupGroup[]) => {
      this.catsList = response;
    });
  }

  private showPaymentDialog(siteId, description) {
    /*window.siteTariffModal.find('h5.paymentSubscription').html(description);
    window.siteTariffModal.find('span.site-name').html($scope.siteName);
    window.siteTariffModal.attr('data-id', siteId);
    loadPlans();*/
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
