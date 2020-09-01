import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VariantAddComponent } from '../variant-add/variant-add.component';
import Swal from 'sweetalert2';
import { sortBy } from 'lodash';
import { Abtest, NewVariant, Variant } from '../../../core/models/abtests';
import { WidgetService } from '../../widgets/services/widget.service';
import { ContainerizedWidgetService } from '../../widgets/services/containerized-widget.service';
import { AbtestsService } from '../services/abtests.service';
import { BinsDataService } from '../services/bins-data.service';
import { WidgetTemplate } from '../../../core/models/widgets';


@Component({
  selector: 'app-abtests-active',
  templateUrl: './abtests-active.component.html',
  styleUrls: ['../shared/shared.scss', './abtests-active.component.scss']
})
export class AbtestsActiveComponent implements OnInit {
  public currSite = '';
  public sites =  [{ id: 'allsitesid', name: 'Все сайты' }];
  public showWhat = 'ALL';
  public allABTests = [];
  public abTests = [];
  public isLoad = false;
  public showOnlyIfNoTestsForCurrentSite = false;
  public test = {
    id: 'dfsdfds12',
    name: 'dsfsfsf',
    description: 'dsfsfdsf'
  };
  public item = {
    name: 'dfdsfds',
    convInfo: {
      n: 2,
      s: 3,
      conversion: 23
    }
  };
  public type = {
    type: 'asddad',
    title: 'dsfdsfds'
  };
  public mckp = {
    preview: 'dfdsfsfs',
    name: 'dfdsfsf',
    description: 'dsfsffds'
  };
  public grp = {
    name: 'sdfsf'
  };
  public cat = {
    name: 'dsfsdf'
  };
  private colorsArray = ['#34495e', '#9b59b6', '#3498db', '#62cb31', '#ffb606', '#e67e22', '#e74c3c',
    '#c0392b', '#58b62c', '#e43725', '#2a7aaf', '#7c4792', '#4ea227', '#b8651b',
    '#9a2e22', '#2a3a4b', '#ffeb3b'];
  private templates: WidgetTemplate[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private binsDataService: BinsDataService,
    private abTestsService: AbtestsService
  ) { }

  ngOnInit(): void {
    this.widgetService.getWidgetsTemplates().subscribe((response: WidgetTemplate[]) => {
      this.templates = response;
    });
  }

  public getSiteName(siteId) {
    const site = this.getSiteById(siteId);
    if (site != null) {
      return site.name;
    } else {
      return ''
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
      this.containerizedWidgetService.rename(test.siteId, variant.id, variant.name);
    } else {
      this.widgetService.rename(test.siteId, variant.id, variant.name);
    }
  }

  public changeVariantState(variant, test) {
    if (test.containerized) {
      this.containerizedWidgetService.switch(test.siteId, variant.id, variant.active);
    } else {
      this.widgetService.switch(test.siteId, variant.id, variant.active);
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
      return "Эталон";
    }
    if (item.convInfo.n === 0) {
      return "-";
    }
    if (item.convInfo.betterTo > 0) {
      return "+" + item.convInfo.betterTo + '%';
    }
    return item.convInfo.betterTo + '%';
  }

  public cloneVariant(test, variant, index, parentIndex) {
    this.abTestsService.cloneVariant(test.id, variant.id).subscribe((response: Variant) => {
      let newVariant: NewVariant = {
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
              this.abTestsService.getTests().subscribe((response: Abtest[]) => {
                this.allABTests = response;
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
        } else if(response === 402) {
          this.showPaymentDialog(
            test.siteId,
            this.translate.instant('widgetsList.payment.abtest', { 0: this.getSiteName(test.siteId)})
          );
        }
      });
    }
  }

  public pauseTest(test) {
    if(test.state === 'ACTIVE') {
      this.abTestsService.pause(test.id).subscribe((response: number) => {
        if(response === 200) {
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
              this.abTestsService.getTests().subscribe((response: Abtest[]) => {
                this.allABTests = response;
              });
            }
          });
        }, 0);
      }
    });
  }

  public updateTest(test) {
    const testForUpdate = {
      name: test.name,
      description: test.description
    };
    this.abTestsService.update(test.id, testForUpdate);
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
  };

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

    if (test && typeof test.etalonConversion !== "undefined") {
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
    return item.n !== 0 ? conv : "0%";
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
      if (this.sites[i].id == siteId) {
        return this.sites[i];
      }
    }
    return null;
  }

  private getTemplateIdByType(type): string {
    let filteredArray = this.templates.filter((item: WidgetTemplate) => {
      return item.type === type;
    });
    return filteredArray[0].id;
  }

}
