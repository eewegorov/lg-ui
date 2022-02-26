import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment-timezone';
import { TariffsService } from '../../../core/services/tariffs.service';
import { SitesService } from '../services/sites.service';
import { Site, SiteStatistics } from '../../../core/models/sites';

@Component({
  selector: 'app-sites-list',
  templateUrl: './sites-list.component.html',
  styleUrls: ['./sites-list.component.scss'],
  providers: [DatePipe]
})
export class SitesListComponent implements OnInit, OnDestroy {
  @Input() public item: Site & { isFree: boolean; tariffExpTime: string; tariffExpLeftMs: number;
    hasCrmSyncErrors: boolean; hasMailSyncErrors: boolean; };
  @Input() public timezone = '';
  public actionsStatsWeekCount: number;
  public leadsStatsWeekCount: number;
  public mailStatsWeekCount: number;
  public data = [];
  public colors;
  public labels;
  public options;
  public isLoading = true;

  private siteStatisticsSub: SubscriptionLike;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private tariffsService: TariffsService,
    private sitesService: SitesService
  ) {
    this.options = {
      elements: {
        line: {
          fill: false
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: (value) => { if (value % 1 === 0) { return value; }}
          }
        }]
      }
    };
  }

  ngOnInit(): void {
    this.siteStatisticsSub = this.sitesService.getSiteStatistics(this.item.id).subscribe((statistics: SiteStatistics[]) => {
      this.isLoading = false;
      this.labels = this.getSiteDates(statistics);
      this.colors = [this.setChartSettings('rgba(255,182,6, 1)'), this.setChartSettings('rgba(52,152,219, 1)'), this.setChartSettings('rgba(215, 96, 44, 1)')];
      this.data = [this.getStatsValues(statistics, 'actions'), this.getStatsValues(statistics, 'leads'), this.getStatsValues(statistics, 'emails')];
      this.actionsStatsWeekCount = this.getAmountStats(statistics, 'actions');
      this.leadsStatsWeekCount = this.getAmountStats(statistics, 'leads');
      this.mailStatsWeekCount = this.getAmountStats(statistics, 'emails');
      this.item.isFree = this.sitesService.isSiteHasExpTariff(this.item);
      this.item.tariffExpTime = this.datePipe.transform(this.item.tariffExp, 'dd.MM.yyyy');
      this.item.tariffExpLeftMs = this.item.tariffExp - (new Date()).getTime();

      if (this.actionsStatsWeekCount === 0) {
        this.removeGraphFromChart(0);
      }
      if (this.leadsStatsWeekCount === 0) {
        this.removeGraphFromChart(this.colors.length - 2);
      }
      if (this.mailStatsWeekCount === 0) {
        this.removeGraphFromChart(this.colors.length - 1);
      }

      // Default state of chart
      if (this.actionsStatsWeekCount === 0 && this.leadsStatsWeekCount === 0 && this.mailStatsWeekCount === 0) {
        this.data = [1, 2, 3, 4, 5, 5, 5];
        this.colors = [this.setChartSettings('rgba(0,0,0,0)')];
        this.options = {
          elements: {
            line: {
              fill: false,
              borderColor: 'rgba(0,0,0,0)'
            },
            point: {
              radius: 0
            }
          }
        };
      }
    });
  }

  public goToSiteSettings() {
    this.router.navigate(['/site/settings/' + this.item.id]);
  }

  public improvePlan() {
    this.tariffsService.checkTariffPlans(
      this.item.id,
      this.translate.instant('sitelist.tariff.improvement'),
      undefined,
      this.item.name);
  }

  private getSiteDates(data) {
    return data.map((item) => {
      return this.datePipe.transform(moment.tz(item.date, this.timezone).format(), 'dd.MM');
    });
  }

  private setChartSettings(color) {
    return { pointBackgroundColor: color, borderColor: color, fill: false };
  }

  private getStatsValues(data: SiteStatistics[], property: 'actions' | 'emails' | 'leads'): number[] {
    return data.map((item: SiteStatistics) => {
      return item[property];
    });
  }

  private getAmountStats(data: SiteStatistics[], property: 'actions' | 'emails' | 'leads'): number {
    let total = 0;
    data.forEach((item: SiteStatistics) => {
      total += item[property];
    });
    return total;
  }

  private removeGraphFromChart(index) {
    this.colors.splice(index, 1);
    this.data.splice(index, 1);
  }

  ngOnDestroy(): void {
    if (this.siteStatisticsSub) {
      this.siteStatisticsSub.unsubscribe();
    }
  }

}
