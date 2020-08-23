import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CrmService } from '../services/crm.service';
import { Lead, Periods } from '../../../core/models/crm';
import { UserService } from '../../user/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { User } from '../../../core/models/user';
import { SiteShort } from '../../../core/models/sites';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, OnDestroy {
  @ViewChild('p') popover: NgbPopover;
  public innerWidth: number;
  public item = {
    widgetName: 'fsdf',
    date: '1231231',
    state: 'sdfsf',
    status: 'asdasda'
  };
  public periodStart: Date;
  public periodEnd: Date;
  public periodType = 'WEEK';

  public allSites = [];
  public states = [];
  public sitesIds = [];
  public statesIds = [];
  private ALL_SITE_ID = '0000000000000000';
  private ONE_DAY = 86400000;
  private filterTimeout: ReturnType<typeof setTimeout>;
  private limitOptions = [{value: 10}, {value: 25}, {value: 50}, {value: 100}];
  private searchParams = {
    offset: 0,
    limit: this.limitOptions[1]
  };
  private initTables = false;
  private sortingDesc = true;
  private leads = [];
  private defaultName;
  private defaultExtraName;
  private userId;
  private isNotificationEnable = false;
  private meInfoSub: SubscriptionLike;

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService,
    private userService: UserService,
    private siteService,
    private crmService: CrmService
  ) {
  }

  ngOnInit(): void {
    this.translate.get('crm.page.filter.sites.all').subscribe((translation: string) => {
      this.allSites = [{
        id: this.ALL_SITE_ID,
        name: translation
      }, {
        "id": "5f120a7646e0fb00012c2632",
        "name": "mysecondsite",
        "url": "secondsecond.ru",
        "tariffName": "Пробный",
        "tariffExp": 1595881841107,
        "trial": false
      }, {
        "id": "5f120a5446e0fb0001d8c981",
        "name": "mysupermegasite",
        "url": "mysupermegasite.com",
        "tariffName": "Пробный",
        "tariffExp": 1595881811225,
        "trial": true
      }];
      this.sitesIds = [this.ALL_SITE_ID];
      this.states = this.crmService.getStates();
      this.initStats();
    });
    this.translate.get('crm.page.table.extra.default').subscribe((translation: string) => {
      this.defaultName = translation;
    });

    this.translate.get('crm.page.table.extra.widget').subscribe((translation: string) => {
      this.defaultExtraName = translation;
    });
    this.changePeriod(this.periodType);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

  private initStats() {
    this.meInfoSub = this.userService.getMeInfo().subscribe((response: User) => {
      this.userId = response.id;
      this.getSites();
    });
  }

  private getSites() {
    const notificationOffCookie = this.cookieService.get('lgwg-notification-off');
    this.allSites = [];
    this.siteService.getSitesShort().then((response: SiteShort[]) => {
      this.allSites = response;
      this.siteService.setSiteList(response);

      if (notificationOffCookie !== this.userId && this.isTrialSites(response)) {
        this.isNotificationEnable = true;
      }
    });
  }

  private isTrialSites(sites: SiteShort[]): boolean {
    return sites.some((item) => {
      return item.trial;
    });
  }

  public showYesterdayDate() {
    const yesterday = new Date(this.getToday().getTime() - this.ONE_DAY)
    return this.periodType === "YESTERDAY" ? yesterday : this.periodEnd;
  }

  public changePeriod(value: string) {
    if (value === Periods.TODAY) {
      this.periodStart = new Date();
      this.periodStart.setHours(0,0,0,0);
      this.periodEnd = new Date(this.getToday().getTime());
    } else if (value === Periods.YESTERDAY) {
      this.periodEnd = new Date(this.getToday().getTime() - 2*this.ONE_DAY);
      this.periodEnd.setHours(23,59,59,999);
      this.periodStart = new Date(this.getToday().getTime() - this.ONE_DAY);
    } else if (value === Periods.DECADE) {
      this.periodStart = new Date(this.getToday().getTime() - 10*this.ONE_DAY);
      this.periodEnd = new Date(this.getToday().getTime());
    } else if (value === Periods.WEEK) {
      this.periodStart = new Date(this.getToday().getTime() - 7*this.ONE_DAY);
      this.periodEnd = new Date(this.getToday().getTime());
    } else if (value === Periods.MONTH) {
      this.periodStart = new Date(this.getToday().getTime() - 30*this.ONE_DAY);
      this.periodEnd = new Date(this.getToday().getTime());
    }

    this.timeoutFiltering(false);
  }

  private getToday(): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  public periodApply() {
    const prevPeriodType = this.periodType;
    this.periodType = "USER";
    this.popover.close();
    if (prevPeriodType === "USER") {
      this.changePeriod("USER");
    }
  }

  public checkFilters(newValue) {
    if (newValue.id === this.ALL_SITE_ID) {
      this.sitesIds = [this.ALL_SITE_ID];
    } else {
      this.sitesIds = this.sitesIds.filter(item => item !== this.ALL_SITE_ID);
    }
  }

  public timeoutFiltering(useCurrentOffset: boolean) {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      if (!useCurrentOffset) {
        this.searchParams.offset = 0;
      }
      this.getLeads();
    }, 50);
  }

  private getLeads() {
    this.initTables = false;
    const params = {
      orders: this.sortingDesc ? '-date' : 'date',
      limit: this.searchParams.limit.value,
      offset: this.searchParams.offset,
      dateFrom: this.getUNIXTime(this.periodStart),
      dateTo: this.getUNIXTime(this.getTomorrowCopyDate(this.periodEnd)),
      siteId: '',
      state: ''
    };
    if (this.sitesIds.length && this.sitesIds[0] !== this.ALL_SITE_ID) {
      params.siteId = this.sitesIds.join(',');
    }
    if (this.statesIds.length && this.statesIds[0] !== this.ALL_SITE_ID) {
      params.state = this.statesIds.join(',');
    }

    this.crmService.getLeadList(params).pipe(
      timeout(500)
    ).subscribe((response: Lead[]) => {
      this.leads = response.map((item: Lead) => {
        item.state = this.setStatusByState(item.state);
        item.widgetName = this.setExtraName(item.widgetName);
        return item;
      });
      this.initTables = true;
    });
  }

  private setStatusByState(state) {
    if (state === 'NEW') {
      return this.translate.instant('crm.page.card.status.new');
    } else if (state === 'INWORK') {
      return this.translate.instant('crm.page.card.status.onWork');
    } else if (state === 'INVALID') {
      return this.translate.instant('crm.page.card.status.bad');
    } else if (state === 'SUCCESS') {
      return this.translate.instant('crm.page.card.status.success');
    }
  }

  private setExtraName(name) {
    if (!name) {
      return this.defaultName + ' ' + this.defaultExtraName;
    } else if (name === this.defaultName) {
      return name + ' ' + this.defaultExtraName;
    } else {
      return name;
    }
  }

  private getTomorrowCopyDate(date: Date): Date {
    let tomorrowDate = new Date(date.valueOf());
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return tomorrowDate;
  }

  private getUNIXTime(time) {
    return moment(time).unix() * 1000;
  }

  ngOnDestroy(): void {
    if (this.meInfoSub) {
      this.meInfoSub.unsubscribe();
    }
  }

}
