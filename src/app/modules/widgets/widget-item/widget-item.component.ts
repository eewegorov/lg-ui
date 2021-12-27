import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Abtest } from '../../../core/models/abtests';
import { WidgetConversion, WidgetInfo, WidgetInfoShort } from '../../../core/models/widgets';
import { TariffsService } from '../../../core/services/tariffs.service';
import { SitesService } from '../../sites/services/sites.service';
import { AbtestsService } from '../../abtests/services/abtests.service';
import { AbtestAddComponent } from '../../abtests/abtest-add/abtest-add.component';
import { WidgetService } from '../services/widget.service';
import { CoreSitesService } from '../../../core/services/core-sites.service';

@Component({
  selector: 'app-widget-item',
  templateUrl: './widget-item.component.html',
  styleUrls: ['../shared/shared.scss', './widget-item.component.scss'],
  providers: [DecimalPipe]
})
export class WidgetItemComponent implements OnInit {
  @Input() public widget: WidgetInfo;
  @Input() public first: boolean;
  @Input() public last: boolean;
  @Input() private prev: WidgetInfo;
  @Input() private next: WidgetInfo;
  public widgetCurrentCompany: WidgetInfoShort;
  public widgetConversion: WidgetConversion;
  public isConversionLoaded = false;
  public changeCompanyWidget = {} as WidgetInfoShort;
  public widgetType;
  private currentSiteId;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private decimalPipe: DecimalPipe,
    private tariffsService: TariffsService,
    private coreSitesService: CoreSitesService,
    private sitesService: SitesService,
    private abtestsService: AbtestsService,
    private widgetService: WidgetService
  ) {
    this.currentSiteId = this.sitesService.getCurrentSiteId();
  }

  ngOnInit(): void {
    if (!this.isConversionLoaded) {
      this.loadConversion();
    }

    const abTests = this.abtestsService.getListOfABTests();
    if (this.widget.abtestInfo) {
      abTests.forEach((test: Abtest) => {
        if (this.widget.abtestInfo.id === test.id) {
          this.widget.abtestInfo.state = test.state;
        }
      });
    }

    this.widgetCurrentCompany = this.widgetService.getCompanyById(this.widget.companyId, this.widgetService.getCurrentCompanies());

    this.widgetType = this.widgetService.getCurrentWidgetsTypes().find((item) => {
      return item.code === this.widget.type;
    });
  }

  public switchWidget(newValue) {
    if (this.widget.active === newValue) {
      return false;
    }

    this.widgetService.switch(this.currentSiteId, this.widget.id, newValue).subscribe((response: boolean) => {
      if (!response) {
        return false;
      }

      this.widget.active = newValue;
    });
  }

  public getConversion() {
    return (this.decimalPipe.transform(((100 * this.widgetConversion.target) / this.widgetConversion.shows), '1.0-2')) + '%';
  }

  public updateWidgetName(data) {
    if (!data) {
      return false;
    }
    this.widgetService.rename(this.currentSiteId, this.widget.id, data).subscribe();
  }

  public swapWidgets(isUp) {
    this.widgetService.swap(this.currentSiteId, this.widget.id, isUp ? this.prev.id : this.next.id).subscribe((response: boolean) => {
      this.widgetService.updateWidgetsList.next(this.currentSiteId);
    });
  }

  public startChangeCompany() {
    this.changeCompanyWidget = {
      id: this.widget.id,
      name: this.widgetCurrentCompany.name,
      companyId: this.widget.companyId
    };
  }

  public changeCurrentCompany(company) {
    this.changeCompanyWidget.companyId = company.id;
    this.changeCompanyWidget.name = company.name;
    this.changeCompanyWidget.id = this.widget.id;
  }

  public changeWidgetCompany() {
    this.widgetService.changeWidgetCompany(this.currentSiteId, this.widget.id, this.changeCompanyWidget.companyId).subscribe(
      () => {
        this.widgetService.updateWidgetsList.next(this.currentSiteId);
      });
  }

  public getFilteredCompanies() {
    return this.widgetService.getCurrentCompanies().filter((item) => {
      return (item.id !== this.changeCompanyWidget.companyId) && !item.default;
    });
  }

  public resetChangeCompany() {
    this.changeCompanyWidget = {
      id: '',
      name: '',
      companyId: ''
    };
  }

  public duplicateItem() {
    this.widgetService.openCloneWidgetModal.next({data: this.widget, containerId: null});
  }

  public removeItem() {
    if (this.widget.abtestInfo && this.widget.abtestInfo.state) {
      this.toastr.error(this.translate.instant('abtests.widget.deleteiftest'), this.translate.instant('global.error'));
      return false;
    }

    Swal.fire({
      title: this.translate.instant('widgetsList.widget.delete.title'),
      text: this.translate.instant('widgetsList.widget.delete.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('widgetsList.widget.delete.confirm'),
      cancelButtonText: this.translate.instant('widgetsList.widget.delete.cancel'),

    }).then((isConfirm) => {
      if (isConfirm) {
        this.widgetService.deleteWidget(this.currentSiteId, this.widget.id).subscribe((response: boolean) => {
          if (response) {
            this.toastr.success(this.translate.instant('widgetsList.widget.delete.desc'), this.translate.instant('global.done'));
          }

          this.widgetService.updateWidgetsList.next(this.currentSiteId);
        });
      }
    });
  }

  public abAction() {
    const currentSite = this.coreSitesService.getSiteById(this.currentSiteId);

    // TODO: Check if it's payment query
    if (this.sitesService.isSiteHasExpTariff(currentSite)) {
      this.tariffsService.checkTariffPlans(this.currentSiteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.abtest', currentSite.name));
    } else {
      const modalRef = this.modalService.open(AbtestAddComponent, {
        size: 'lg',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
      modalRef.componentInstance.currentSite = currentSite;
      modalRef.componentInstance.widget = this.widget;
      modalRef.componentInstance.isContainerized = false;
    }
  }

  public abIfNoTest() {
    if (!this.widget.abtestInfo || !this.widget.abtestInfo.state) {
      return true;
    }
  }

  public abIfTestOnWork() {
    if (this.widget.abtestInfo && this.widget.abtestInfo.state && (this.widget.abtestInfo.state === 'ACTIVE')) {
      return true;
    }
  }

  public abIfTestOnPause() {
    if (this.widget.abtestInfo && this.widget.abtestInfo.state && (this.widget.abtestInfo.state === 'PAUSED')) {
      return true;
    }
  }

  public goToTest() {
    this.router.navigate([`/abtests/active`], { queryParams: { testIdNum: this.widget.abtestInfo.id } }).then();
  }

  public goToConstructor() {
    this.router.navigate([`/widgets/edit/${this.currentSiteId}-${this.widget.id}/`]).then();
  }

  private loadConversion() {
    this.isConversionLoaded = true;

    this.widgetService.getWidgetConversion(this.currentSiteId, this.widget.id).subscribe((response: WidgetConversion) => {
      if (response) {
        this.widgetConversion = response;
      }
    });
  }

}
