import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { cloneDeep } from 'lodash-es';
import * as moment from 'moment';
import { SiteShort } from '@core/models/sites';
import { Coupon } from '@core/models/coupons';
import { User } from '@core/models/user';
import { FullWidget, MockupGroup, WidgetType } from '@core/models/widgets';
import { TariffsService } from '@core/services/tariffs.service';
import { CoreSitesService } from '@core/services/core-sites.service';
import { SitesService } from '@modules/sites/services/sites.service';
import { CouponService } from '@modules/coupons/services/coupon.service';
import { UserService } from '@modules/user/services/user.service';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';
import { WidgetConstructorService } from '../../services/widget-constructor.service';
import { ConstructorDesignComponent } from '../../components/constructor/constructor-design/constructor-design.component';
import { ConstructorRulesComponent } from '../../components/constructor/constructor-rules/constructor-rules.component';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['../../shared/shared.scss', './widget-edit.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WidgetEditComponent implements OnInit, OnDestroy {
  public widget = {} as FullWidget;
  public oldWidget = {} as FullWidget;
  /*public isDesigner = false;*/
  /*public isMockup = false;*/
  public sid: string;
  public wid: string;
  public isPayment = false;
  public isContainerized: boolean;
  public currentActiveTab = 'design';
  public coupons = [];
  public isLoading = false;
  public SP_widget = {} as any;
  public showErrors = false;

  @ViewChild(ConstructorDesignComponent) constructorDesignComponent: ConstructorDesignComponent;
  @ViewChild(ConstructorDesignComponent) constructorRulesComponent: ConstructorRulesComponent;
  private couponsErrorFlag = false;
  private couponsId = [];
  private customFields = [];
  private formExtIdsCached = [];
  private catsList = [];
  private formExtIdsErrorFlag = false;
  private formExtNeedButton = false;
  private formExtRedirectFieldEmpty = false;
  private defaultCoupon = { id: null, name: 'Какой купон хотите использовать?' };
  private meInfoSub: SubscriptionLike;
  private paymentSub: SubscriptionLike;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService,
    private tariffsService: TariffsService,
    private coreSitesService: CoreSitesService,
    private sitesService: SitesService,
    private couponService: CouponService,
    private userService: UserService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService,
    private widgetConstructorService: WidgetConstructorService
  ) {}

  ngOnInit(): void {
    this.sid = this.route.snapshot.paramMap.get('id').split('-')[0];
    this.wid = this.route.snapshot.paramMap.get('id').split('-')[1];

    this.initTypes();

    this.meInfoSub = this.userService.user$.subscribe((response: User) => {
      /*if (response.roles.includes(UserRole.ROLE_DESIGNER)) {
        this.isDesigner = true;
      }

      if (response.roles.includes(UserRole.ROLE_ADMIN)) {
        this.isMockup = true;
      }*/

      this.loadWidget();
    });

    this.loadGroups();

    ($('[data-toggle="tooltip"]') as any).tooltip('hide');

    this.paymentSub = this.widgetService.onChangePayment.subscribe((value: boolean) => {
      this.onChangePayment(value);
    });

    this.couponService.updateCouponsList.subscribe(() => {
      this.getCoupons();
    });

    this.widgetConstructorService.updateWidget.subscribe(() => {
      this.widget = { ...this.widget };
    });

    this.widgetConstructorService.formExtIdFieldFocusOut.subscribe(() => {
      this.formExtIdsErrorFlag = false;
      const listOfBodies = $('#collapseTwo').find('.form-ext-item');
      listOfBodies.each((index, item) => {
        $(item).removeClass('form-ext-item__alarm-class');
      });
    });
  }

  public onChangePayment(value) {
    const val = value || typeof value === 'undefined';

    if (val && !this.isPayment) {
      setTimeout(() => {
        if (this.widget.rules.pageNo) {
          this.widget.rules.pageNo.enable = false;
        }

        if (this.widget.rules.prevPages) {
          this.widget.rules.prevPages.enable = false;
        }

        if (this.widget.rules.time) {
          this.widget.rules.time.enable = false;
        }

        if (this.widget.rules.days) {
          this.widget.rules.days.enable = false;
        }

        if (this.widget.rules.period) {
          this.widget.rules.period.enable = false;
        }

        if (this.widget.autoinvite.pages) {
          this.widget.autoinvite.pages.enable = false;
        }

        if (this.widget.autoinvite.inactive) {
          this.widget.autoinvite.inactive.enabled = false;
        }

        if (this.widget.autoinvite.percent) {
          this.widget.autoinvite.percent.enable = false;
        }

        this.widget.audiencesEnabled = false;

        if (this.widget.restrictions.target) {
          this.widget.restrictions.target.mode = 1;
        }

        if (this.widget.restrictions.count) {
          this.widget.restrictions.count.enable = false;
        }

        if (this.widget.restrictions.action) {
          this.widget.restrictions.action.enable = false;
        }

        if (this.widget.guiprops.form.couponCallback) {
          this.widget.guiprops.form.couponCallback.enable = false;
        }

        if (this.widget.guiprops.formExt.couponCallback) {
          this.widget.guiprops.formExt.couponCallback.enable = false;
        }

        if (this.widget.guiprops.exit.couponCallback) {
          this.widget.guiprops.exit.couponCallback.enable = false;
        }

        if (this.widget.guiprops.social.couponCallback) {
          this.widget.guiprops.social.couponCallback.enable = false;
        }

        if (this.widget.jsInfo) {
          this.widget.jsInfo.enablePlaceholding = false;
        }

        this.showPaymentDialog(this.sid, this.translate.instant('widgetsList.payment.features'));
      }, 0);
    }
  }

  public isCurrentActiveTab(tab) {
    return this.currentActiveTab === tab;
  }

  public setActiveTab(newTab) {
    this.currentActiveTab = newTab;
  }

  public isTabHasError(tabId) {
    this.mapFormExtFieldId();
    const errors = this.runValidators();
    for (const item of errors) {
      if (typeof item !== 'undefined' && item.id === tabId) {
        return true;
      }
    }

    return false;
  }

  public runValidators() {
    let errorsList = [];
    this.widgetService.validators.forEach(item => {
      errorsList = errorsList.concat(item.call(this));
    });

    return errorsList;
  }

  public isTabHasErrorForFormExt() {
    return this.formExtIdsErrorFlag || this.formExtNeedButton || this.formExtRedirectFieldEmpty;
  }

  public validateFormExtElements(): string {
    let error = '';
    this.widget.guiprops.formExt?.model?.list?.forEach(element => {
      if (element.placeholder === '') {
        error = 'Не заполнено поле placeholder';
      }

      if (element.service === '') {
        error = 'Не заполнено служебное название поля';
      }

      if (element.idField === '') {
        error = 'Не заполнено ID поля';
      }

      if (element.type === 'hidden' && element.fieldType?.type === 'custom_parameter' && !element.customParamValue) {
        error = 'Не заполнен пользовательский параметр в URL';
      }

      if (element.type === 'hidden' && element.fieldType?.type === 'cookie' && !element.cookieValue) {
        error = 'Не заполнено название кукис';
      }

      if (element.type === 'hidden' && element.fieldType?.type === 'user_value' && !element.customUserValue) {
        error = 'Не заполнено пользовательское значение';
      }
    });

    return error;
  }

  public mapFormExtFieldId() {
    if (!this.widget.guiprops.formExt) {
      return;
    }

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
            variants: 'COMBOBOX',
            hidden: 'HIDDEN'
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

    this.formExtRedirectFieldEmpty = this.widget.guiprops.formExt.model.list.some(item => {
      return this.isButtonRedirectAndEmpty(item);
    });

    let isFormHasSendIfActionFLAG;
    const isFormHasInputsFLAG = this.widget.guiprops.formExt.model.list.some(item => {
      return this.widgetConstructorService.isFormHasInputs(item);
    });

    const isFormHasSpecElementsFLAG = this.widget.guiprops.formExt.model.list.some(item => {
      return this.isFormHasSpecElements(item);
    });

    if (isFormHasSpecElementsFLAG) {
      isFormHasSendIfActionFLAG = this.widget.guiprops.formExt.model.list.some(item => {
        return this.isFormHasSendIfAction(item);
      });
    }

    const isFormHasActionButtonFLAG = this.widget.guiprops.formExt.model.list.some(item => {
      return this.isFormHasButtonWithAction(item);
    });

    const ifFormHasSpecWithoutActionORNot =
      (typeof isFormHasSendIfActionFLAG !== 'undefined' && !isFormHasSendIfActionFLAG) ||
      typeof isFormHasSendIfActionFLAG === 'undefined';
    this.formExtNeedButton = isFormHasInputsFLAG && ifFormHasSpecWithoutActionORNot && !isFormHasActionButtonFLAG;
  }

  public isButtonRedirectAndEmpty(item) {
    return (
      item.type === 'button' && (item.redirect.type.type === 1 || item.redirect.type.type === 3) && !item.redirect.url
    );
  }

  /*private saveMockupItem() {
    const errorsList = this.runValidators();
    this.isLoading = true;

    if (errorsList.length !== 0) {
      this.toastr.error(
        errorsList.length === 1 && errorsList[0].message ? errorsList[0].message : this.translate.instant('widgetsList.editor.save.validation.desc'),
        this.translate.instant('widgetsList.editor.save.validation.title')
      );
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
  }*/

  public isFormHasSpecElements(item) {
    return item.type === 'rating' || item.type === 'dd' || item.type === 'variants';
  }

  public isFormHasSendIfAction(item) {
    return (
      (item.type === 'rating' && item.sendFormIfAction) ||
      (item.type === 'dd' && item.sendFormIfAction) ||
      (item.type === 'variants' && item.sendFormIfAction)
    );
  }

  public isFormHasButtonWithAction(item) {
    return item.type === 'button' && (item.redirect.type.type === 0 || item.redirect.type.type === 1);
  }

  public isFieldIdUnique(id) {
    return (
      id !== 'email' && id !== 'name' && id !== 'message' && id !== 'phone' && this.formExtIdsCached.indexOf(id) === -1
    );
  }

  public saveWidget() {
    this.showErrors = true;

    /*if (this.isMockup) {
      this.saveMockupItem();
    } else {
      this.saveWidgetItem();
    }*/

    this.saveWidgetItem();
  }

  private saveWidgetItem() {
    this.widget.guiprops.dhVisual.lastModifiedDate = new Date().toString();
    this.widget.guiprops.dhVisual.widget_width_all = this.SP_widget.widget_width_all;
    this.widget.guiprops.dhVisual.widget_height_all = this.SP_widget.widget_height_all;
    this.widget.guiprops.dhVisual.widget_width_nopx = this.SP_widget.widget_width_nopx;
    this.widget.guiprops.dhVisual.widget_height_nopx = this.SP_widget.widget_height_nopx;
    this.widget.guiprops.dhVisual.widget_ul_width_nopx = this.SP_widget.widget_ul_width_nopx;
    this.widget.guiprops.dhVisual.CP_width = this.SP_widget.widget_CP_width;
    this.widget.guiprops.dhVisual.CP_offset_top = this.SP_widget.widget_CP_offset_top;
    this.widget.guiprops.image.width = this.SP_widget.img_width;
    this.widget.guiprops.image.height = this.SP_widget.img_height;
    this.widget.rules.period.startDate = moment(this.widget.rules.period.startDate).format('DD.MM.YYYY');
    this.widget.rules.period.endDate = moment(this.widget.rules.period.endDate).format('DD.MM.YYYY');

    this.addCouponsId();
    this.mapFormExtFieldId();

    const errorsList = this.runValidators();
    this.isLoading = true;

    if (this.couponsErrorFlag) {
      this.toastr.error(
        this.translate.instant('widgets.coupon.saveError'),
        this.translate.instant('widgetsList.editor.save.validation.title')
      );
      this.isLoading = false;
    } else if (this.formExtIdsErrorFlag) {
      this.toastr.error(
        this.translate.instant('widgets.formExtId.saveError'),
        this.translate.instant('widgetsList.editor.save.validation.title')
      );
      this.isLoading = false;
    } else if (this.formExtNeedButton) {
      this.toastr.error(
        this.translate.instant('widgets.formExtId.actionButton.saveError'),
        this.translate.instant('widgetsList.editor.save.validation.title')
      );
      this.isLoading = false;
    } else if (this.formExtRedirectFieldEmpty) {
      this.toastr.error(
        this.translate.instant('widgets.formExtId.redirectError'),
        this.translate.instant('widgetsList.editor.save.validation.title')
      );
      this.isLoading = false;
    } else if (errorsList.length !== 0) {
      this.toastr.error(
        errorsList.length === 1 && errorsList[0].message
          ? errorsList[0].message
          : this.translate.instant('widgetsList.editor.save.validation.desc'),
        this.translate.instant('widgetsList.editor.save.validation.title')
      );
      this.isLoading = false;
    } else {
      this.widget.jsInfo.onShowScript.script = this.widget.jsInfo.onShowScript.script || null;
      this.widget.jsInfo.onTargetScript.script = this.widget.jsInfo.onTargetScript.script || null;
      const widgetUpdatedData = {
        audience: this.widget.audience,
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
          this.toastr.success(
            this.translate.instant('widgetsList.editor.save.done.desc'),
            this.translate.instant('widgetsList.editor.save.done.title')
          );

          this.oldWidget = cloneDeep(this.widget);
          this.showErrors = false;
        } else {
          this.toastr.error(
            errorsList.length === 1 && errorsList[0].message
              ? errorsList[0].message
              : this.translate.instant('widgetsList.editor.save.check'),
            this.translate.instant('widgetsList.editor.save.validation.title')
          );
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

    this.widget.guiprops.elementsList.forEach(item => {
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

  private initTypes() {
    this.widgetService.getWidgetsTypes().subscribe((response: WidgetType[]) => {
      this.initSites();
      this.widgetService.setCurrentWidgetsTypes(response);
    });
  }

  private initSites() {
    this.sitesService.getSites().subscribe((response: SiteShort[]) => {
      this.getCoupons();
      if (response) {
        this.coreSitesService.sites = response;
        this.isPayment = !this.sitesService.isSiteHasExpTariff(this.coreSitesService.getSiteById(this.sid));
      }
    });
  }

  private getCoupons() {
    if (!this.widget?.guiprops) {
      return;
    }

    $('.coupons-flex-wr').addClass('loading-coupons');
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

        this.widget.guiprops.elementsList.forEach(item => {
          if (item.name && item.name === 'coupon-element') {
            if (item.coupon.id) {
              this.checkCouponsCallback(item);
            }
          }
        });

        $('.coupons-flex-wr').removeClass('loading-coupons');
      }
    });
  }

  /*private loadMockup() {
    this.widgetService.getMockup(this.wid).subscribe((data: MockupShort) => {
      this.widget = data as unknown as FullWidget;
      this.checkWidgetRenameTitle();
      this.widgetService.loadWidgetToController.next();
    },
      () => this.router.navigate(['/widgets/'])
    );
  }*/

  private checkCouponsCallback(callbackModel) {
    const isItExist = this.coupons.find(coupon => {
      return coupon.id === callbackModel.coupon.id;
    });
    if (!isItExist) {
      callbackModel.coupon = { ...this.defaultCoupon };
    }
  }

  private loadWidget() {
    this.widgetService.getWidgetById(this.sid, this.wid).subscribe(
      (response: FullWidget) => {
        this.widget = response;

        setTimeout(() => {
          this.oldWidget = cloneDeep(response);
        }, 3000);

        if (this.widget) {
          this.widget.id = this.wid;
        }
        this.isContainerized = !!this.widget?.containerId;
        this.widgetService.loadWidgetToController.next();
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
    this.tariffsService.checkTariffPlans(
      siteId,
      this.translate.instant('sitelist.tariff.improve'),
      description,
      this.coreSitesService.getSiteById(siteId).name
    );
  }

  ngOnDestroy(): void {
    if (this.meInfoSub) {
      this.meInfoSub.unsubscribe();
    }

    if (this.paymentSub) {
      this.paymentSub.unsubscribe();
    }
  }
}
