import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-item',
  templateUrl: './widget-item.component.html',
  styleUrls: ['./widget-item.component.scss']
})
export class WidgetItemComponent implements OnInit {
  @Input() public widget = {};
  @Input() public first = '';
  @Input() public last = '';
  @Input() private prev = '';
  @Input() private next = '';
  public widgetCurrentCompany = {};

  constructor() {
    this.widgetCurrentCompany = WidgetService.getCompanyById(scope.widget.companyId, WidgetService.getCurrentCompanies());
  }

  ngOnInit(): void {
  }

  public switchWidget(newValue) {
    if (scope.widget.active === newValue) return false;
    WidgetService.switchWidget(scope.currentSiteId, scope.widget.id, newValue).then(function(response) {
      if (!response) return false;
      scope.widget.active = newValue;
    });
  }

  public getConversion() {
    return $filter("number")(((100 * scope.widgetConversion.target) / scope.widgetConversion.shows), 2) + "%";
  }

  public updateWidgetName(data) {
    if (!data) {
      return false;
    }
    WidgetService.changeWidgetName(scope.currentSiteId, scope.widget.id, data);
  }

  public swapWidgets(isUp) {
    WidgetService.swapWidgets(scope.currentSiteId, scope.widget.id, isUp ? scope.prev.id : scope.next.id).then(function (response) {
      if (response.code !== 200) {
        SiteService.parseError(response);
      }
      EventsService.publish(EVENTS.updateWidgetsList, scope.currentSiteId);
    });
  }

  public startChangeCompany() {
    scope.changeCompanyWidget = {
      id: scope.widget.id,
      name: scope.widgetCurrentCompany.name,
      companyId: scope.widget.companyId
    };
  }

  public changeCurrentCompany(company) {
    scope.changeCompanyWidget.companyId = company.id;
    scope.changeCompanyWidget.name = company.name;
    scope.changeCompanyWidget.id = scope.widget.id;
  }

  public changeWidgetCompany() {
    WidgetService.changeWidgetCompany(scope.currentSiteId, scope.widget.id, scope.changeCompanyWidget.companyId).then(function (response) {
      if (response.code !== 200) {
        SiteService.parseError(response);
      }
      EventsService.publish(EVENTS.updateWidgetsList, scope.currentSiteId);
    });
  }

  public getFilteredCompanies() {
    return WidgetService.getCurrentCompanies().filter(function (item) {
      return (item.id !== scope.changeCompanyWidget.companyId) && !item.default;
    });
  }

  public resetChangeCompany() {
    scope.changeCompanyWidget = {
      id: "",
      name: "",
      companyId: ""
    };
  }

  public duplicateItem() {
    EventsService.publish(EVENTS.openCloneWidgetModal, scope.widget);
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

}
