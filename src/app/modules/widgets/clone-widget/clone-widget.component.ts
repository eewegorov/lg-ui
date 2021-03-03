import { Component, Input, OnInit } from '@angular/core';
import { WidgetService } from '../services/widget.service';
import { TranslateService } from '@ngx-translate/core';
import { ContainerizedWidgetService } from '../services/containerized-widget.service';

@Component({
  selector: 'app-clone-widget',
  templateUrl: './clone-widget.component.html',
  styleUrls: ['./clone-widget.component.scss']
})
export class CloneWidgetComponent implements OnInit {
  @Input() public sites;
  @Input() public currentSite;
  @Input() public companies;
  @Input() private widget;
  @Input() private containerId;
  public clonable;
  public allContainers;
  public currentContainer;

  constructor(
    private translate: TranslateService,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {
    this.companies = this.widgetService.getUndefaultCompanies(this.companies);

    const currentCompany = this.widgetService.getCompanyById(this.widget.companyId, this.companies);

    this.clonable = {
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

  ngOnInit(): void {
  }

  public getFilteredCompanies() {
    return this.companies.filter((item) => {
      return (item.id !== this.clonable.companyId) && !item.default;
    });
  }

  public changeClonableCompany(company) {
    this.clonable.companyId = company ? company.id : null;
    this.clonable.companyName = company ? company.name : this.translate.instant('widgetsList.clone.company.chose');
  }

  public changeCurrentSite(site) {
    this.currentSite = site;
    this.clonable.targetSiteId = site.id;
    this.getCompaniesForCurrentSite(site.id);
    if (containerId) {
      this.getContainersForCurrentSite(site.id);
    }
  }

  public changeCurrentContainer(container) {
    this.currentContainer = container;
  }

  public openAddCompanyMode() {
    this.clonable.companyMode = 1;
    this.clonable.companyName = '';
  }

  public closeAddCompanyMode() {
    this.clonable.companyMode = 0;
    this.clonable.companyName = this.companies[0].name;
  }

  public handleCloneWidget() {
    if ($scope.clonable.companyMode === 1) {
      WidgetService.createCompany($scope.clonable.targetSiteId || $scope.clonable.recipientSiteId, $scope.clonable.companyName).then(function (response) {
        if (response.code === 200) {
          cloneWidget(response.data.id);
        } else {
          SiteService.parseError(response);
        }
      });
    } else {
      this.cloneWidget($scope.clonable.companyId);
    }
  }

  public closeCloneWidgetModal(result) {
    close(result, 200);
  }

  private getContainersForCurrentSite(id) {
    this.containerizedWidgetService.getWContainers(id).then(function(response) {
      $scope.allContainers = [defaultContainer].concat(response.data);
      $scope.currentContainer = $scope.allContainers[0];
    });
  }

  private getCompaniesForCurrentSite(siteId) {
    this.widgetService.getCompanyList(siteId).then(function (response) {
      if (response.code === 200) {
        $scope.companies = WidgetService.getUndefaultCompanies(response.data);
        $scope.changeClonableCompany($scope.companies[0]);
        if (!$scope.companies.length) {
          $scope.openAddCompanyMode();
        } else {
          $scope.clonable.companyMode = 0;
        }
      } else {
        SiteService.parseError(response);
      }
    });
  }

  private cloneWidget(companyId) {
    if (containerId) {
      if ($scope.currentContainer.id) {
        cloneCWidget(companyId, $scope.currentContainer.id);
      } else {
        CWidgetService.getWContainerName($scope.currentSite.id).then(function(name) {
          CWidgetService.createWContainer($scope.currentSite.id, name).then(function(response1) {
            cloneCWidget(companyId, response1.data.id);
          });
        });
      }
    } else {
      WidgetService.cloneWidget($scope.clonable.recipientSiteId, $scope.clonable.targetSiteId || $scope.clonable.recipientSiteId, $scope.clonable.widget.id, companyId).then(function(response) {
        $scope.clonable.newWidgetId = response.data.widgetId;
        $scope.clonabledSiteId = response.data.siteId || $scope.clonable.recipientSiteId;
        EventsService.publish(EVENTS.updateWidgetsList, $scope.clonable.recipientSiteId);
        $scope.clonable.step++;
      });
    }
  }

  function cloneCWidget(companyId, contId) {
    CWidgetService.cloneCWidget($scope.clonable.recipientSiteId, $scope.clonable.targetSiteId || $scope.clonable.recipientSiteId, $scope.clonable.widget.id, companyId, contId).then(function(response) {
      $scope.clonable.newWidgetId = response.data.widgetId;
      $scope.clonabledSiteId = response.data.siteId || $scope.clonable.recipientSiteId;
      EventsService.publish(EVENTS.updateWidgetsList, $scope.clonable.recipientSiteId);
      $scope.clonable.step++;
    });
  }

}
