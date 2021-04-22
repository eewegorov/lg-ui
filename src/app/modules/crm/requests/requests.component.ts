import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { SiteShort } from '../../../core/models/sites';
import { Lead, LeadRequest, Periods, StateWithIndex } from '../../../core/models/crm';
import { UserService } from '../../user/services/user.service';
import { SitesService } from '../../sites/services/sites.service';
import { CrmService } from '../services/crm.service';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, OnDestroy {
  @ViewChild('p') popover: NgbPopover;
  public innerWidth: number;
  public periodStart: Date;
  public periodEnd: Date;
  public periodType = 'WEEK';
  public allSites = [];
  public allWidgets = [];
  public states = [];
  public sitesIds = [];
  public widgetsIds = [];
  public statesIds = [];
  public leads: Lead[] = [{
    id: '4b7e89b0b224669bcb5f1bf53d2bf71a',
    title: 'Test lead 1',
    widgetName: 'This is my custom widget',
    siteId: '27b7f32bd10521503acc2b38d3e5b640',
    siteName: 'U1 site 1',
    siteUrl: 'http://u1s1.com',
    pageUrl: 'http://u1s1.com/test',
    state: 'NEW',
    date: 1263161699000,
    comment: 'Comment is missing'
  }, {
    id: '4b7e34535345669bcb5f1bf53d2bf71a',
    title: 'Test lead 2',
    widgetName: 'This is my better widget',
    siteId: '27b7f3sdfsf521503acc2b38d3e5b640',
    siteName: 'U1 site 2',
    siteUrl: 'http://u2s2.com',
    pageUrl: 'http://u2s2.com/test',
    state: 'NEW',
    date: 1263171799000,
    comment: 'Comment is commented'
  }];
  private ALL_SITE_ID = '0000000000000000';
  private ONE_DAY = 86400000;
  private filterTimeout: ReturnType<typeof setTimeout>;
  public limitOptions = [{value: 10}, {value: 25}, {value: 50}, {value: 100}];
  public searchParams = {
    offset: 0,
    limit: this.limitOptions[1]
  };
  public initTables = false;
  public sortingDesc = true;

  private defaultName;
  private defaultExtraName;
  private userId;
  public isNotificationEnable = false;
  public currentOpenedRow = null;
  private meInfoSub: SubscriptionLike;
  private updateLeadInfo: SubscriptionLike;

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService,
    private userService: UserService,
    private sitesService: SitesService,
    private crmService: CrmService
  ) {
  }

  ngOnInit(): void {
    this.initStats();
    this.changePeriod(this.periodType);
    this.translate.get('crm.page.filter.states.all').subscribe((translation: string) => {
      this.states = [{
        id: this.ALL_SITE_ID,
        name: translation
      }];
      this.statesIds = [this.ALL_SITE_ID];
      this.states = this.states.concat(this.crmService.getStates());
    });
    this.translate.get('crm.page.table.extra.default').subscribe((translation: string) => {
      this.defaultName = translation;
    });
    this.translate.get('crm.page.table.extra.widget').subscribe((translation: string) => {
      this.defaultExtraName = translation;
    });
    this.updateLeadInfo = this.crmService.updateLeadInfo.subscribe((response: StateWithIndex) => {
      if (!response) return;
      this.leads[response.index].state = response.state;
      this.leads[response.index].status = this.setStatusByState(response.state);
    });
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

  private initStats() {
    /*this.meInfoSub = this.userService.getMeInfo().subscribe((response: User) => {
      this.userId = response.id;*/
      this.getSites();
      this.getFilters();
    /*});*/
  }

  private getSites() {
    const notificationOffCookie = this.cookieService.get('lgwg-notification-off');
    this.translate.get('crm.page.filter.sites').subscribe((translation: string) => {
      this.allSites = [{
        id: this.ALL_SITE_ID,
        name: translation
      }];
      this.sitesIds = [this.ALL_SITE_ID];
      /*this.sitesService.getSitesShort().subscribe((response: SiteShort[]) => {*/
      const response = [{
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
      }]; // удалить статику и раскомментировать подписку
        this.sitesService.sites = response;
        if (notificationOffCookie !== this.userId && this.isTrialSites(response)) {
          this.isNotificationEnable = true;
        }
      /*});*/
    });
  }

  private getFilters() {
    this.translate.get('crm.page.filter.widgets.all').subscribe((translation: string) => {
      this.allWidgets = [{
        id: this.ALL_SITE_ID,
        name: translation
      }];
      this.widgetsIds = [this.ALL_SITE_ID];
      /*this.crmService.getSitesFilters().subscribe((response: LeadWidgets[]) => {*/
      const response = [{
        "id": "8424d5434e646da8bea2af85cd425d37",
        "name": "This is another site",
        "widgets": [
          {
            "id": "ec51425b57722d47d4d086c07ca2bea4",
            "name": "Site 2 Widget 2"
          }
        ]
      },
        {
          "id": "cd5a8465ca12cc69d603317fe463e377",
          "name": "Yet another site",
          "widgets": [
            {
              "id": "68aae9e38a885a9f9023e5f16affe05b",
              "name": "Ambulance widget"
            },
            {
              "id": "cc98a926cbf246b375d2bb508e396492",
              "name": "This is widget 1"
            }
          ]
        }]; // удалить статику и раскомментировать подписку

      this.allSites = this.allSites.concat(response);
      response.forEach(site =>
        site.widgets.forEach(widget => this.allWidgets.push(widget))
      );
      /*});*/
    });
  }

  private isTrialSites(sites: SiteShort[]): boolean {
    return sites.some((item) => {
      return item.trial;
    });
  }

  public changePeriod(value: string) {
    if (value === Periods.TODAY) {
      this.periodStart = new Date();
      this.periodStart.setHours(0, 0, 0, 0);
      this.periodEnd = new Date(this.getToday().getTime());
    } else if (value === Periods.YESTERDAY) {
      this.periodEnd = new Date(this.getToday().getTime() - this.ONE_DAY);
      this.periodEnd.setHours(23, 59, 59, 999);
      this.periodStart = new Date(this.getToday().getTime() - this.ONE_DAY);
    } else if (value === Periods.DECADE) {
      this.periodStart = new Date(this.getToday().getTime() - 10 * this.ONE_DAY);
      this.periodEnd = new Date(this.getToday().getTime());
    } else if (value === Periods.WEEK) {
      this.periodStart = new Date(this.getToday().getTime() - 7 * this.ONE_DAY);
      this.periodEnd = new Date(this.getToday().getTime());
    } else if (value === Periods.MONTH) {
      this.periodStart = new Date(this.getToday().getTime() - 30 * this.ONE_DAY);
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

  public checkFilters(newValue, type: 'sites' | 'widgets' | 'states'): void {
    if (newValue.id === this.ALL_SITE_ID) {
      if (type === 'sites') {
        this.sitesIds = [this.ALL_SITE_ID];
      } else if (type === 'widgets') {
        this.widgetsIds = [this.ALL_SITE_ID];
      } else if (type === 'states') {
        this.statesIds = [this.ALL_SITE_ID];
      }
    } else {
      if (type === 'sites') {
        this.sitesIds = this.sitesIds.filter(item => item !== this.ALL_SITE_ID);
      } else if (type === 'widgets') {
        this.widgetsIds = this.widgetsIds.filter(item => item !== this.ALL_SITE_ID);
      } else if (type === 'states') {
        this.statesIds = this.statesIds.filter(item => item !== this.ALL_SITE_ID);
      }
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

  public notificationCookieSet() {
    this.cookieService.set('lgwg-notification-off', this.userId, 5200);
    this.isNotificationEnable = false;
  }

  public changeDateSorting() {
    this.sortingDesc = !this.sortingDesc;
    this.timeoutFiltering(true);
  }

  public openLeadInfo(lead: Lead, index: number) {
    /*this.crmService.getLeadById(lead.id).subscribe((response: LeadById) => {
      if (response) {*/
    const response = {
      "id": "5cde635badbf9c72acf266a8",
      "title": "Hat request",
      "firstName": "Sergey",
      "lastName": "Kolivanov","phones": [
        "+7(985) 665-89-89"
      ],
      "emails": [
        "sergey@kolivanov.ru"
      ],
      "comment": "Need call to client",
      "userComment": "I want buy this shit",
      "pageUrl": "http://site.com/shit",
      "pageTitle": "Hat as Product",
      "visitNo": 3,
      "ip": "0.0.0.0",
      "history": [
        {
          "title": "Hat as Product",
          "url": "http://site.com/shit",
          "serverDate": 1484032321000,
          "userDate": 1484032321000
        },
        {
          "title": "Hat store",
          "url": "http://site.com",
          "serverDate": 1484032320000,
          "userDate": 1484032320000
        }
      ],
      "state": "b73515bd1b78c4b545b1e9131e4509e4",
      "siteName": "Hat store",
      "siteUrl": "site.com",
      "createDate": 1484032321000,
      "widgetName": "Widget Hotpoint",
      "fieldsValues": [
        {
          "id": "1b1dfbb46232c26cdf1172239ebedbe6",
          "name": "Field1",
          "value": "value1"
        },
        {
          "id": "7f27c0dc041e2b0de33b6c63e4c2434e",
          "name": "Field2",
          "value": "value2"
        }
      ]
    };
        this.currentOpenedRow = index;
        this.crmService.openLeadInfoSidebar.next({ data: response, index: index });
    /*  }
    });*/
  };

  public prevList() {
    if (this.searchParams.offset === 0) return;
    this.searchParams.offset -= this.searchParams.limit.value;
    this.timeoutFiltering(true);
  }

  public nextList() {
    if (this.leads.length < this.searchParams.limit.value) return;
    this.searchParams.offset = this.searchParams.offset + this.searchParams.limit.value;
    this.timeoutFiltering(true);
  }

  private getLeads() {
    this.initTables = true;
    const params: LeadRequest = {
      orders: this.sortingDesc ? '-date' : 'date',
      limit: this.searchParams.limit.value,
      offset: this.searchParams.offset,
      dateFrom: this.getUNIXTime(this.periodStart),
      dateTo: this.getUNIXTime(this.getTomorrowCopyDate(this.periodEnd))
    };

    if (this.sitesIds.length && this.sitesIds[0] !== this.ALL_SITE_ID) {
      params.siteId = this.sitesIds.join(',');

      this.allWidgets = this.allWidgets.slice(0, 1);
      this.sitesIds.forEach(site => {
        const selectedSite = this.allSites.filter(siteWithWidget => siteWithWidget.id === site);
        selectedSite[0].widgets.forEach(widget => this.allWidgets.push(widget));
      });
    } else {
      this.allWidgets = this.allWidgets.slice(0, 1);
      this.allSites.slice(1).forEach(site =>
        site.widgets.forEach(widget => this.allWidgets.push(widget))
      );
    }

    if (this.statesIds.length && this.statesIds[0] !== this.ALL_SITE_ID) {
      params.state = this.statesIds.join(',');
    }

    if (this.widgetsIds.length && this.widgetsIds[0] !== this.ALL_SITE_ID) {
      params.widgetName = this.widgetsIds.join(",");
    }

    this.crmService.getLeadList(params).pipe(
      timeout(500)
    ).subscribe((response: Lead[]) => {
      this.leads = response.map((item: Lead) => {
        item.status = this.setStatusByState(item.state);
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
    const tomorrowDate = new Date(date.valueOf());
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
    if (this.updateLeadInfo) {
      this.updateLeadInfo.unsubscribe();
    }
  }
}
