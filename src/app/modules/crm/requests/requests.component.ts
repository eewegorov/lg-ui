import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CrmService } from '../services/crm.service';
import { Lead } from '../../../core/models/crm';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  public item = {
    widgetName: 'fsdf',
    date: '1231231',
    state: 'sdfsf',
    status: 'asdasda'
  };
  public periodStart;
  private periodEnd;
  public allSites = [];
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

  constructor(
    private translate: TranslateService,
    private crmService: CrmService
  ) { }

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
    });
    this.translate.get('сrm.page.table.extra.default').subscribe((translation: string) => {
      this.defaultName = translation;
    });

    this.translate.get('сrm.page.table.extra').subscribe((translation: string) => {
      this.defaultExtraName = translation;
    });

  }

  public showYesterdayDate() {

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
      return this.translate.instant('сrm.page.card.status.new');
    } else if (state === 'INWORK') {
      return this.translate.instant('сrm.page.card.status.onWork');
    } else if (state === 'INVALID') {
      return this.translate.instant('сrm.page.card.status.bad');
    } else if (state === 'SUCCESS') {
      return this.translate.instant('сrm.page.card.status.success');
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

  private getTomorrowCopyDate(date) {
    let tomorrowDate = date;
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return tomorrowDate;
  }

  private getUNIXTime(time) {
    return moment(time).unix() * 1000;
  }

}
