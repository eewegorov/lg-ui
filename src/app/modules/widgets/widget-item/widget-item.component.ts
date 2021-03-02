import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { WidgetConversion, WidgetInfo, WidgetInfoShort } from '../../../core/models/widgets';
import { SitesService } from '../../sites/services/sites.service';
import { WidgetService } from '../services/widget.service';

@Component({
  selector: 'app-widget-item',
  templateUrl: './widget-item.component.html',
  styleUrls: ['./widget-item.component.scss'],
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
  public changeCompanyWidget: WidgetInfoShort;
  private currentSiteId;

  constructor(
    private decimalPipe: DecimalPipe,
    private sitesService: SitesService,
    private widgetService: WidgetService
  ) {
    this.widgetCurrentCompany = this.widgetService.getCompanyById(this.widget.companyId, this.widgetService.getCurrentCompanies());
    this.currentSiteId = this.sitesService.getCurrentSiteId();
  }

  ngOnInit(): void {
    if (!this.isConversionLoaded) {
      this.loadConversion();
    }
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
    this.widgetService.rename(this.currentSiteId, this.widget.id, data);
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
      (response: boolean) => {
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
    if (scope.widget.abtestInfo && scope.widget.abtestInfo.state) {
      toastr["error"]($translate.instant("abtest.toastr.widget.deleteiftest"), $translate.instant("abtest.toastr.widget.error"));
      return false;
    }
    swal({
        title: $translate.instant("widgetsList.widget.delete.title"),
        text: $translate.instant("widgetsList.widget.delete.text"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: $translate.instant("widgetsList.widget.delete.confirm"),
        cancelButtonText: $translate.instant("widgetsList.widget.delete.cancel"),
        closeOnConfirm: true,
        closeOnCancel: true },
      function(isConfirm){
        if (isConfirm) {
          WidgetService.deleteWidget(scope.currentSiteId, scope.widget.id).then(function (response) {
            if (response.code === 200) {
              toastr["success"]($translate.instant("widgetsList.widget.delete.desc"), $translate.instant("widgetsList.widget.delete.done"));
              SiteService.parseError(response);
            } else {
              SiteService.parseError(response);
            }
            EventsService.publish(EVENTS.updateWidgetsList, scope.currentSiteId);
          });
        }
      });
  }

  public abAction() {
    var currentSite = SiteService.getSiteById(scope.currentSiteId);

    // TODO: Check if it's payment query
    if (SiteService.isSiteHasExpTariff(currentSite)) {
      BillingService.checkTariffPlans(scope.currentSiteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("widgetsList.payment.abtest", {siteName: currentSite.name}));
    } else {
      ModalService.showModal({
        templateUrl: "../js/abtests/create-abtest-modal/create-abtest-modal-template.html",
        controller: "CreateABTestModalController",
        inputs: {
          currentSite: currentSite,
          widget: scope.widget,
          isContainerized: false
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $("body").removeClass("modal-open");
        });
      });
    }
  }

  public abIfNoTest() {
    if (!scope.widget.abtestInfo || !scope.widget.abtestInfo.state) {
      return true;
    }
  }

  public abIfTestOnWork() {
    if (scope.widget.abtestInfo && scope.widget.abtestInfo.state && (scope.widget.abtestInfo.state === "ACTIVE")) {
      return true;
    }
  }

  public abIfTestOnPause() {
    if (scope.widget.abtestInfo && scope.widget.abtestInfo.state && (scope.widget.abtestInfo.state === "PAUSED")) {
      return true;
    }
  }

  public goToTest() {
    window.location.href = "/abtests/active?testIdNum-" + scope.widget.abtestInfo.id;
  }

  public goToConstructor() {
    window.location.href = "/widgets/edit/" + scope.currentSiteId + "-" + scope.widget.id + "/";
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
