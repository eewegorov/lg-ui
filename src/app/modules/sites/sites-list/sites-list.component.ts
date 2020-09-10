import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment-timezone';
import { BillingService } from '../../../core/services/billing.service';

@Component({
  selector: 'app-sites-list',
  templateUrl: './sites-list.component.html',
  styleUrls: ['./sites-list.component.scss'],
  providers: [DatePipe]
})
export class SitesListComponent implements OnInit {
  @Input() public item;
  @Input() public timezone = '';
  public actionsStatsWeekCount: number;
  public leadsStatsWeekCount: number;
  public mailStatsWeekCount: number;
  public data = [];
  public colors;
  public labels;
  public options;
  private exptime;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private billingService: BillingService
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
    this.exptime = this.item.tariffExp;
    this.labels = this.getSiteDates(this.item.actions);
    this.colors = [this.setChartSettings('rgba(255,182,6, 1)'), this.setChartSettings('rgba(52,152,219, 1)'), this.setChartSettings('rgba(215, 96, 44, 1)')];
    this.data = [this.getStatsValues(this.item.actions), this.getStatsValues(this.item.leads), this.getStatsValues(this.item.emails)];
    this.actionsStatsWeekCount = this.getAmountStats(this.item.actions);
    this.leadsStatsWeekCount = this.getAmountStats(this.item.leads);
    this.mailStatsWeekCount = this.getAmountStats(this.item.emails);
  }

  ngOnInit(): void {
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
  }

  public goToSiteSettings() {
    this.router.navigate(['/site/settings/' + this.item.id]);
  }

  public improvePlan() {
    this.billingService.checkTariffPlans(this.item.id, this.translate.instant('sitelist.tariff.improvement'), undefined, this.item.name);
  }

  private getSiteDates(data) {
    return data.map((item) => {
      return this.datePipe.transform(moment.tz(item.date, this.timezone).format(), 'dd.MM');
    });
  }

  private setChartSettings(color) {
    return { pointBackgroundColor: color, borderColor: color, fill: false };
  }

  private getStatsValues(data) {
    return data.map((item) => {
      return item.value;
    });
  }

  private getAmountStats(data) {
    let total = 0;
    data.forEach((item) => {
      total += item.value;
    });
    return total;
  }

  private removeGraphFromChart(index) {
    this.colors.splice(index, 1);
    this.data.splice(index, 1);
  }

}
