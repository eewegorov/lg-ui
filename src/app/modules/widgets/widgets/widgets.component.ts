import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignDeleteComponent } from '../campaign-delete/campaign-delete.component';
import { WidgetAddComponent } from '../widget-add/widget-add.component';
import { Entities } from '../models/widgets';
import { Abtest } from '../../abtests/models/abtests';
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
  widgets = [];
  companies = [];
  containers = [];
  smartPoints;
  company = { name: '' };
  currentSite = { id: '', name: '' };
  site = { name: '' };
  currentCompany = { id: '', name: '', default: false };
  defCompanyName;
  types: { id: string; name: string; }[];
  newCompany = {
    on: false,
    name: ""
  };
  enableWidgetsModal = false;


  constructor(
    private location: Location,
    private translate: TranslateService,
    private modalService: NgbModal,
    private billingService: BillingService,
    private sitesService: SitesService,
    private abtestsService: AbtestsService,
    private widgetService: WidgetService
  ) { }

  ngOnInit(): void {
    this.enableWidgetsModal = this.location.path().includes('enableModal');
  }

  public getTypeItem(typeId: string): { id: string; name: string; } {
    return this.types.find((item) => {
      return item.id === typeId
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
      if (!deletedId) return false;
      this.getAllWidgetsForSite(this.sitesService.getCurrentSiteId());
    });
  }

  public getTypesWithCompanyFilter() {
    if (!this.widgets) {
      return [];
    }
    const keys = Object.keys(this.widgets);
    return keys.filter((item) => {
      return this.getFilteredWidgets(item).length > 0;
    });
  };

  private getFilteredWidgets(type) {
    if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id) {
      return this.widgets[type];
    }
    return this.widgets[type].filter((item) => {
      return item.companyId === this.currentCompany.id;
    });
  };

  private getAllWidgetsForSite(siteId, stayCompany?) {
    this.abtestsService.getTests().pipe(
      switchMap((response: Abtest[]) => {
        this.abtestsService.setListOfABTests(response);
        return this.widgetService.getWidgetsList(siteId);
      })
    ).subscribe((response: Entities) => {
      this.companies = response.companies;
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
        this.translate.instant("sitelist.tariff.title"),
        this.translate.instant("widgetsList.payment.limit", {siteName: this.currentSite.name}));
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
      });
    }
  }

  private getWidgetsCount(): number {
    const keys = Object.keys(this.widgets);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      count += this.widgets[keys[i]].length;
    }
    return count + this.getContainerizedWidgetLength();
  }

  private getContainerizedWidgetLength(): number {
    let count = 0;
    this.containers.forEach((container) => {
      count += container.widgets.length;
    });
    return count;
  }

}
