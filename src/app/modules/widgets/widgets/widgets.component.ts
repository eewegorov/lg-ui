import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Abtest } from '../../../core/models/abtests';
import { SiteShort } from '../../../core/models/sites';
import {
  Company,
  CompanyShort,
  Entities,
  SiteForWidget,
  WidgetInfo,
  WidgetTemplate,
  WidgetType
} from '../../../core/models/widgets';
import { TariffsService } from '../../../core/services/tariffs.service';
import { CoreSitesService } from '../../../core/services/core-sites.service';
import { SitesService } from '../../sites/services/sites.service';
import { AbtestsService } from '../../abtests/services/abtests.service';
import { WidgetService } from '../services/widget.service';
import { CampaignDeleteComponent } from '../campaign-delete/campaign-delete.component';
import { CloneWidgetComponent } from '../clone-widget/clone-widget.component';
import { WidgetAddComponent } from '../widget-add/widget-add.component';


@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['../shared/shared.scss', './widgets.component.scss']
})
export class WidgetsComponent implements OnInit, AfterViewChecked {
  public sites = [];
  public companies = [];
  public containers = [];
  public smartPoints;
  public currentSite = {} as SiteForWidget;
  public currentCompany = {} as Company;
  public defCompanyName = '';
  public newCompany = {
    on: false,
    name: ''
  };

  private widgets: Record<string, WidgetInfo[]>;
  private types: WidgetType[] = [];
  private enableWidgetsModal = false;

  constructor(
    private location: Location,
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private tariffsService: TariffsService,
    private coreSitesService: CoreSitesService,
    private sitesService: SitesService,
    private abtestsService: AbtestsService,
    private widgetService: WidgetService
  ) {
    this.enableWidgetsModal = this.location.path().includes('enableModal');
  }

  ngOnInit(): void {
    const selectedSite = localStorage.getItem('currentSite');

    this.translate.get('widgetsList.defCompany').subscribe((translatedValue: string) => {
      this.defCompanyName = translatedValue;
      this.sitesService.getSites().subscribe((sites: SiteShort[]) => {
        if (sites) {
          this.sites = sites;
          this.coreSitesService.sites = sites;
          this.currentSite = selectedSite ? this.coreSitesService.getSiteById(selectedSite) : sites[0];
          if (!this.currentSite) {
            this.currentSite = sites[0];
          }
          this.setCurrentSite();
        }
      });
    });

    this.widgetService.updateWidgetsList.subscribe((data: string) => {
      this.getAllWidgetsForSite(data, true);
    });

    this.widgetService.openCloneWidgetModal.subscribe(({ data, containerId }) => {
      const modalRef = this.modalService.open(CloneWidgetComponent, {
        size: 'lg',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
      modalRef.componentInstance.sites = this.sites;
      modalRef.componentInstance.currentSite = this.currentSite;
      modalRef.componentInstance.companies = this.companies;
      modalRef.componentInstance.widget = data;
      modalRef.componentInstance.containerId = containerId;
    });

    this.widgetService.getWidgetsTemplates().subscribe((response: WidgetTemplate[]) => {
      if (response) {
        this.widgetService.setCurrentWidgetsTemplates(response);
      }
    });

    this.widgetService.getWidgetsTypes().subscribe((response: WidgetType[]) => {
      if (response) {
        this.types = response;
        this.widgetService.setCurrentWidgetsTypes(response);
      }
    });
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
  }

  private setCurrentSite() {
    localStorage.setItem('currentSite', this.currentSite.id);
    this.sitesService.setCurrentSiteId(this.currentSite.id);
    this.getAllWidgetsForSite(this.currentSite.id);
    this.resetNewCompany();
  }

  public getTypeItem(typeId: string): WidgetType {
    return this.types.find((item: WidgetType) => {
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
      .catch(() => {
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
  }

  public getFilteredWidgets(type): WidgetInfo[] {
    if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id) {
      return this.widgets[type];
    }
    return this.widgets[type].filter((item: WidgetInfo) => {
      return item.companyId === this.currentCompany.id;
    });
  }

  private getAllWidgetsForSite(siteId, stayCompany?) {
    this.abtestsService.getTests().pipe(
      switchMap((responseTests: Abtest[]) => {
        this.abtestsService.setListOfABTests(responseTests);
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
      this.widgets = response.widgets as unknown as Record<string, WidgetInfo[]>;
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
      this.tariffsService.checkTariffPlans(this.currentSite.id,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.limit', { siteName: this.currentSite.name }));
    } else {
      const modalRef = this.modalService.open(WidgetAddComponent, {
        size: 'xl',
        windowClass: 'animate__animated animate__slideInDown animate__faster widget__constructor'
      });
      modalRef.componentInstance.currentSite = this.currentSite;
      modalRef.componentInstance.companies = this.widgetService.getUndefaultCompanies(this.companies);
      modalRef.componentInstance.currentCompany = this.currentCompany;
      modalRef.result.then((result) => {
        // TODO: Implement logic when close modal. Don't forget "result"
      }).catch(() => {});
    }
  }

  public changeCurrentSite(site): void {
    this.currentSite = site;
    this.setCurrentSite();
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
    if (this.widgets) {
      const types = Object.keys(this.widgets);
      for (const item of types) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.widgets[item].length; j++) {
          if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id ||
            this.widgets[item][j].companyId === this.currentCompany.id) {
            return true;
          }
        }
      }
      return false;
    } else {
      return false;
    }
  }

  public filteredContainers() {
    if (!this.currentCompany || this.currentCompany.default) {
      return this.containers;
    }

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

  public resetNewCompany() {
    this.newCompany = {
      on: false,
      name: ''
    };
  }

}
