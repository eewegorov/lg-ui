import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { EmailsService } from '../services/emails.service';
import { EmailsStatistics } from '../../../core/models/emails';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit {
  public allSites = [];
  public sitesIds = [];
  public item = {
    id: '213131',
    name: 'qwasfasf',
    email: 'aaa@aaa.com'
  };
  public periodStart;
  public periodEnd;
  public overallStats = {
    allCount: 2131,
    periodCount: 112,
    periodAvg: 110
  };
  public site = {
    name: 'asdad',
    count: 2
  }
  private ALL_SITE_ID = '0000000000000000';
  private filterTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private translate: TranslateService,
    private emailsService: EmailsService
  ) { }

  ngOnInit(): void {
    this.translate.get('crm.page.filter.sites.all').subscribe((translation: string) => {
      this.allSites = [{
        id: this.ALL_SITE_ID,
        name: translation
      }];
    });
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

  public doReloadData(requestSites) {
    $(".reports-emails-preloader-main").show();
    var params = {
      start: this.getISOTime(this.periodStart),
      end: this.getISOTime(this.getTomorrowCopyDate(this.periodEnd)),
      siteIds: ''
    };
    if (requestSites.length && requestSites[0] !== this.ALL_SITE_ID) {
      params.siteIds = requestSites.join(",");
    }

    this.getSiteEmails(params.siteIds);

    this.emailsService.getEmailStatistic(params).subscribe((response: EmailsStatistics[]) => {
      let mailStatistics = [];
      response.forEach((stat: EmailsStatistics) => {
        let count = 0;
        for(let key in stat.items) {
          count += stat.items[key];
        }
        mailStatistics.push({date: stat.date, value: count});
      });
      var orderBy = $filter('orderBy');
      mailStatistics = orderBy(mailStatistics, 'date');

      reloadChart(mailStatistics);
      $(".reports-emails-preloader-main").hide();
    });
  }

  private getSiteEmails(sites) {
    var params = {};
    if (sites) {
      params.siteId = sites;
    }

    ReportsEmailService.getEmailList(params).then(function(response) {
      if (response.meta) {
        $scope.overallStats.allCount = response.meta.count;
      }
    });
  }

  private getISOTime(time) {
    return moment(time).format("YYYY-MM-DD");
  }

  private getTomorrowCopyDate(date: Date): Date {
    let tomorrowDate = new Date(date.valueOf());
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return tomorrowDate;
  }

}
