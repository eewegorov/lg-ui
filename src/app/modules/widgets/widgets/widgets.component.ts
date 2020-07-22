import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignDeleteComponent } from '../campaign-delete/campaign-delete.component';
import { WidgetService } from '../services/widget.service';
import { SitesService } from '../../sites/services/sites.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {
  widgets;
  companies = [];
  company = { name: '' };
  currentSite = { name: '' };
  site = { name: '' };
  currentCompany = { id: '', name: '', default: false };
  defCompanyName;
  types: { id: string; name: string; }[];
  newCompany = {
    on: false,
    name: ""
  };


  constructor(
    private modalService: NgbModal,
    private siteService: SitesService,
    private widgetService: WidgetService
  ) { }

  ngOnInit(): void {
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
      this.getAllWidgetsForSite(this.siteService.getCurrentSiteId());
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
    ABTestsService.getTests().then(function(responseAB) {
      ABTestsService.setListOfABTests(responseAB.data);

      WidgetService.getWidgetsList(siteId).then(function (response) {
        if (response.code === 200) {
          $scope.companies = response.data.companies;
          if (!stayCompany) {
            $scope.currentCompany = WidgetService.getDefaultCompany($scope.companies);
          }
          $scope.containers = response.data.containers;
          WidgetService.setContainers($scope.containers);
          $scope.smartPoints = response.data.smartPoints;
          $scope.widgets = response.data.widgets;
          if (enableWidgetsModal) {
            enableWidgetsModal = false;
            $timeout(function() {
              $scope.createNewWidget();
            }, 500);
          }
        } else {
          SiteService.parseError(response);
        }
      });
    });
  }

}
