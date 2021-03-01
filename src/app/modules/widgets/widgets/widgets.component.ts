import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampaignDeleteComponent } from '../campaign-delete/campaign-delete.component';
import { WidgetAddComponent } from '../widget-add/widget-add.component';
import { Company, CompanyShort, Entities, Widget } from '../../../core/models/widgets';
import { Abtest } from '../../../core/models/abtests';
import { BillingService } from '../../../core/services/billing.service';
import { AbtestsService } from '../../abtests/services/abtests.service';
import { SitesService } from '../../sites/services/sites.service';
import { WidgetService } from '../services/widget.service';


@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {
  sites = [];
  widgets = [];
  companies = [];
  containers = [];
  smartPoints;
  company = { name: '' };
  currentSite = { id: '', name: '' };
  site = { name: '' };
  currentCompany: Company;
  defCompanyName;
  types: { id: string; name: string; }[];
  newCompany = {
    on: false,
    name: ''
  };
  enableWidgetsModal = false;


  constructor(
    private location: Location,
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private billingService: BillingService,
    private sitesService: SitesService,
    private abtestsService: AbtestsService,
    private widgetService: WidgetService
  ) {
    this.enableWidgetsModal = this.location.path().includes('enableModal');
  }

  ngOnInit(): void {
  }

  public getTypeItem(typeId: string): { id: string; name: string; } {
    return this.types.find((item) => {
      return item.id === typeId;
    });
  }

  public deleteCompany() {
    const modalRef = this.modalService.open(CampaignDeleteComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.companies = this.companies;
    modalRef.componentInstance.deletedCompany = this.currentCompany;
    modalRef.result.then((deletedId: boolean) => {
      if (!deletedId) {
        return false;
      }
      this.getAllWidgetsForSite(this.sitesService.getCurrentSiteId());
    })
      .catch(() => {});
  }

  public getTypesWithCompanyFilter() {
    if (!this.widgets) {
      return [];
    }
    const keys = Object.keys(this.widgets);
    return keys.filter((item) => {
      return this.getFilteredWidgets(item).length > 0;
    });
  }

  public getFilteredWidgets(type): Widget[] {
    if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id) {
      return this.widgets[type];
    }
    return this.widgets[type].filter((item) => {
      return item.companyId === this.currentCompany.id;
    });
  }

  private getAllWidgetsForSite(siteId, stayCompany?) {
    this.abtestsService.getTests().pipe(
      switchMap((response: Abtest[]) => {
        this.abtestsService.setListOfABTests(response);
        return this.widgetService.getWidgetsList(siteId);
      })
    ).subscribe((response: Entities) => {
      this.companies = response.companies;
      this.widgetService.setCurrentCompanies(response.companies);

      if (!stayCompany) {
        this.currentCompany = this.widgetService.getDefaultCompany(this.companies);
      }
      this.containers = response.containers;
      this.widgetService.setContainers(this.containers);
      this.smartPoints = response.smartPoints;
      this.widgets = response.widgets;
      if (this.enableWidgetsModal) {
        this.enableWidgetsModal = false;
        setTimeout(() => {
          this.createNewWidget();
        }, 500);
      }
    });
  }

  public createNewWidget() {
    // TODO: Check tariffExp
    if (this.sitesService.isSiteHasExpTariff(this.currentSite) && this.getWidgetsCount() >= 3) {
      this.billingService.checkTariffPlans(this.currentSite.id,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.limit', { siteName: this.currentSite.name }));
    } else {
      const modalRef = this.modalService.open(WidgetAddComponent, {
        size: 'xl',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
      modalRef.componentInstance.currentSite = this.currentSite;
      modalRef.componentInstance.companies = this.widgetService.getUndefaultCompanies(this.companies);
      modalRef.componentInstance.currentCompany = this.currentCompany;
      modalRef.result.then((result) => {
        // TODO: Implement logic when close modal. Don't forget "result"
      })
        .catch(() => {});
    }
  }

  public changeCurrentSite(site): void {
    this.currentSite = site;
  }

  public changeCurrentCompany(company): void {
    this.currentCompany = company;
  }

  public saveNewCompany() {
    this.widgetService.createCompany(this.sitesService.getCurrentSiteId(), this.newCompany.name).subscribe((response: CompanyShort) => {
      if (response) {
        this.companies.push(response);
        this.widgetService.setCurrentCompanies(this.companies);

        this.currentCompany = response as Company;
        this.toastr.success(this.translate.instant('widgetsList.company.add.desc'), this.translate.instant('global.done') + '!');
      }
      this.resetNewCompany();
    });
  }

  public enableDisableSP() {
    this.widgetService.startStopSmartpoint(this.sitesService.getCurrentSiteId(), this.smartPoints.enabled);
  }

  public isHasWidgets() {
    const types = Object.keys(this.widgets);
    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < this.widgets[types[i]].length; j++) {
        if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id ||
          this.widgets[types[i]][j].companyId === this.currentCompany.id) {
          return true;
        }
      }
    }
    return false;
  }

  public filteredContainers() {
    if (!this.currentCompany || this.currentCompany.default) { return this.containers; }

    return this.containers.filter((item) => {
      return item.widgets.some((widget) => widget.companyId === this.currentCompany.id);
    });
  }

  private getWidgetsCount(): number {
    const keys = Object.keys(this.widgets);
    let count = 0;
    keys.forEach((item: string) => {
      count += this.widgets[item].length;
    });
    return count + this.getContainerizedWidgetLength();
  }

  private getContainerizedWidgetLength(): number {
    let count = 0;
    this.containers.forEach((container) => {
      count += container.widgets.length;
    });
    return count;
  }

  private resetNewCompany() {
    this.newCompany = {
      on: false,
      name: ''
    };
  }

}
