import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VariantAddComponent } from '../variant-add/variant-add.component';
import Swal from 'sweetalert2';
import { sortBy, unzip } from 'lodash';
import { WidgetTemplate } from '../../../core/models/widgets';
import { Abtest, NewVariant, Variant } from '../../../core/models/abtests';
import { BinsDataService } from '../services/bins-data.service';
import { SitesService } from '../../sites/services/sites.service';
import { WidgetService } from '../../widgets/services/widget.service';
import { ContainerizedWidgetService } from '../../widgets/services/containerized-widget.service';
import { AbtestsService } from '../services/abtests.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-abtests-active',
  templateUrl: './abtests-active.component.html',
  styleUrls: ['../shared/shared.scss', './abtests-active.component.scss']
})
export class AbtestsActiveComponent implements OnInit, AfterViewChecked {
  public currSite = '';
  public sites =  [{ id: 'allsitesid', name: 'Все сайты' }];
  public showWhat = 'ALL';
  public allABTests = [];
  public abTests = [];
  public isLoad = false;
  public showOnlyIfNoTestsForCurrentSite = false;
  public chartOptions = {
    tooltipCaretSize: 0,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: (value) => { if (value % 1 === 0) { return value; } }
        }
      }]
    }
  };
  private fixedTest;
  private updatedEarlier = false;
  private widgetTypes = [];
  private colorsArray = ['#34495e', '#9b59b6', '#3498db', '#62cb31', '#ffb606', '#e67e22', '#e74c3c',
    '#c0392b', '#58b62c', '#e43725', '#2a7aaf', '#7c4792', '#4ea227', '#b8651b',
    '#9a2e22', '#2a3a4b', '#ffeb3b'];
  private templates: WidgetTemplate[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private modalService: NgbModal,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private binsDataService: BinsDataService,
    private sitesService: SitesService,
    private abTestsService: AbtestsService
  ) { }

  ngOnInit(): void {
    /*this.widgetService.getWidgetsTemplates().subscribe((response: WidgetTemplate[]) => {*/
    const response =  [
      {
        "id": "11a2839e8952f5ad9d0455129bd0815c",
        "name": "Exit-intent",
        "preview":
          "http://static.leadgenic.com/images/asduaoidu21831.jpg",
        "type": "81f24bd19c6517ac723dbfe43a9614f9",
        "active": true
      },
      {
        "id": "836439eee8559825dcebbc1e2b7672e7",
        "name": "Popup",
        "preview": "http://static.leadgenic.com/images/22.jpg",
        "type": "c74e95e279ab6674838a11fac182ccce",
        "active": true
      },
      {
        "id": "5974c4b200f2060a8c3acc67ed17a6bb",
        "name": "Template 1",
        "preview": "http://static.leadgenic.com/images/31.jpg",
        "type": "c74e95e279ab6674838a11fac182ccce",
        "active": true
      }
    ];
      this.templates = response;
    /*});*/
    /*this.widgetService.getWidgetsTypes().subscribe((responseTypes: WidgetType[]) => {*/
    const responseTypes =  [
      {
        "id": "41546171c1119ffa9b64fa1bb81d5020",
        "name": "Another type",
        "description": "",
        "previewLink":
          "http://static.leadgenic.com/img/31spadx88210.jpg",
        "code": "anotherType",
        "static": false,
        "containerized": true
      },
      {
        "id": "24df1be21857f12573487da968c2fc3f",
        "name": "Other",
        "description": "",
        "previewLink":
          "http://static.leadgenic.com/img/dasdcz781313xc9z.jpg",
        "code": "other",
        "static": true,
        "containerized": false
      },
      {
        "id": "0bf813e40c9823e90f286775eb6b801c",
        "name": "Type 1",
        "description": "Type description",
        "previewLink":
          "http://static.leadgenic.com/img/ztyappqmyuv.jpg",
        "code": "type1",
        "static": true,
        "containerized": false
      }
    ];
      this.widgetTypes = responseTypes;
      this.initTests();
    /*});*/
    this.initSites();
  }

  ngAfterViewChecked(): void {
    (<any>$('[data-toggle="tooltip"]')).tooltip();
  }

  private initSites() {
    /*this.sitesService.getSitesShort().subscribe((response: SiteShort[]) => {*/
      const response = [{
        id: '5f120a7646e0fb00012c2632',
        name: 'mysecondsite',
        url: 'secondsecond.ru',
        tariffName: 'Пробный',
        tariffExp: 1595881841107,
        trial: false
      }, {
        id: '5f120a5446e0fb0001d8c981',
        name: 'mysupermegasite',
        url: 'mysupermegasite.com',
        tariffName: 'Пробный',
        tariffExp: 1595881811225,
        trial: true
      }]; // удалить статику и раскомментировать подписку
      this.sitesService.sites = response;
      this.sites = this.sites.concat(response);
      this.currSite = this.sites[0].id;
    /*});*/
  }

  private initTests() {
    /*this.abTestsService.getTests().subscribe((response: Abtest[]) => {*/
    const response = [{
        "id": "7f7f888d41b6c33ef1884db7c48a2d32",
        "name": "Another test",
        "description": "test description",
        "state": "ACTIVE",
        "type": "0bf813e40c9823e90f286775eb6b801c",
        "siteId": "9aafd4f7bd05ca810dea91985b7ace93"
      },
    {
      "id": "acd0411f5e83a8f476db619c87e85fe8",
      "name": "TEST2",
      "description": "",
      "state": "PAUSED",
      "type": "41546171c1119ffa9b64fa1bb81d5020",
      "siteId": "9aafd4f7bd05ca810dea91985b7ace93"
    }];
      this.allABTests = this.mapABTests(response);
      this.abTests = this.allABTests;
      const testsLength = this.abTests.length;
      this.getConversions(0, testsLength);
    /*});*/
  }

  private mapABTests(tests) {
    return tests.map((test) => {
      test.containerized = this.getCurrentType(test.type).containerized;
      return test;
    });
  }

  private getCurrentType(typeId) {
    return this.widgetTypes.find((type) => {
      return type.id === typeId;
    });
  }

  private getConversions(itemNumber: number, testsLength: number) {
    if (itemNumber < testsLength) {
     /* this.abTestsService.getConversion(this.abTests[itemNumber].id).subscribe((response: AbtestStatistics[]) => {*/
      const response =  [
        {
          "id": "1653271de635b9266ada2119bbdda452",
          "name": "ETALON",
          "conversions": [
            {
              "date": 1263081600000,
              "shows": 2,
              "target": 2
            }
          ],
          "active": true,
          "etalon": true
        },
        {
          "id": "949e75c2d25412efaadaab3fd42aec33",
          "name": "VARIANT",
          "conversions": [
            {
              "date": 1263254400000,
              "shows": 2,
              "target": 1
            }
          ],
          "active": false,
          "etalon": false
        }
      ];
        if (response) {
          this.abTests[itemNumber].variants = response;
          this.abTests[itemNumber].chartData = [];
          this.abTests[itemNumber].chartLabels = [];
          this.abTests[itemNumber].chartSeries = [];
          this.abTests[itemNumber].chartColors = [];
          this.abTests[itemNumber].variants.forEach((variant, i) => {
            this.addMoreDataToVariant(variant, i, this.abTests[itemNumber]);
          });
          this.getConversions(itemNumber + 1, testsLength);

          const dateArr = this.chartGetLegend(this.abTests[itemNumber].variants);

          if (dateArr) {
            const chartDataBuild = this.getChartDataArray(this.chartGetLegend(this.abTests[itemNumber].variants));
            const chartLabelBuild = Object.keys(this.chartGetLegend(this.abTests[itemNumber].variants));
            if (chartDataBuild[0].length === 1) {
              chartLabelBuild.push('');
            }

            this.abTests[itemNumber].chartData = chartDataBuild;
            this.abTests[itemNumber].chartLabels = chartLabelBuild;
          }
        } else {
          this.getConversions(itemNumber + 1, testsLength);
        }
      /*});*/
    } else {
      this.isLoad = true;
      this.startScrollToTest();
    }
  }

  private chartGetLegend(incoming) {
    let chart = {};
    let data = this.prepareData(incoming);

    let prevKey = null;

    if (data.range.min === null) {
      return null;
    }
    if (data.range.min === data.range.max) {
      const dayOne = data.range.min;
      const keyOne = `${dayOne.getDate()}.${dayOne.getMonth() + 1}.${dayOne.getFullYear()}`;
      this.fillCharts(data, chart, prevKey, keyOne);
      return chart;
    }

    for (let day = data.range.min; day <= data.range.max; day.setDate(day.getDate() + 1)) {
      let key = `${day.getDate()}.${day.getMonth() + 1}.${day.getFullYear()}`;
      this.fillCharts(data, chart, prevKey, key);
      prevKey = key;
    }
    return chart;
  }

  private getChartDataArray(chartObj) {
    if (!chartObj) {
      return [];
    }
    let chartAr = [];
    for (const key in chartObj) {
      if (chartObj[key]) {
        const dayData = chartObj[key];
        chartAr.push(dayData);
      }
    }
    return unzip(chartAr);
  }

  private startScrollToTest() {
    const getUrlStr = this.location.path();
    const getPosOfId = getUrlStr.indexOf('testIdNum-');
    if (getPosOfId > -1) {
      const newStrGet = getUrlStr.substring(getPosOfId);
      const body = $('html, body');
      setTimeout(() => {
        const target = $('#' + newStrGet).offset().top - 80;
        body.animate({ scrollTop: target }, 500, 'swing');
      }, 100);
    }
  }

  private prepareData(incoming) {
    let range = {
      min: null,
      max: null
    };
    let widgetsMap = [];
    for (let i = 0; i < incoming.length; i++) {
      widgetsMap[i] = {
        id: incoming[i].id,
        name: incoming[i].name,
        conversionMap: {},
        totals: {
          shows: null,
          target: null
        }
      };
      for (let j = 0; j < incoming[i].conversions.length; j++) {
        let item = incoming[i].conversions[j];
        item.day = this.timeConverter(item.date).day;
        item.month = this.timeConverter(item.date).month;
        item.year = this.timeConverter(item.date).year;
        let date = new Date(item.year, (item.month - 1), item.day);

        if (range.min == null || date < range.min) {
          range.min = date;
        }
        if (range.max == null || date > range.max) {
          range.max = date;
        }
        widgetsMap[i].totals.shows = (widgetsMap[i].totals.shows == null) ? item.shows : widgetsMap[i].totals.shows + item.shows;
        widgetsMap[i].totals.target = (widgetsMap[i].totals.target == null) ? item.target : widgetsMap[i].totals.target + item.target;
        widgetsMap[i].conversionMap[`${item.day}.${item.month}.${item.year}`] =
          (widgetsMap[i].totals.target * 100 / widgetsMap[i].totals.shows).toFixed(2);
      }
    }

    return {
      range,
      widgetsMap
    };
  }

  private timeConverter(unixTimestamp) {
    const a = new Date(unixTimestamp);
    const year = a.getFullYear();
    const month = a.getMonth() + 1;
    const day = a.getDate();

    return { year, month, day };
  }

  private fillCharts(data, chart, prevKey, key) {
    chart[key] = [];
    for (let i = 0; i < data.widgetsMap.length; i++) {
      if (key in data.widgetsMap[i].conversionMap) {
        chart[key].push(data.widgetsMap[i].conversionMap[key]);
      } else if (prevKey != null) {
        chart[key].push(chart[prevKey][i]);
      } else {
        chart[key].push(null);
      }
    }
  }

  public fixOldTest(test) {
    this.fixedTest = test;
  }

  public getSiteName(siteId) {
    const site = this.getSiteById(siteId);
    if (site != null) {
      return site.name;
    } else {
      return '';
    }
  }

  public getCroppedString(str, count, addedSymbol) {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }
    return str;
  }

  public trackById(index, item) {
    return item.id;
  }

  public updateVariantName(test, variant) {
    if (test.containerized) {
      this.containerizedWidgetService.rename(test.siteId, variant.id, variant.name).subscribe();
    } else {
      this.widgetService.rename(test.siteId, variant.id, variant.name).subscribe();
    }
  }

  public changeVariantState(variant, test) {
    if (test.containerized) {
      this.containerizedWidgetService.switch(test.siteId, variant.id, variant.active).subscribe();
    } else {
      this.widgetService.switch(test.siteId, variant.id, variant.active).subscribe();
    }
  }

  public goToEdit(siteId, variantId) {
    this.router.navigate(['/widgets/edit/', siteId, '-', variantId]);
  }

  public getClassForBetterTo(item): string {
    let className = '';
    if (!item.etalon && (item.convInfo.n !== 0)) {
      if (item.convInfo.betterTo > 0) {
        className = 'set-positive-better-color';
      } else if (item.convInfo.betterTo < 0) {
        className = 'set-negative-better-color';
      }
    }
    return className;
  }

  public showBetterToValue(item): string {
    if (item.etalon) {
      return 'Эталон';
    }
    if (item.convInfo.n === 0) {
      return '-';
    }
    if (item.convInfo.betterTo > 0) {
      return '+' + item.convInfo.betterTo + '%';
    }
    return item.convInfo.betterTo + '%';
  }

  public cloneVariant(test, variant, index, parentIndex) {
    this.abTestsService.cloneVariant(test.id, variant.id).subscribe((response: Variant) => {
      const newVariant: NewVariant = {
        ...response,
        conversions: [],
        etalon: false
      };

      this.addMoreDataToVariant(newVariant, this.abTests[parentIndex].variants.length, this.abTests[parentIndex]);
      this.abTests[parentIndex].variants.push(newVariant);
    });
  }

  public deleteVariant(test, variantId, index, parentIndex) {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'Вариант будет полностью удален.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Да, уверен',
      cancelButtonText: 'Отмена'
    }).then((isConfirm) => {
      if (isConfirm) {
        this.abTestsService.deleteVariant(test.id, variantId).subscribe((response: boolean) => {
          if (response) {
            this.abTests[parentIndex].variants.splice(index, 1);
          }
        });
      }
    });
  }

  public setWinner(testId, variantId, parentIndex) {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'При выборе, все настройки и дизайн варианта-победителя будут скопированы в виджет, а тест будет остановлен и перемещен в архив',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#62cb31',
      confirmButtonText: 'Да, уверен',
      cancelButtonText: 'Отмена'
    }).then((isConfirm) => {
      if (isConfirm) {
        setTimeout(() => {
          $('[role="tooltip"]').remove();
          Swal.fire({
            title: 'Пожалуйста, ждите.',
            text: 'Идет завершение теста.',
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: false
          });

          this.abTestsService.chooseWinner(testId, variantId).subscribe((response: boolean) => {
            if (response) {
              this.abTests.splice(parentIndex, 1);
              this.abTestsService.getTests().subscribe((responseTests: Abtest[]) => {
                this.allABTests = responseTests;
              });
              Swal.close();
            }
          });
        }, 0);
      }
    });
  }

  public resetStats(test) {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'Статистика A/B теста будет полностью удалена',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Да, уверен',
      cancelButtonText: 'Отмена'
    }).then((isConfirm) => {
      if (isConfirm) {
        this.abTestsService.resetStats(test.id).subscribe((response: boolean) => {
          if (response) {
            test.variants.forEach((item, i) => {
              item.conversions = [];
              this.addMoreDataToVariant(item, i, test);
            });
          }
        });
      }
    });
  }

  public addVariant(widget, index) {
    const modalRef = this.modalService.open(VariantAddComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.step = 0;
    modalRef.componentInstance.currentVariantsLength = widget.variants.length;
    modalRef.componentInstance.currentSiteId = widget.siteId;
    modalRef.componentInstance.currentTestId = widget.id;
    modalRef.componentInstance.currentTestIndex = index;
    modalRef.componentInstance.abtTypeWidget = widget.type;
    modalRef.componentInstance.abtTypeWidget = widget.type;
    modalRef.componentInstance.editableAB = {
      ...this.getEmptyABTest(),
      containerized: widget.containerized,
      templateId: this.getTemplateIdByType(widget.type)
    };
  }

  public startTest(test) {
    if (test.state === 'PAUSED') {
      this.abTestsService.start(test.id).subscribe((response: number) => {
        if (response === 200) {
          test.state = 'ACTIVE';
        } else if (response === 402) {
          this.showPaymentDialog(
            test.siteId,
            this.translate.instant('widgetsList.payment.abtest', { 0: this.getSiteName(test.siteId)})
          );
        }
      });
    }
  }

  public pauseTest(test) {
    if (test.state === 'ACTIVE') {
      this.abTestsService.pause(test.id).subscribe((response: number) => {
        if (response === 200) {
          test.state = 'PAUSED';
        }
      });
    }
  }

  public deleteTest(id, index) {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'A/B тест будет остановлен и перемещен в архив.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Да, уверен',
      cancelButtonText: 'Отмена'
    }).then((isConfirm) => {
      if (isConfirm) {
        setTimeout(() => {
          $('[role="tooltip"]').remove();
          this.abTestsService.deleteTest(id).subscribe((response: boolean) => {
            if (response) {
              this.abTests.splice(index, 1);
              this.abTestsService.getTests().subscribe((responseTests: Abtest[]) => {
                this.allABTests = responseTests;
              });
            }
          });
        }, 0);
      }
    });
  }

  public updateTest(test) {
    if (this.updatedEarlier) {
      this.updatedEarlier = false;
      return;
    }
    if (!test || test.name.length > 60 || test.description.length > 60) {
      setTimeout(() => {
        test.name = this.fixedTest.name;
        test.description = this.fixedTest.description;
      }, 0);
      return;
    }
    const testForUpdate = {
      name: test.name,
      description: test.description
    };
    this.updatedEarlier = true;
    this.abTestsService.update(test.id, testForUpdate).subscribe();
  }

  public setCurrSite(site) {
    this.currSite = site.id;
    this.getTestsById();
  }

  public getTestsByState(state) {
    this.getTestsById();
    this.showWhat = state;
    if (this.showWhat === 'ACTIVE') {
      this.abTests = this.abTests.filter((item) => {
        return item.state === 'ACTIVE';
      });
    } else if (this.showWhat === 'PAUSED') {
      this.abTests = this.abTests.filter((item) => {
        return item.state === 'PAUSED';
      });
    }
  }

  private getTestsById() {
    this.showWhat = 'ALL';
    this.showOnlyIfNoTestsForCurrentSite = false;
    if (this.currSite === 'allsitesid') {
      this.abTests = this.allABTests;
    } else {
      this.abTests = this.allABTests.filter((item) => {
        return item.siteId === this.currSite;
      });
      if (!this.abTests.length) {
        this.showOnlyIfNoTestsForCurrentSite = true;
      }
    }
  }

  private showPaymentDialog(siteId, description) {
    /*window.siteTariffModal.find("h5.paymentSubscription").html(description);
    window.siteTariffModal.find("span.site-name").html(this.getSiteName(siteId));
    window.siteTariffModal.attr("data-id", siteId);
    this.loadPlans();*/
  }

  private addMoreDataToVariant(variant, index, test) {
    variant.conversions = sortBy(variant.conversions, 'date');
    variant.color = this.colorsArray[index];
    const arrayForInfo = this.binsDataService.binDist(
      [{s: this.getActions(variant), n: this.getShows(variant)}], {confRange: 0.8, disc: 30000}
      ).res;

    variant.convInfo = arrayForInfo[0];
    variant.convInfo.conversion = this.getConvItem(variant.convInfo);
    variant.convInfo.convNumber = this.getConvNumber(variant.convInfo);

    if (variant.etalon && test) {
      test.etalonConversion = variant.convInfo.convNumber;
    }

    if (test && typeof test.etalonConversion !== 'undefined') {
      variant.convInfo.betterTo = test.etalonConversion !== 0 ? (((variant.convInfo.convNumber - test.etalonConversion) / test.etalonConversion) * 100) : 0;
      variant.convInfo.betterTo = Math.round(variant.convInfo.betterTo * 100) / 100;
    }

    const charOpt = {
      pointBackgroundColor: variant.color,
      pointRadius: 1,
      borderColor: variant.color,
      tooltipCaretSize: 0,
      fill: false
    };
    test.chartSeries.push(variant.name);
    test.chartColors.push(charOpt);
  }

  private getActions(variant) {
    if (!variant.conversions.length) {
      return 0;
    }
    let total = 0;
    variant.conversions.forEach((item) => {
      total += item.target;
    });
    return total;
  }

  private getShows(variant) {
    if (!variant.conversions.length) {
      return 0;
    }
    let total = 0;
    variant.conversions.forEach((item) => {
      total += item.shows;
    });
    return total;
  }

  private getConvItem(item) {
    const conv = this.binsDataService.distRound(item.s / item.n);
    return item.n !== 0 ? conv : '0%';
  }

  private getConvNumber(item) {
    if (item.n !== 0) {
      return item.s / item.n;
    } else {
      return 0;
    }
  }

  private getEmptyABTest() {
    return {
      mode: '',
      templateId: '',
      mockupId: ''
    };
  }

  private getSiteById(siteId) {
    for (let i = 0; i < this.sites.length; i++) {
      if (this.sites[i].id === siteId) {
        return this.sites[i];
      }
    }
    return null;
  }

  private getTemplateIdByType(type): string {
    const filteredArray = this.templates.filter((item: WidgetTemplate) => {
      return item.type === type;
    });
    return filteredArray[0].id;
  }

}
