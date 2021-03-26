import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FullWidget, MockupGroup, MockupShort, WidgetInfo, WidgetType } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';
import { SitesService } from '../../../sites/services/sites.service';
import { SiteShort } from '../../../../core/models/sites';
import { CouponService } from '../../../coupons/services/coupon.service';
import { Coupon } from '../../../../core/models/coupons';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../core/models/user';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit, OnDestroy {
  public weekDays = [];
  public renamedWidget = { id: '', name: '' };
  public widget: WidgetInfo;
  public isDesigner = false;
  public isMockup = false;
  public sid: string;
  public wid: string;
  public isContainerized: boolean;
  public currentActiveTab = 'design';
  
  private validators = [];
  private types = [];
  private coupons = [];
  private audiences = [];
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

  private checkWidgetRenameTitle() {
    ($('#renameWidgetBtn') as any).tooltip('destroy');
    if (this.widget.name.length > 35) {
      ($('#renameWidgetBtn') as any).attr('title', this.widget.name);
      ($('#renameWidgetBtn') as any).tooltip();
    }
  }

  private runValidators() {
    let errorsList = [];
    this.validators.forEach(item => {
      errorsList = errorsList.concat(item.call(this));
    });

    return errorsList;
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
      this.widget = data as unknown as WidgetInfo;
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
      this.widget = response as unknown as WidgetInfo;
      this.audiences = response.audience;
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

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
