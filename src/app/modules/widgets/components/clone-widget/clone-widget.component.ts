import { Component, Input, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyShort, ContainerShort, WidgetCloned } from '@core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-clone-widget',
  templateUrl: './clone-widget.component.html',
  styleUrls: ['../../shared/shared.scss', './clone-widget.component.scss']
})
export class CloneWidgetComponent implements OnInit {
  @Input() public sites;
  @Input() public currentSite;
  @Input() public companies;
  public cloneable;
  public allContainers;
  public currentContainer;
  public cloneableSiteId;
  @Input() private widget;
  @Input() private containerId;

  constructor(
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {}

  ngOnInit(): void {
    this.companies = this.widgetService.getUndefaultCompanies(this.companies);

    const currentCompany = this.widgetService.getCompanyById(this.widget.companyId, this.companies);

    this.cloneable = {
      widget: this.widget,
      recipientSiteId: this.currentSite.id,
      targetSiteId: null,
      step: 0,
      companyId: currentCompany ? this.widget.companyId : null,
      companyName: currentCompany ? currentCompany.name : this.translate.instant('widgetsList.clone.company.chose'),
      companyMode: 0
    };

    if (this.containerId) {
      this.getContainersForCurrentSite(this.currentSite.id);
    }
  }

  public getFilteredCompanies() {
    return this.companies.filter(item => {
      return item.id !== this.cloneable.companyId && !item.default;
    });
  }

  public changeClonableCompany(company) {
    this.cloneable.companyId = company ? company.id : null;
    this.cloneable.companyName = company ? company.name : this.translate.instant('widgetsList.clone.company.chose');
  }

  public changeCurrentSite(site) {
    this.currentSite = site;
    this.cloneable.targetSiteId = site.id;
    this.getCompaniesForCurrentSite(site.id);
    if (this.containerId) {
      this.getContainersForCurrentSite(site.id);
    }
  }

  public changeCurrentContainer(container) {
    this.currentContainer = container;
  }

  public openAddCompanyMode() {
    this.cloneable.companyMode = 1;
    this.cloneable.companyName = '';
  }

  public closeAddCompanyMode() {
    this.cloneable.companyMode = 0;
    this.cloneable.companyName = this.companies[0].name;
  }

  public handleCloneWidget() {
    if (this.cloneable.companyMode === 1) {
      this.widgetService
        .createCompany(this.cloneable.targetSiteId || this.cloneable.recipientSiteId, this.cloneable.companyName)
        .subscribe((response: CompanyShort) => {
          if (response) {
            this.cloneWidget(response.id);
          }
        });
    } else {
      this.cloneWidget(this.cloneable.companyId);
    }
  }

  public closeCloneWidgetModal(result) {
    this.activeModal.close(result);
  }

  private getContainersForCurrentSite(id) {
    const defaultContainer = {
      id: null,
      name: this.translate.instant('widgetsList.clone.container.default')
    };

    this.containerizedWidgetService.getWContainers(id).subscribe((response: ContainerShort[]) => {
      this.allContainers = [defaultContainer].concat(response);
      this.currentContainer = this.allContainers[0];
    });
  }

  private getCompaniesForCurrentSite(siteId) {
    this.widgetService.getCompanies(siteId).subscribe((response: CompanyShort[]) => {
      if (response) {
        this.companies = this.widgetService.getUndefaultCompanies(response);
        this.changeClonableCompany(this.companies[0]);
        if (!this.companies.length) {
          this.openAddCompanyMode();
        } else {
          this.cloneable.companyMode = 0;
        }
      }
    });
  }

  private cloneWidget(companyId) {
    if (this.containerId) {
      if (this.currentContainer.id) {
        this.cloneCWidget(companyId, this.currentContainer.id);
      } else {
        this.containerizedWidgetService
          .getWContainerName(this.currentSite.id)
          .pipe(
            switchMap((name: string) => this.containerizedWidgetService.createWContainer(this.currentSite.id, name))
          )
          .subscribe((container: ContainerShort) => {
            this.cloneCWidget(companyId, container.id);
          });
      }
    } else {
      const targetSiteId = this.cloneable.targetSiteId || this.cloneable.recipientSiteId;
      this.widgetService
        .clone(this.cloneable.recipientSiteId, this.cloneable.widget.id, targetSiteId, companyId)
        .subscribe((response: WidgetCloned) => {
          this.cloneable.newWidgetId = response.widgetId;
          this.cloneableSiteId = response.siteId || this.cloneable.recipientSiteId;
          this.widgetService.updateWidgetsList.next(this.cloneable.recipientSiteId);
          this.cloneable.step++;
        });
    }
  }

  private cloneCWidget(companyId, containerId) {
    const targetSiteId = this.cloneable.targetSiteId || this.cloneable.recipientSiteId;
    this.containerizedWidgetService
      .clone(this.cloneable.recipientSiteId, this.cloneable.widget.id, targetSiteId, companyId, containerId)
      .subscribe((response: WidgetCloned) => {
        this.cloneable.newWidgetId = response.widgetId;
        this.cloneableSiteId = response.siteId || this.cloneable.recipientSiteId;
        this.widgetService.updateWidgetsList.next(this.cloneable.recipientSiteId);
        this.cloneable.step++;
      });
  }
}
