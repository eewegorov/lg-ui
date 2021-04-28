import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Abtest } from '../../../../core/models/abtests';
import { Company, Container, WidgetConversion, WidgetInfo } from '../../../../core/models/widgets';
import { TariffsService } from '../../../../core/services/tariffs.service';
import { AbtestsService } from '../../../abtests/services/abtests.service';
import { CoreSitesService } from '../../../../core/services/core-sites.service';
import { SitesService } from '../../../sites/services/sites.service';
import { WidgetService } from '../../services/widget.service';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { AbtestAddComponent } from '../../../abtests/abtest-add/abtest-add.component';

@Component({
  selector: 'app-containerized-item',
  templateUrl: './containerized-item.component.html',
  styleUrls: ['../../shared/shared.scss', './containerized-item.component.scss'],
  providers: [DecimalPipe]
})
export class ContainerizedItemComponent implements OnInit {
  @Input() public item: WidgetInfo;
  @Input() public first: boolean;
  @Input() public last: boolean;
  @Input() private containerId = '';
  @Input() private siteId = '';
  @Input() private prev: WidgetInfo;
  @Input() private next: WidgetInfo;

  public widgetCurrentCompany = {} as Company;

  public changeCompanyWidget = {
    id: '',
    name: '',
    companyId: ''
  };

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
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {
  }

  ngOnInit(): void {
    const abTests = this.abtestsService.getListOfABTests();
    if (this.item.abtestInfo) {
      abTests.forEach((test: Abtest) => {
        if (this.item.abtestInfo.id === test.id) {
          this.item.abtestInfo.state = test.state;
        }
      });
    }

    this.widgetCurrentCompany = this.widgetService.getCompanyById(this.item.companyId, this.widgetService.getCurrentCompanies());

    this.widgetService.getWidgetConversion(this.siteId, this.item.id).subscribe((response: WidgetConversion) => {
      if (response) {
        this.item.widgetConversion = response;
      }
    });
  }

  public getCConversion() {
    return (this.decimalPipe.transform(((100 * this.item.widgetConversion.target) / this.item.widgetConversion.shows), '1.0-2')) + '%';
  }

  public updateCWidget(data) {
    if (!data) {
      return false;
    }
    this.containerizedWidgetService.rename(this.siteId, this.item.id, data);
  }

  public swapCWidgets(isUp) {
    this.containerizedWidgetService.swap(this.siteId, this.item.id, isUp ? this.prev.id : this.next.id).subscribe(() => {
      this.widgetService.updateCurrentContainer.next(this.containerId);
    });
  }

  public switchCWidget(newValue) {
    if (this.item.active === newValue) {
      return false;
    }
    this.containerizedWidgetService.switch(this.siteId, this.item.id, newValue).subscribe((response: boolean) => {
      if (!response) {
        return false;
      }
      this.item.active = newValue;
    });
  }

  public startChangeCompany() {
    this.changeCompanyWidget = {
      id: this.item.id,
      name: this.widgetCurrentCompany.name,
      companyId: this.item.companyId
    };
  }

  public changeCurrentCompany(company) {
    this.changeCompanyWidget.companyId = company.id;
    this.changeCompanyWidget.name = company.name;
    this.changeCompanyWidget.id = this.item.id;
  }

  public changeCWidgetCompany() {
    this.containerizedWidgetService.changeCWidgetCompany(this.siteId, this.item.id, this.changeCompanyWidget.companyId).subscribe(() => {
      this.item.companyId = this.changeCompanyWidget.companyId;
      this.widgetCurrentCompany = this.widgetService.getCompanyById(this.item.companyId, this.widgetService.getCurrentCompanies());
      this.resetChangeCompany();
      this.widgetService.updateCurrentContainer.next(this.containerId);
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

  public removeCWidget() {
    if (this.item.abtestInfo && this.item.abtestInfo.state) {
      this.toastr.error(this.translate.instant('abtests.widget.deleteiftest'), this.translate.instant('global.error'));
      return false;
    }

    this.containerizedWidgetService.getWContainerInfo(this.siteId, this.containerId).subscribe((container: Container) => {
      if (container.widgets.length === 1) {
        Swal.fire(this.translate.instant('containerized.container.widget.remove.ifone'), '', 'error');
      } else {
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
            this.widgetService.deleteWidget(this.siteId, this.item.id).subscribe((response: boolean) => {
              if (response) {
                this.toastr.success(this.translate.instant('widgetsList.widget.delete.desc'), this.translate.instant('global.done'));
              }

              this.widgetService.updateWidgetsList.next(this.siteId);
            });
          }
        });
      }
    });
  }

  public duplicateCWidget() {
    this.widgetService.openCloneWidgetModal.next({ data: this.item, containerId: this.containerId });
  }

  public abAction() {
    const currentSite = this.coreSitesService.getSiteById(this.siteId);

    // TODO: Check if it's payment query
    if (this.sitesService.isSiteHasExpTariff(currentSite)) {
      this.tariffsService.checkTariffPlans(this.siteId,
        this.translate.instant('sitelist.tariff.title'),
        this.translate.instant('widgetsList.payment.abtest', { siteName: currentSite.name }));
    } else {
      const modalRef = this.modalService.open(AbtestAddComponent, {
        size: 'lg',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
      modalRef.componentInstance.currentSite = currentSite;
      modalRef.componentInstance.widget = this.item;
      modalRef.componentInstance.isContainerized = true;
    }
  }

  public abIfNoTest() {
    if (!this.item.abtestInfo || !this.item.abtestInfo.state) {
      return true;
    }
  }

  public abIfTestOnWork() {
    if (this.item.abtestInfo && this.item.abtestInfo.state && (this.item.abtestInfo.state === 'ACTIVE')) {
      return true;
    }
  }

  public abIfTestOnPause() {
    if (this.item.abtestInfo && this.item.abtestInfo.state && (this.item.abtestInfo.state === 'PAUSED')) {
      return true;
    }
  }

  public goToTest() {
    this.router.navigate([`/abtests/active?testIdNum-${this.item.abtestInfo.id}`]).then();
  }

  public goToConstructor() {
    this.router.navigate([`/widgets/edit/${this.siteId}-${this.item.id}/`]).then();
  }

}
