import { AfterViewChecked, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Periods } from '@core/models/crm';
import { SiteShort } from '@core/models/sites';
import { Email, EmailsStatistics, EmailsStatisticsView } from '@core/models/emails';
import { OrderByPipe } from '@shared/pipes/order-by.pipe';
import { UtilsService } from '@core/services/utils.service';
import { SitesService } from '@modules/sites/services/sites.service';
import { EmailsService } from '../../services/emails.service';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit, AfterViewChecked {
  @ViewChild('p') popover: NgbPopover;
  public innerWidth: number;
  public allSites = [];
  public allSitesStats = [];
  public lastEmails = [];
  public sitesIds = [];
  public periodStart: Date;
  public periodEnd: Date;
  public periodType = 'WEEK';
  public overallStats = {
    allCount: 0,
    periodCount: 0,
    periodAvg: 0
  };
  public data = [];
  public colors;
  public labels;
  public options = {
    tooltipCaretSize: 0,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: value => {
              if (value % 1 === 0) {
                return value;
              }
            }
          }
        }
      ]
    }
  };
  private ALL_SITE_ID = '0000000000000000';
  private ONE_DAY = 86400000;
  private filterTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private orderBy: OrderByPipe,
    private utilsService: UtilsService,
    private sitesService: SitesService,
    private emailsService: EmailsService
  ) {}

  ngOnInit(): void {
    this.changePeriod(this.periodType);
    this.getSites();
    this.getEmails();
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
  }

  public periodApply() {
    const prevPeriodType = this.periodType;
    this.periodType = 'USER';
    this.popover.close();
    if (prevPeriodType === 'USER') {
      this.changePeriod('USER');
    }
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

  public clearStats() {
    Swal.fire({
      title: this.translate.instant('reports.emails.clear.title'),
      text: this.translate.instant('reports.emails.clear.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('reports.emails.clear.yes'),
      cancelButtonText: this.translate.instant('global.no')
    }).then(isConfirm => {
      if (isConfirm) {
        const params = {
          start: this.getISOTime(this.periodStart),
          end: this.getISOTime(this.getTomorrowCopyDate(this.periodEnd)),
          siteIds: ''
        };
        if (this.sitesIds.length && this.sitesIds[0] !== this.ALL_SITE_ID) {
          params.siteIds = this.sitesIds.join(',');
        }
        this.emailsService.clearEmail(params).subscribe((response: boolean) => {
          if (response) {
            this.timeoutFiltering();
            this.getEmails();
            this.getBestSites();
            this.toastr.success(
              this.translate.instant('reports.emails.clear.done.desc'),
              this.translate.instant('global.done')
            );
          }
        });
      }
    });
  }

  public trackById(index, item) {
    return item.id;
  }

  public downloadCsv(startPeriod?, endPeriod?, sites = this.sitesIds) {
    const params = { siteIds: '', dateFrom: '', dateTo: '' };
    if (sites.length && sites[0] !== this.ALL_SITE_ID) {
      params.siteIds = sites.join(',');
    }
    if (startPeriod && endPeriod) {
      params.dateFrom = startPeriod.getTime();
      params.dateTo = endPeriod.getTime();
    }
    this.emailsService.downloadEmailList(params).subscribe(response => {
      if (response) {
        const blob = new Blob([response], { type: 'text/csv;charset=UTF-8' });
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.download = 'email_subscribers.csv';
        document.body.appendChild(link);
        link.click();
      }
    });
  }

  public getTomorrowCopyDate(date: Date): Date {
    const tomorrowDate = new Date(date.valueOf());
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return tomorrowDate;
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

  private getSites() {
    this.translate.get('crm.page.filter.sites').subscribe((translation: string) => {
      this.allSites = [
        {
          id: this.ALL_SITE_ID,
          name: translation
        }
      ];
      this.sitesIds = [this.ALL_SITE_ID];
      this.sitesService.getSites().subscribe((response: SiteShort[]) => {
        this.allSites = this.allSites.concat(response);
        this.getBestSites();
      });
    });
  }

  private getEmails() {
    this.lastEmails = [];
    this.emailsService.getEmailList({ limit: 5, orders: '-date' }).subscribe((response: Email[]) => {
      if (response.length) {
        response.forEach((item: Email) => {
          this.utilsService.useGravatarIfExists(item.email).subscribe(responseGravatar => {
            if (responseGravatar) {
              item.gravatarUrl = responseGravatar;
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
    const params = {
      start: this.getISOTime(this.periodStart),
      end: this.getISOTime(this.getTomorrowCopyDate(this.periodEnd))
    };

    this.emailsService.getEmailStatistic(params).subscribe((response: EmailsStatistics[]) => {
      this.allSitesStats = this.allSites.slice(1).map(site => {
        return { id: site.id, count: 0, name: site.name };
      });

      response.forEach((stat: EmailsStatistics) => {
        // eslint-disable-next-line guard-for-in
        for (const key in stat.items) {
          this.allSitesStats.forEach(item => {
            if (item.id === key) {
              item.count += stat.items[key];
            }
          });
        }
      });
      setTimeout(() => {
        $('.reports-emails-preloader-best').hide();
      }, 0);
    });
  }

  private doReloadData(requestSites) {
    setTimeout(() => {
      $('.reports-emails-preloader-main').show();
    }, 0);
    const params = {
      start: this.getISOTime(this.periodStart),
      end: this.getISOTime(this.getTomorrowCopyDate(this.periodEnd)),
      siteIds: ''
    };
    if (requestSites.length && requestSites[0] !== this.ALL_SITE_ID) {
      params.siteIds = requestSites.join(',');
    }

    this.getSiteEmailsCount(params.siteIds);
    this.getEmailStatistics(params);
  }

  private getSiteEmailsCount(sites) {
    const params = { siteId: '' };
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
        // eslint-disable-next-line guard-for-in
        for (const key in stat.items) {
          count += stat.items[key];
        }
        mailStatistics.push({ date: stat.date, value: count });
      });
      mailStatistics = this.orderBy.transform(mailStatistics, ['date']);
      this.reloadChart(mailStatistics);

      setTimeout(() => {
        $('.reports-emails-preloader-main').hide();
      }, 0);
    });
  }

  private reloadChart(statistics: EmailsStatisticsView[]) {
    let labels = [];
    let data = [];
    let days = 0;

    this.overallStats.periodCount = 0;
    this.overallStats.periodAvg = 0;

    let ts = this.periodStart.getTime();
    while (ts <= this.periodEnd.getTime()) {
      const dd = new Date(ts);
      const date = this.getDDMMYYTime(dd);
      const item = this.getByDate(statistics, date);
      const value = item !== null ? item.value : 0;
      labels.push(date);
      data.push(value);
      days++;
      this.overallStats.periodCount += value;
      ts += this.ONE_DAY;
    }
    this.overallStats.periodAvg = this.overallStats.periodCount / days;

    if (days > 40) {
      const mData = {};
      for (let i = 0; i < days; i++) {
        const monthLabel = labels[i].substring(labels[i].indexOf('.') + 1);
        if (mData[monthLabel] === undefined) {
          mData[monthLabel] = 0;
        }
        mData[monthLabel] = mData[monthLabel] + data[i];
      }

      labels = Object.keys(mData);
      data = [];

      labels.forEach(item => {
        data.push(mData[item]);
      });
    } else if (labels.length < 7) {
      while (labels.length < 7) {
        labels.unshift('');
        labels.push('');
        data.unshift(0);
        data.push(0);
      }
    }

    this.colors = [this.setChartSettings('rgba(52,152,219, 1)')];
    this.labels = labels;
    this.data = [data];
  }

  private getByDate(list: EmailsStatisticsView[], search: string): EmailsStatisticsView {
    for (const item of list) {
      if (this.getDDMMYYTime(item.date) === search) {
        return item;
      }
    }
    return null;
  }

  private getISOTime(time: Date): string {
    return moment(time).format('YYYY-MM-DD');
  }

  private getDDMMYYTime(time: Date | number): string {
    return moment(time).format('DD.MM.YY');
  }

  private setChartSettings(color: string) {
    return { pointBackgroundColor: color, borderColor: color, fill: false };
  }
}
