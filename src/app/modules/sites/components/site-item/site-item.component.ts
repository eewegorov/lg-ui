import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  asapScheduler,
  asyncScheduler,
  BehaviorSubject,
  fromEvent,
  Observable,
  of,
  Subject,
  Subscription,
  SubscriptionLike
} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment-timezone';
import { TariffsService } from '@core/services/tariffs.service';
import { SitesService } from '../../services/sites.service';
import { Site, SiteStatistics } from '@core/models/sites';
import { UiService } from '@core/services/ui.service';
import { Breakpoint } from '@core/enums/ui/breakpoint';
import { debounceTime, delay, observeOn, skip, startWith, switchMap, take, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-site-item',
  templateUrl: './site-item.component.html',
  styleUrls: ['./site-item.component.scss'],
  providers: [DatePipe]
})
export class SiteItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public item: Site & {
    isFree: boolean;
    tariffExpTime: string;
    tariffExpLeftMs: number;
    hasCrmSyncErrors: boolean;
    hasMailSyncErrors: boolean;
  };
  @Input() public timezone = '';
  @Input() private index: number;

  public readonly isLoading$: BehaviorSubject<boolean>;
  public readonly height$: Subject<string>;
  public readonly uiBreakpoint$: Observable<Breakpoint>;
  public readonly breakpoint = Breakpoint;

  public actionsStatsWeekCount: number;
  public leadsStatsWeekCount: number;
  public mailStatsWeekCount: number;
  public data = [];
  public colors;
  public labels;
  public options;
  public isStatisticsLoaded = false;

  private readonly sub: Subscription;

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly datePipe: DatePipe,
    private readonly tariffsService: TariffsService,
    private readonly sitesService: SitesService,
    private readonly uiService: UiService,
    private readonly element: ElementRef
  ) {
    this.isLoading$ = new BehaviorSubject<boolean>(true);
    this.height$ = new Subject<string>();
    this.uiBreakpoint$ = this.uiService.uiBreakpoint$;
    this.sub = new Subscription();
    this.options = {
      elements: {
        line: {
          fill: false
        }
      },
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
  }

  ngOnInit(): void {
    $(window).on('resize scroll', () => {
      if (this.isScrolledIntoView() && !this.isStatisticsLoaded) {
        this.loadStatistics();
      }
    });

    if ((this.index === 0 || this.index === 1 || this.index === 2) && !this.isStatisticsLoaded) {
      this.loadStatistics();
    }
  }

  public goToSiteSettings() {
    this.router.navigate(['/site/settings/' + this.item.id]);
  }

  public improvePlan() {
    this.tariffsService.checkTariffPlans(
      this.item.id,
      this.translate.instant('sitelist.tariff.improvement'),
      undefined,
      this.item.name
    );
  }

  private isScrolledIntoView() {
    if (!$(`#${this.item.id}`).length) {
      return;
    }

    const docViewTop = $(window).scrollTop();
    const docViewBottom = docViewTop + $(window).height();

    const elemTop = $(`#${this.item.id}`).offset().top;
    const elemBottom = elemTop + $(`#${this.item.id}`).height();

    return elemBottom <= docViewBottom && elemTop >= docViewTop;
  }

  private loadStatistics(): void {
    this.isStatisticsLoaded = true;

    const sub: SubscriptionLike = this.sitesService
      .getSiteStatistics(this.item.id)
      .subscribe((statistics: SiteStatistics[]) => {
        this.labels = this.getSiteDates(statistics);
        this.colors = [
          this.setChartSettings('rgba(255,182,6, 1)'),
          this.setChartSettings('rgba(52,152,219, 1)'),
          this.setChartSettings('rgba(215, 96, 44, 1)')
        ];
        this.data = [
          this.getStatsValues(statistics, 'actions'),
          this.getStatsValues(statistics, 'leads'),
          this.getStatsValues(statistics, 'emails')
        ];
        this.actionsStatsWeekCount = this.getAmountStats(statistics, 'actions');
        this.leadsStatsWeekCount = this.getAmountStats(statistics, 'leads');
        this.mailStatsWeekCount = this.getAmountStats(statistics, 'emails');
        this.item.isFree = this.sitesService.isSiteHasExpTariff(this.item);
        this.item.tariffExpTime = this.datePipe.transform(this.item.tariffExp, 'dd.MM.yyyy');
        this.item.tariffExpLeftMs = this.item.tariffExp - new Date().getTime();

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
        this.isLoading$.next(false);
      });
    this.sub.add(sub);
  }

  private getSiteDates(data) {
    return data.map(item => {
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

  private watchLoadingState(): void {
    const sub: SubscriptionLike = of(null)
      .pipe(
        observeOn(asyncScheduler),
        delay(100),
        take(1),
        switchMap(() => {
          return fromEvent<Event>(window, 'resize').pipe(
            startWith(null),
            debounceTime(50),
            withLatestFrom(this.uiBreakpoint$)
          );
        })
      )
      .subscribe(([event, breakpoint]: [Event, Breakpoint]) => {
        if (breakpoint >= Breakpoint.XL) {
          const height: number = this.element.nativeElement.querySelector('.site').getBoundingClientRect().height;
          this.height$.next(`height: ${height}px`);
        } else {
          this.height$.next(`height: auto`);
        }
      });
    this.sub.add(sub);
  }

  ngAfterViewInit(): void {
    this.watchLoadingState();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
