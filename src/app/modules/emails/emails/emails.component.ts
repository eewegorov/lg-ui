import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { OrderByPipe } from '../../../shared/pipes/order-by.pipe';
import { EmailsService } from '../services/emails.service';
import { Email, EmailsStatistics, EmailsStatisticsView } from '../../../core/models/emails';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Periods } from '../../../core/models/crm';
import { SitesService } from '../../sites/services/sites.service';
import { SiteShort } from '../../../core/models/sites';
import { UtilsService } from '../../../core/services/utils.service';


@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit {
  @ViewChild('p') popover: NgbPopover;
  public innerWidth: number;
  public allSites = [];
  public allSitesStats = [];
  public lastEmails = [];
  public sitesIds = [];
  public periodStart;
  public periodEnd;
  public periodType = 'WEEK';
  public overallStats = {
    allCount: 2131,
    periodCount: 112,
    periodAvg: 110
  };
  public site = {
    name: 'asdad',
    count: 2
  }
  public colors;
  public labels;
  public data;
  public options;
  private ALL_SITE_ID = '0000000000000000';
  private ONE_DAY = 86400000;
  private filterTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private translate: TranslateService,
    private orderBy: OrderByPipe,
    private utilsService: UtilsService,
    private sitesService: SitesService,
    private emailsService: EmailsService
  ) { }

  ngOnInit(): void {
    this.translate.get('crm.page.filter.sites.all').subscribe((translation: string) => {
      this.allSites = [{
        id: this.ALL_SITE_ID,
        name: translation
      }];
      this.initStats();
    });
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

  public periodApply() {
    const prevPeriodType = this.periodType;
    this.periodType = "USER";
    this.popover.close();
    if (prevPeriodType === "USER") {
      this.changePeriod("USER");
    }
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
    if (this.allSites && this.allSites.length) {
      this.getBestSites();
    }
    this.timeoutFiltering();
  }

  public checkFilters(newValue): void {
    if (newValue.id === this.ALL_SITE_ID) {
      this.sitesIds = [this.ALL_SITE_ID];
    } else {
      this.sitesIds = this.sitesIds.filter(item => item !== this.ALL_SITE_ID);
    }
  }

  public timeoutFiltering() {
    const requestSites = this.sitesIds;
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.doReloadData(requestSites);
    }, 50);
  }

  public trackById(index, item) {
    return item.id;
  }

  private initStats() {
    this.sitesIds = [this.ALL_SITE_ID];
    this.getSites();
    this.getEmails();
  }

  private getSites() {
    this.allSites = [];
    this.sitesService.getSitesShort().subscribe((response: SiteShort[]) => {
      this.allSites = response;
      this.getBestSites();
    });
  }

  private getEmails() {
    this.lastEmails = [];
    this.emailsService.getEmailList({ limit: 5, orders: '-date' }).subscribe((response: Email[]) => {
      if (response.length) {
        response.forEach((item: Email) => {
          this.utilsService.useGravatarIfExists(item.email).subscribe((response) => {
            if (response) {
              item.gravatarUrl = response;
            }
            this.lastEmails.push(item);
          });
        });
      }
    });
  }

  private getToday(): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  private getBestSites() {
    this.allSitesStats = [];
    let params = {
      start: this.getISOTime(this.periodStart),
      end: this.getISOTime(this.getTomorrowCopyDate(this.periodEnd))
    };

    this.emailsService.getEmailStatistic(params).subscribe((response: EmailsStatistics[]) => {
      this.allSitesStats = this.allSites.map((site) => {
        return { id: site.id, count: 0, name: site.name };
      });
      response.forEach((stat: EmailsStatistics) => {
        for(let key in stat.items) {
          this.allSitesStats.forEach((item) => {
            if (item.id === key) {
              item.count += stat.items[key];
            }
          });
        }
      });
      $('.reports-emails-preloader-best').hide();
    });
  }

  private doReloadData(requestSites) {
    $('.reports-emails-preloader-main').show();
    var params = {
      start: this.getISOTime(this.periodStart),
      end: this.getISOTime(this.getTomorrowCopyDate(this.periodEnd)),
      siteIds: ''
    };
    if (requestSites.length && requestSites[0] !== this.ALL_SITE_ID) {
      params.siteIds = requestSites.join(",");
    }

    this.getSiteEmailsCount(params.siteIds);
    this.getEmailStatistics(params);
  }

  private getSiteEmailsCount(sites) {
    let params = { siteId: '' };
    if (sites) {
      params.siteId = sites;
    }
    this.emailsService.getEmailListCount(params).subscribe((response: number) => {
      this.overallStats.allCount = response;
    });
  }

  private getEmailStatistics(params) {
    this.emailsService.getEmailStatistic(params).subscribe((response: EmailsStatistics[]) => {
      let mailStatistics: EmailsStatisticsView[] = [];
      response.forEach((stat: EmailsStatistics) => {
        let count = 0;
        for(let key in stat.items) {
          count += stat.items[key];
        }
        mailStatistics.push({ date: stat.date, value: count });
      });
      mailStatistics = this.orderBy.transform(mailStatistics, ['date']);
      this.reloadChart(mailStatistics);
      $('.reports-emails-preloader-main').hide();
    });
  }

  private reloadChart(statistics: EmailsStatisticsView[]) {
    let labels = [];
    let data = [];
    let days = 0;

    this.overallStats.periodCount = 0;
    this.overallStats.periodAvg   = 0;

    let ts = this.periodStart.getTime();
    while (ts <= this.periodEnd.getTime()) {
      let dd = new Date(ts);
      let date = this.getDDMMYYTime(dd);
      let item = this.getByDate(statistics, date);
      let value = (item !== null) ? item.value : 0;
      labels.push(date);
      data.push(value);
      days++;
      this.overallStats.periodCount += value;
      ts += this.ONE_DAY;
    }
    this.overallStats.periodAvg = this.overallStats.periodCount / days;

    if (days > 40) {
      let mData = {};
      for (var i = 0; i < days; i++) {
        var monthLabel = labels[i].substring(labels[i].indexOf('.') + 1);
        if (mData[monthLabel] === undefined) {
          mData[monthLabel] = 0;
        }
        mData[monthLabel] = mData[monthLabel] + data[i];
      }

      labels = Object.keys(mData);
      data = [];
      for (let j = 0; j < labels.length; j++) {
        data.push(mData[labels[j]]);
      }
    } else if (labels.length < 7) {
      while (labels.length < 7) {
        labels.unshift("");
        labels.push("");
        data.unshift(0);
        data.push(0);
      }
    }

    this.colors = [this.setChartSettings('rgba(52,152,219, 1)')];
    this.labels = labels;
    this.data = [data];
    this.options = {
      tooltipCaretSize: 0,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value) {if (value % 1 === 0) {return value;}}
          }
        }]
      }
    };
  }

  private getByDate(list: EmailsStatisticsView[], search: string): EmailsStatisticsView {
    for (var i = 0; i < list.length; i++) {
      if (this.getDDMMYYTime(list[i].date) === search) {
        return list[i];
      }
    }
    return null;
  }

  private getISOTime(time: Date): string {
    return moment(time).format("YYYY-MM-DD");
  }

  private getDDMMYYTime(time: Date | number): string {
    return moment(time).format("DD.MM.YY");
  }

  private getTomorrowCopyDate(date: Date): Date {
    let tomorrowDate = new Date(date.valueOf());
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return tomorrowDate;
  }

  private setChartSettings(color: string) {
    return { pointBackgroundColor: color, borderColor: color, fill: false };
  }

}
